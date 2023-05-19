import { API_URL } from '@utils';
import { ProductModel } from '@models';


export const getProduct = async (id: number): Promise<ProductModel> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  const data = await response.json();
  return data;
};