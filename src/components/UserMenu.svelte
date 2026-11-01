<script lang="ts">
  let visible = $state(false);

  function toggleMenu() {
    // We no longer need e.stopPropagation() because we use 'capture' in the listener
    visible = !visible;
  }

  function closeMenu() {
    visible = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeMenu();
    }
  }

  // $effect is the modern Svelte 5 way to handle side effects and cleanup
  $effect(() => {
    // We pass 'true' as the third argument to use the capture phase.
    // This intercepts the click before it reaches the button, preventing the open/close loop.
    window.addEventListener("click", closeMenu, true);
    window.addEventListener("scroll", closeMenu);
    window.addEventListener("keydown", handleKeydown);

    // The cleanup function runs automatically when the component unmounts
    return () => {
      window.removeEventListener("click", closeMenu, true);
      window.removeEventListener("scroll", closeMenu);
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div class="user">
  <!-- Call toggleMenu without the event -->
  <button
    class="user__button"
    aria-label="user management"
    title="User Management"
    onclick={toggleMenu}
  >
    <img src="/images/noun-hiker.svg" alt="user icon" />
  </button>
  
  <nav class="user__menu" class:open={visible}>
    <a href="/login">Login</a>
    <a href="/profile">Profile</a>
    <a href="/orders">Orders</a>
  </nav>
</div>

<style>
  .user {
    display: flex;
    align-items: flex-end;
    position: relative; /* Required to position the dropdown menu */
  }
  
  /* Styles for the dropdown menu */
  .user__menu {
    display: none; /* Hidden by default */
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex-direction: column;
    min-width: 150px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 100;
    padding: 5px 0;
  }

  /* When the .open class is present, we show the menu */
  .user__menu.open {
    display: flex;
  }

  .user__menu a {
    padding: 10px 15px;
    text-decoration: none;
    color: black;
    display: block;
  }

  .user__menu a:hover {
    background-color: #f0f0f0;
  }
</style>