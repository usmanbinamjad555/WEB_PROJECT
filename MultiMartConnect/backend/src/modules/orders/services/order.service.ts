import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderRequestDTO, OrderResponseDTO } from '../dtos/order.dto';
import { CustomerModel, ProductModel } from '../models/order.model';
import { KafkaProducerService } from '../../../services/producer.service';
import { SocketEngine } from '../../../services/socket.service';
import { CacheService } from '../../../services/cache.service';

export class OrderService {
  private repo = new OrderRepository();
  private kafka = new KafkaProducerService();
  private sockets = SocketEngine.getInstance();
  private cache = new CacheService();

  public async initializeOrderPlacement(tenantId: string, userId: string, dto: CreateOrderRequestDTO): Promise<OrderResponseDTO> {
    // 1. Resolve Customer profile using Mongoose query syntax
    const customer = await CustomerModel.findOne({ userId, tenantId });
    if (!customer) throw new Error('Customer identity mapping parameters missing.');

    // 2. Fetch products to prevent client pricing manipulation
    const targetProductIds = dto.items.map(i => i.productId);
    const databaseProducts = await ProductModel.find({
      _id: { $in: targetProductIds },
      tenantId
    });

    if (databaseProducts.length !== targetProductIds.length) {
      throw new Error('Some requested checkout items do not exist within this tenant workspace catalog.');
    }

    // 3. Execute database transactional persistence via the Mongoose repository layer
    const createdOrder = await this.repo.createTransactional(tenantId, customer._id.toString(), dto, databaseProducts);

    // 4. Transform Document payload to expected Output DTO format
    const responsePayload: OrderResponseDTO = {
      id: createdOrder._id.toString(),
      tenantId: createdOrder.tenantId,
      customerId: createdOrder.customerId,
      status: createdOrder.status,
      totalAmount: createdOrder.totalAmount,
      shippingAddress: createdOrder.shippingAddress,
      trackingNumber: null,
      createdAt: createdOrder.createdAt.toISOString(),
      items: createdOrder.items.map((item: any) => ({
        id: item._id?.toString() || item.productId,
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }))
    };

    // 5. Cache invalidation routine
    for (const item of responsePayload.items) {
       await this.cache.del(`tenant:${tenantId}:product:${item.productId}`);
    }

    // 6. Asynchronous streaming down event streams
    await this.kafka.emit('order-created', responsePayload.id, responsePayload);

    // 7. WebSocket pushes to specific isolated merchant channels
    this.sockets.emitToRole(tenantId, 'SELLER', 'NEW_ORDER_ALERT', {
       message: `A new sales volume transaction has been completed: Order ref ${responsePayload.id}`,
       amount: responsePayload.totalAmount
    });

    return responsePayload;
  }
}