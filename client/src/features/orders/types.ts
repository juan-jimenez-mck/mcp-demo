import type { Account } from '../accounts/types';
import type { Product } from '../products/types';

export type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: Product;
  orderId: number;
};

export type Order = {
  id: number;
  accountId: number;
  salesRepId: number;
  account: Account;
  paymentStatus: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  collectionDate: string;
  items: OrderItem[];
};
