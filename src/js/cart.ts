import { getLocalStorage, setLocalStorage } from "./utils.mts";
import type { Product } from "./types.mts";

function renderCartContents() {
  const storedCart = getLocalStorage("so-cart");
  const cartItems: Product[] = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart as Product]
      : [];
  const htmlItems = cartItems.map((item: Product) => cartItemTemplate(item));
  const listEl = document.querySelector(".product-list");
  if (listEl) listEl.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item: Product) {
  // We add the 'X' span with a data-id to identify which product to remove
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
  <span class="remove-item" data-id="${item.id}" style="cursor: pointer; color: red; font-weight: bold; margin-left: 10px;">&times;</span>
</li>`;

  return newItem;
}

// Function to remove an item from the cart based on its ID
function removeFromCart(id: string) {
  const storedCart = getLocalStorage("so-cart");
  const cartItems: Product[] = Array.isArray(storedCart)
    ? storedCart
    : storedCart
      ? [storedCart as Product]
      : [];

  // Filter out the item that matches the ID
  const updatedCart = cartItems.filter((item) => item.id !== id);
  
  // Save the new cart back to localStorage
  setLocalStorage("so-cart", updatedCart);
  
  // Re-render the list so the removed item disappears
  renderCartContents();
}

// Event Delegation: Listen for clicks on the document
document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  
  // If the clicked element has the class 'remove-item'
  if (target.classList.contains("remove-item")) {
    const productId = target.getAttribute("data-id");
    if (productId) {
      removeFromCart(productId);
    }
  }
});

renderCartContents();
