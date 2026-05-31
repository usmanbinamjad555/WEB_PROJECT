import mongoose from 'mongoose';
import { OrderModel, InventoryModel, IOrder } from '../models/order.model';
import { CreateOrderRequestDTO } from '../dtos/order.dto';

export class OrderRepository {
  public async findByIdScoped(tenantId: string, orderId: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ _id: orderId, tenantId }).lean();
  }

  public async createTransactional(
    tenantId: string, 
    customerId: string, 
    orderPayload: CreateOrderRequestDTO, 
    catalogProducts: any[]
  ): Promise<any> {
    // Advanced Course Concept: Using native Mongoose Session Transactions for multi-document ACID compliance
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let absoluteSum = 0;
      const itemsToBuild = [];

      for (const interactionItem of orderPayload.items) {
        const structuralProduct = catalogProducts.find(p => p.id === interactionItem.productId || p._id.toString() === interactionItem.productId);
        
        // Atomically find inventory and check stock inside transaction session
        const inventoryRecord = await InventoryModel.findOne({ productId: structuralProduct._id }).session(session);

        if (!inventoryRecord || inventoryRecord.quantity < interactionItem.quantity) {
          throw new Error(`Inventory stock depletion event on product item identifier reference: ${structuralProduct._id}`);
        }

        // Deduct inventory items immediately inside the session
        inventoryRecord.quantity -= interactionItem.quantity;
        await inventoryRecord.save({ session });

        const lineItemCost = structuralProduct.price * interactionItem.quantity;
        absoluteSum += lineItemCost;

        itemsToBuild.push({
          productId: structuralProduct._id.toString(),
          title: structuralProduct.title,
          quantity: interactionItem.quantity,
          price: structuralProduct.price
        });
      }

      // Instantiate the order document within the current transactional window
      const [freshOrder] = await OrderModel.create([{
        tenantId,
        customerId,
        totalAmount: absoluteSum,
        shippingAddress: orderPayload.shippingAddress,
        status: 'PENDING',
        items: itemsToBuild
      }], { session });

      // Commit changes across collections
      await session.commitTransaction();
      session.endSession();

      return freshOrder;
    } catch (error) {
      // Abort structural operations if anything fails to avoid stock anomalies
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}