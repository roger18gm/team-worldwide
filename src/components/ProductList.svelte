<script lang="ts">
  import { onMount } from "svelte";
  import { getProducts } from "../js/productData.mts";
  import type { Product } from "../js/types.mts";
  import { getParam } from "../js/utils.mts";
  import ProductSummary from "./ProductSummary.svelte";
  import Breadcrumbs from "./Breadcrumbs.svelte"; // <-- Import added

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

  // $derived.by is the recommended way for multi-step logic (like sorting)
  let sortedProducts = $derived.by(() => {
    let sorted = [...products];

    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.finalPrice - b.finalPrice); 
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.finalPrice - a.finalPrice);
    }
    
    return sorted;
  });
</script>

<!-- Breadcrumb inserted right below the navbar logic -->
<!-- It receives the category and the total count of products -->
<Breadcrumbs {category} itemCount={products.length} />

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
  {#each sortedProducts as product (product.id)} 
    <ProductSummary {product} />
  {/each}
</ul>