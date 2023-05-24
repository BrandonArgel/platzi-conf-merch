import { CartModel } from "@models";

export interface BuyerModel {
  name: string;
  email: string;
  direction: string;
  department: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  phone: string;
  cart: CartModel[];
  total: number;
}