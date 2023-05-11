import { BaseModel } from "@models";

export interface ProductModel extends BaseModel {
	title: string;
	price: number;
	description: string;
	images: string[];
	category: CategoryModel;
}

export interface CategoryModel extends BaseModel {
	name: string;
	image: string;
}
