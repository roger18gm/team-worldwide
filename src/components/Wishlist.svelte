<script lang="ts">
  import { onMount } from "svelte";
  import { checkAuth, logout, userStore } from "../js/auth.svelte";
  import { findProductById } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";

  type WishlistResponse = { productIds?: string[] };
  const baseURL = import.meta.env.PUBLIC_SERVER_URL;
  let products = $state<Product[]>([]);
  let isLoading = $state(true);
  let errorMessage = $state("");
  let removingId = $state("");

  function loginRedirect() {
    window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`;
  }

  async function loadWishlist() {
    const userId = userStore.user?._id;
    if (!userId || !userStore.token) {
      isLoading = false;
      loginRedirect();
      return;
    }
    try {
      const response = await fetch(`${baseURL}users/${encodeURIComponent(userId)}/wishlist`, {
        headers: { Authorization: `Bearer ${userStore.token}` },
      });
      if (response.status === 401 || response.status === 403) {
        logout();
        loginRedirect();
        return;
      }
      if (!response.ok) throw new Error("Unable to load your wishlist.");
      const wishlist = (await response.json()) as WishlistResponse;
      const resolvedProducts = await Promise.all(
        (wishlist.productIds ?? []).map((id) => findProductById(id)),
      );
      products = resolvedProducts.filter((product): product is Product => product !== null);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unable to load your wishlist.";
    } finally {
      isLoading = false;
    }
  }

  async function removeProduct(productId: string) {
    const userId = userStore.user?._id;
    if (!userId || !userStore.token) {
      loginRedirect();
      return;
    }
    removingId = productId;
    errorMessage = "";
    try {
      const response = await fetch(
        `${baseURL}users/${encodeURIComponent(userId)}/wishlist/${encodeURIComponent(productId)}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${userStore.token}` } },
      );
      if (response.status === 401 || response.status === 403) {
        logout();
        loginRedirect();
        return;
      }
      if (!response.ok) throw new Error("Unable to remove this item.");
      products = products.filter((product) => product.id !== productId);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Unable to remove this item.";
    } finally {
      removingId = "";
    }
  }

  onMount(() => {
    checkAuth();
    if (userStore.isLoggedIn) loadWishlist();
    else {
      isLoading = false;
      loginRedirect();
    }
  });
</script>

<section aria-labelledby="wishlist-title">
  <div class="wishlist-heading">
    <div>
      <p class="eyebrow">Saved for later</p>
      <h1 id="wishlist-title">My Wishlist</h1>
      <p class="wishlist-intro">Keep track of the gear you want for your next adventure.</p>
    </div>
    {#if !isLoading && products.length > 0}
      <p class="wishlist-count">{products.length} {products.length === 1 ? "item" : "items"}</p>
    {/if}
  </div>

  {#if isLoading}
    <p class="wishlist-status" role="status">Loading your wishlist…</p>
  {:else if errorMessage}
    <div class="wishlist-status wishlist-status--error" role="alert">
      <p>{errorMessage}</p>
      <button type="button" onclick={loadWishlist}>Try again</button>
    </div>
  {:else if products.length === 0}
    <div class="wishlist-status wishlist-status--empty">
      <p class="empty-icon" aria-hidden="true">♡</p>
      <h2>Your wishlist is empty</h2>
      <p>When you find gear you love, save it here for easy access later.</p>
      <a class="wishlist-link" href="/product-list/">Explore products</a>
    </div>
  {:else}
    <ul class="wishlist-grid">
      {#each products as product (product.id)}
        <li class="wishlist-card">
          <a class="wishlist-card__image" href={`/products/${product.id}/`}>
            <img src={product.images.primaryMedium} alt={product.name} />
          </a>
          <div class="wishlist-card__details">
            <p class="card__brand">{product.brand.name}</p>
            <h2 class="card__name"><a href={`/products/${product.id}/`}>{product.nameWithoutBrand}</a></h2>
            <p class="wishlist-card__price">${product.finalPrice.toFixed(2)}</p>
            <button
              class="remove-button"
              type="button"
              disabled={removingId === product.id}
              onclick={() => removeProduct(product.id)}
            >
              {removingId === product.id ? "Removing…" : "Remove"}
            </button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  section { padding: 2rem 1rem 3rem; }
  .wishlist-heading { align-items: end; border-bottom: 2px solid var(--primary-color); display: flex; justify-content: space-between; gap: 1rem; margin: 0 auto 2rem; max-width: 1000px; padding-bottom: 1rem; }
  .eyebrow { color: var(--secondary-color); font-size: var(--small-font); font-weight: bold; letter-spacing: 0.08em; margin: 0 0 0.4rem; text-transform: uppercase; }
  h1, h2, p { margin-top: 0; }
  h1 { font-family: var(--font-headline); font-size: clamp(2rem, 5vw, 3rem); font-weight: normal; margin-bottom: 0.4rem; }
  .wishlist-intro, .wishlist-count { color: #5d5d5d; margin-bottom: 0; }
  .wishlist-count { white-space: nowrap; }
  .wishlist-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); list-style: none; margin: 0 auto; max-width: 1000px; padding: 0; }
  .wishlist-card { border: 1px solid var(--light-grey); display: flex; flex-direction: column; min-width: 0; }
  .wishlist-card__image { background: #f5f5f2; display: block; padding: 1rem; }
  .wishlist-card__image img { aspect-ratio: 1; display: block; object-fit: contain; width: 100%; }
  .wishlist-card__details { display: flex; flex: 1; flex-direction: column; padding: 1rem; }
  .card__brand { color: #666; font-size: var(--small-font); margin-bottom: 0.35rem; }
  .card__name { font-size: 1.1rem; margin-bottom: 0.75rem; }
  .card__name a { color: var(--dark-grey); }
  .wishlist-card__price { color: var(--secondary-color); font-weight: bold; margin-bottom: 1rem; }
  .remove-button { background: transparent; border: 1px solid var(--secondary-color); color: var(--secondary-color); font-size: 0.9rem; margin: auto 0 0; padding: 0.45rem 0.8rem; }
  .remove-button:hover, .remove-button:focus-visible { background: var(--secondary-color); color: white; }
  .remove-button:disabled { cursor: wait; opacity: 0.6; }
  .wishlist-status { margin: 4rem auto; max-width: 500px; text-align: center; }
  .wishlist-status--error { color: #a12626; }
  .wishlist-status--error button { margin-top: 0.5rem; }
  .empty-icon { color: var(--tertiary-color); font-size: 4rem; line-height: 1; margin-bottom: 0.5rem; }
  .wishlist-status h2 { font-size: 1.5rem; }
  .wishlist-link { background: var(--secondary-color); color: white; display: inline-block; margin-top: 0.75rem; padding: 0.7rem 1.2rem; }
  .wishlist-link:hover { color: white; }
  @media (max-width: 500px) { .wishlist-heading { align-items: start; flex-direction: column; } }
</style>
