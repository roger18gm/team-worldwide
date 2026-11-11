<script lang="ts">
  import { onMount } from "svelte";
  import { checkAuth, userStore } from "../js/auth.svelte";

  let { productId }: { productId: string } = $props();
  const baseURL = import.meta.env.PUBLIC_SERVER_URL;
  let status = $state<"idle" | "loading" | "saved" | "error">("idle");
  let errorMessage = $state("");

  function redirectToLogin() {
    window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`;
  }

  async function checkWishlist() {
    const userId = userStore.user?._id;
    if (!userId || !userStore.token) return;

    const response = await fetch(`${baseURL}users/${encodeURIComponent(userId)}/wishlist`, {
      headers: { Authorization: `Bearer ${userStore.token}` },
    });

    if (response.ok) {
      const wishlist = (await response.json()) as { productIds?: string[] };
      if (wishlist.productIds?.includes(productId)) status = "saved";
    }
  }

  async function addToWishlist() {
    if (!userStore.isLoggedIn || !userStore.user?._id || !userStore.token) {
      redirectToLogin();
      return;
    }

    status = "loading";
    errorMessage = "";

    try {
      const response = await fetch(
        `${baseURL}users/${encodeURIComponent(userStore.user._id)}/wishlist`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userStore.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        },
      );

      if (!response.ok) throw new Error("Unable to add this item to your wishlist.");
      status = "saved";
    } catch (error) {
      status = "error";
      errorMessage = error instanceof Error ? error.message : "Unable to add this item to your wishlist.";
    }
  }

  onMount(() => {
    checkAuth();
    checkWishlist().catch(() => {
      // The add action still works if the optional saved-state check fails.
    });
  });
</script>

<button
  class="wishlist-button"
  class:wishlist-button--saved={status === "saved"}
  type="button"
  disabled={status === "loading" || status === "saved"}
  aria-describedby={errorMessage ? `wishlist-error-${productId}` : undefined}
  onclick={addToWishlist}
>
  {#if status === "loading"}
    Saving…
  {:else if status === "saved"}
    Saved to Wishlist
  {:else}
    Add to Wishlist
  {/if}
</button>
{#if errorMessage}
  <p class="wishlist-error" id={`wishlist-error-${productId}`} role="alert">{errorMessage}</p>
{/if}

<style>
  .wishlist-button {
    background-color: transparent;
    border: 1px solid var(--secondary-color);
    color: var(--secondary-color);
    margin-top: 0.75rem;
  }

  .wishlist-button:hover,
  .wishlist-button:focus-visible,
  .wishlist-button--saved {
    background-color: var(--secondary-color);
    color: white;
  }

  .wishlist-button:disabled {
    cursor: default;
    opacity: 0.8;
  }

  .wishlist-error {
    color: #a12626;
    font-size: var(--small-font);
    margin: 0.5rem 0 0;
    text-align: center;
  }
</style>
