import { getLocalStorage } from "./utils.mts";
import type { Product } from "./types.mts";

function renderCartContents() {
  const storedCart = getLocalStorage("so-cart");
  const cartItems: Product[] = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart as Product]
      : [];

  const listEl = document.querySelector(".product-list");
  if (!listEl) return;

  // Check if the cart is empty to prevent rendering errors
  if (cartItems.length === 0) {
    listEl.innerHTML = `<li class="cart-card" style="text-align: center; padding: 20px; font-size: 1.2rem;">
      Your cart is currently empty.
    </li>`;
    return; 
  }

  // If there are items, render them normally
  const htmlItems = cartItems.map((item: Product) => cartItemTemplate(item));
  listEl.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item: Product) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.images?.primaryExtraLarge ?? ""}"
      alt="${item.name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.name}</h2>
  </a>
  <p class="cart-card__color">${item.colors[0].colorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.finalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
