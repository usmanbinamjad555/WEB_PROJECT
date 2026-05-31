import { Schema, model, Document } from 'mongoose';

// 1. Inventory Schema Definition
export interface IInventory extends Document {
  productId: string;
  quantity: number;
}
const InventorySchema = new Schema<IInventory>({
  productId: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export const InventoryModel = model<IInventory>('Inventory', InventorySchema);

// 2. Product Schema Definition
export interface IProduct extends Document {
  tenantId: string;
  sellerId: string;
  title: string;
  price: number;
  isActive: boolean;
}
const ProductSchema = new Schema<IProduct>({
  tenantId: { type: String, required: true },
  sellerId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound index to guarantee tenant isolation and performance lookup
ProductSchema.index({ tenantId: 1, _id: 1 });
export const ProductModel = model<IProduct>('Product', ProductSchema);

// 3. Customer Schema Definition
export interface ICustomer extends Document {
  tenantId: string;
  userId: string;
}
const CustomerSchema = new Schema<ICustomer>({
  tenantId: { type: String, required: true },
  userId: { type: String, required: true, unique: true }
}, { timestamps: true });

CustomerSchema.index({ tenantId: 1, userId: 1 });
export const CustomerModel = model<ICustomer>('Customer', CustomerSchema);

// 4. Order Schema Definition
export interface IOrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  tenantId: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  items: IOrderItem[];
}

const OrderSchema = new Schema<IOrder>({
  tenantId: { type: String, required: true },
  customerId: { type: String, required: true, ref: 'Customer' },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
    default: 'PENDING' 
  },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
}, { timestamps: true });

OrderSchema.index({ tenantId: 1, customerId: 1 });
OrderSchema.index({ status: 1 });

export const OrderModel = model<IOrder>('Order', OrderSchema);