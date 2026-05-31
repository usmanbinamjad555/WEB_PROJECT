import { OrderStatus } from '@prisma/client';

export interface CreateOrderItemsInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequestDTO {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  items: CreateOrderItemsInput[];
}

export interface OrderResponseDTO {
  id: string;
  tenantId: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: any;
  trackingNumber: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
}