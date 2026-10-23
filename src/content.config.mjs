import { defineCollection } from "astro:content";

const products = defineCollection({
  loader: async () => {
    // Get the base URL from the environment variable
    let baseUrl = import.meta.env.PUBLIC_SERVER_URL;

    // 1. Ensure the URL ends with a slash
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }

    // 2. Ensure the URL includes the API path (in case Netlify only has the domain)
    if (!baseUrl.includes("/api/v1/")) {
       baseUrl += "api/v1/";
    }

    const fullUrl = baseUrl + "products?limit=200";

    try {
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results;
    } catch {
      // If the API fails or is asleep, return an empty array to prevent the build from crashing
      return [];
    }
  },
});

export const collections = { products };