import { BaseModel } from "@models";

export interface ProductModel extends BaseModel {
	title: string;
	price: number;
	description: string;
	images: string[];
	category: CategoryModel;
	stock: number;
}

export interface CategoryModel extends BaseModel {
	name: string;
	image: string;
}

export interface CartModel extends Omit<ProductModel, "createdAt" | "updatedAt" | "category"> {
	quantity: number;
}