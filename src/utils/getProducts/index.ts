import { ProductModel } from '@models';

const API_URL = 'https://api.escuelajs.co/api/v1';
const LIMIT = 20;

export const getProducts = async (query: URLSearchParams): Promise<ProductModel[]> => {
  const newQuery = new URLSearchParams(query);
  // Obtain current query params
  const params = {
    search: newQuery.get("search"),
    page: newQuery.get("page") ?? 1,
    category: newQuery.get("category"),
    // price: newQuery.get("price"),
    // min: newQuery.get("min"),
    // max: newQuery.get("max"),
  }

  console.log({ page: params.page })

  // Set actual query params:
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
  // if (params.price) {
  //   newQuery.set("price", params.price);
  // }

  /* Min */
  // if (params.min && params.max) {
  //   newQuery.set("price_min", params.min);
  //   newQuery.set("price_max", params.max);
  // }

  // Remove first query params
  Object.keys(params).forEach((key) => {
    newQuery.delete(key);
  });

  console.log(newQuery.toString());

  return await fetch(`${API_URL}/products?${query.toString()}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
};