import { API_URL } from '@utils';
import { ProductModel } from '@models';

const LIMIT = 20;

export const getProducts = async (query: URLSearchParams): Promise<ProductModel[]> => {
  const newQuery = new URLSearchParams();
  const params = {
    search: query.get("search"),
    page: query.get("page") ?? 1,
    category: query.get("category"),
    price: query.get("price"),
    min: query.get("min"),
    max: query.get("max"),
  }

  /* Pagination */
  newQuery.set("offset", `${(Number(params.page) - 1) * LIMIT}`);
  newQuery.set("limit", `${LIMIT}`);

  /* Search */
  if (params.search) {
    newQuery.set("title", params.search);
  }

  /* Category */
  if (params.category) {
    newQuery.set("categoryId", params.category);
  }

  /* Price */
  if (params.price) {
    newQuery.set("price", params.price);
  }

  /* Min */
  if (params.min && params.max) {
    newQuery.set("price_min", params.min);
    newQuery.set("price_max", params.max);
  }

  return await fetch(`${API_URL}/products?${newQuery.toString()}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
};