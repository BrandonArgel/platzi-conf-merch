import { Product } from '@models';

export const getProducts = async (): Promise<Product[]> => {
  return await fetch('https://fakestoreapi.com/products')
    .then((res) => res.json())
    .catch((err) => console.log(err));
};