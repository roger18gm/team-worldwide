<script lang="ts">
  // Props to define the breadcrumb content
  let { category = "", itemCount = 0, isProductPage = false } = $props();

  // Build the URL for the category filter
  // Adjust this if your Astro routes use a different pattern (e.g., /category/[slug])
  let categoryUrl = $derived(`/products?category=${category.toLowerCase()}`);
</script>

<nav class="breadcrumbs" aria-label="Breadcrumb">
  <ul>
    <!-- Home link is always visible -->
    <li><a href="/">Home</a></li>
    
    {#if category}
      <li>
        {#if isProductPage}
          <!-- On Product Detail Page: Show category as a link -->
          <a href={categoryUrl}>{category}</a>
        {:else}
          <!-- On Product List Page: Show category and item count -->
          <span>{category} &rarr; ({itemCount} items)</span>
        {/if}
      </li>
    {/if}
  </ul>
</nav>