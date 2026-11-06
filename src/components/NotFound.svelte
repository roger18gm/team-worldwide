<script lang="ts">
  // We use props to allow custom messages, but provide defaults
  let { 
    title = "404: Page Not Found", 
    message = "Sorry, we couldn't find the page you're looking for." 
  } = $props();
</script>

<div class="error-container">
  <h1>{title}</h1>
  <p>{message}</p>
  <a href="/" class="btn-home">Return to Home</a>
</div>

<style>
  .error-container {
    text-align: center;
    padding: 100px 20px;
    font-family: sans-serif;
  }
  h1 {
    color: #e63946;
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  p {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 30px;
  }
  .btn-home {
    display: inline-block;
    background-color: #2a9d8f;
    color: white;
    padding: 12px 24px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  .btn-home:hover {
    background-color: #21867a;
  }
</style>