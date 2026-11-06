import type { Product } from "./types.mts";

const baseURL = import.meta.env.PUBLIC_SERVER_URL;

function convertToJson(res: Response) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export function getProducts(category = "tents") {
  return fetch(baseURL + `products?category=${category}`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id: string) {
  try {
    const response = await fetch(baseURL + `products/${id}`);
    
    // If the response is not ok (e.g., 404), return null instead of throwing an error
    if (!response.ok) {
      return null;
    }
    
    const product = (await response.json()) as Product;
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
