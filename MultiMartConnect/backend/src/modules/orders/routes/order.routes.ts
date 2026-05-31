import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { tenantInterceptor } from '../../../middlewares/tenant.middleware';
import { authenticatingPipeline } from '../../../middlewares/auth.middleware';
import { authorizeRoles } from '../../../middlewares/role.middleware';
import { validatePayload } from '../../../middlewares/validation.middleware';
import { CreateOrderSchema } from '../validators/order.validator';

const router = Router();
const controller = new OrderController();

router.post(
  '/',
  tenantInterceptor,
  authenticatingPipeline,
  authorizeRoles('CUSTOMER'), // Passed as a clean string literal mapping natively
  validatePayload(CreateOrderSchema),
  controller.createNewOrder
);

export default router;