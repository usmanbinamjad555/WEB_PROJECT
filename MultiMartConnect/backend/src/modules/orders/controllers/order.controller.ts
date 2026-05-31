import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { CreateOrderRequestDTO } from '../dtos/order.dto';

export class OrderController {
  private service = new OrderService();

  public createNewOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const activeTenant = (req as any).tenantId;
      const actingUserId = (req as any).user!.id;
      const orderPayload = req.body as CreateOrderRequestDTO;

      const results = await this.service.initializeOrderPlacement(activeTenant, actingUserId, orderPayload);
      
      res.status(201).json({
        success: true,
        message: 'Order recorded into pipeline ledger successfully.',
        data: results
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'System was unable to satisfy layout order transaction execution.'
      });
    }
  };
}