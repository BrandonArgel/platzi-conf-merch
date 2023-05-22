import { API_URL, randomNumberInRange } from '@utils';
import { ProductModel } from '@models';


export const getProduct = async (id: number): Promise<ProductModel> => {
  return await fetch(`${API_URL}/products/${id}`).then((res) => res.json()).then((data) => ({
    ...data,
    stock: randomNumberInRange(1, 10),
  })).catch((err) => console.log(err));
};