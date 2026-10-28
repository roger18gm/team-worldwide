import { defineCollection } from "astro:content";

const products = defineCollection({
  loader: async () => {
    let baseUrl = import.meta.env.PUBLIC_SERVER_URL;

    // Automatically add the missing slash if it's not there
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }

    // Construct the correct URL
    const fullUrl = baseUrl + "products?limit=200";

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.results;
    } catch {
      // Prevent build from crashing if API is asleep
      return [];
    }
  },
});

export const collections = { products };