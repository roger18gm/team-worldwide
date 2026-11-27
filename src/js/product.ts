import type { Product } from "./types.mts";
import { getLocalStorage, setLocalStorage } from "./utils.mts";
import { findProductById } from "./productData.mts";

function addProductToCart(product: Product) {
  const storedCart = getLocalStorage("so-cart");
  const cartItems: Product[] = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart as Product]
      : [];
  setLocalStorage("so-cart", [...cartItems, product]);
  
  // Dispatch event to trigger the header animation and update count
  document.dispatchEvent(new CustomEvent("cartUpdated"));
}

// add to cart button event handler
async function addToCartHandler(e: Event) {
  const target = e.target as HTMLButtonElement;
  if (target.dataset.id) {
    const product = await findProductById(target.dataset.id);
    
    // --- FIX: Check if the product exists before adding it to the cart ---
    if (product) {
      addProductToCart(product);
    } else {
      console.error("Product not found");
    }
  }
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  ?.addEventListener("click", addToCartHandler);
