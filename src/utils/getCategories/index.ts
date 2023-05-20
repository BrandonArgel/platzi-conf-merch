import { API_URL } from '@utils';
import { ProductModel } from '@models';


export const getCategories = async (): Promise<ProductModel[]> => {
  return await fetch(`${API_URL}/categories`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
};