import type { Product } from "./types.mts";

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

function convertToJson(res: Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// Fetch products from the API filtered by category (Phase 03)
export function getProducts(category = "tents") {
  return fetch(`${baseURL}products?category=${category}`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id: string) {
  const response = await fetch(baseURL + `products/${id}`);
  const product = (await convertToJson(response)) as Product;
  return product;
}
