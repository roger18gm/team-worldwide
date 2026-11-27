<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mts";
  import ProductSummary from "./ProductSummary.svelte";

  // Reactive state for data fetched from the API
  let category = $state("");
  let products: Product[] = $state([]);
  
  // Reactive state for the current sorting criterion
  let sortBy = $state("default"); 

  async function init() {
    category = getParam("category") || "";
    const data = await getProducts(category);
    products = data.results;
  }

  onMount(init);

  // $derived.by is the recommended way for multi-step logic (like sorting) [citation:2][citation:4]
  let sortedProducts = $derived.by(() => {
    // Create a shallow copy to avoid mutating the original $state array [citation:3]
    let sorted = [...products];

    // Sort based on the selected criterion
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      // Use 'finalPrice' as it's the actual selling price in your schema
      sorted.sort((a, b) => a.finalPrice - b.finalPrice); 
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.finalPrice - a.finalPrice);
    }
    
    return sorted;
  });
</script>

<div class="header-container">
  <h2>Top products: {category}</h2>
  
  <div class="sort-controls">
    <label for="sort-select">Sort by:</label>
    <select id="sort-select" bind:value={sortBy}>
      <option value="default">Relevance</option>
      <option value="name">Name (A-Z)</option>
      <option value="price-asc">Price (Low to High)</option>
      <option value="price-desc">Price (High to Low)</option>
    </select>
  </div>
</div>

<ul class="product-list">
  <!-- Iterate over the derived sorted list, using a unique key for efficient updates -->
  {#each sortedProducts as product (product.id)} 
    <ProductSummary {product} />
  {/each}
</ul>
