<script lang="ts">
  import type { Product } from "../js/types.mts";

  // Receive the product as a prop with TypeScript typing
  let { product }: { product: Product } = $props();
</script>

<li class="product-card">
  <a href={`/products/${product._id}/`}>
    <img
      src={product.images?.primarySmall || "/images/placeholder.jpg"}
      alt={product.name}
    />
    <h3 class="card__brand">{product.brand?.name || "Brand"}</h3>
    <h2 class="card__name">{product.name}</h2>
    <p class="product-card__price">${product.finalPrice}</p>
  </a>
</li>