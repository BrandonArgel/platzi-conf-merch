import { BaseModel, CartModel } from "@models";

export interface BuyerModel extends BaseModel {
  name: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  phone: string;
  cart: CartModel[];
  total: number;
  OrderId: number;
}

export type BuyerModelCreate = Omit<BuyerModel, "cart" | "total" | "OrderId" | "createdAt" | "updatedAt">