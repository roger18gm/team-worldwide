<script lang="ts">
  import { onMount } from "svelte";

  interface ProductComment {
    id: string;
    name: string;
    comment: string;
    createdAt: string;
  }

  let {
    productId,
    productName,
  }: { productId: string; productName: string } = $props();

  const storageKey = "sleep-outside-product-comments";
  let comments = $state<ProductComment[]>([]);
  let name = $state("");
  let comment = $state("");
  let errorMessage = $state("");
  let isReady = $state(false);

  function readComments(): Record<string, ProductComment[]> {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveComments(allComments: Record<string, ProductComment[]>) {
    localStorage.setItem(storageKey, JSON.stringify(allComments));
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(date));
  }

  function submitComment(event: SubmitEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (!trimmedName || !trimmedComment) {
      errorMessage = "Please enter your name and a comment.";
      return;
    }

    const allComments = readComments();
    const newComment: ProductComment = {
      id: crypto.randomUUID(),
      name: trimmedName,
      comment: trimmedComment,
      createdAt: new Date().toISOString(),
    };

    allComments[productId] = [newComment, ...(allComments[productId] ?? [])];
    saveComments(allComments);
    comments = allComments[productId];
    comment = "";
    errorMessage = "";
  }

  onMount(() => {
    comments = readComments()[productId] ?? [];
    isReady = true;
  });
</script>

<section class="reviews" aria-labelledby="reviews-title">
  <div class="reviews__heading">
    <div>
      <p class="reviews__eyebrow">Community notes</p>
      <h2 id="reviews-title">Product comments</h2>
    </div>
    {#if isReady}
      <p class="reviews__count">{comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
    {/if}
  </div>

  <form class="comment-form" onsubmit={submitComment}>
    <h3>Share your thoughts</h3>
    <p class="comment-form__note">Comments are saved in this browser for this product.</p>

    <label for={`comment-name-${productId}`}>Name</label>
    <input
      id={`comment-name-${productId}`}
      type="text"
      maxlength="60"
      placeholder="Your name"
      bind:value={name}
      required
    />

    <label for={`comment-body-${productId}`}>Comment</label>
    <textarea
      id={`comment-body-${productId}`}
      maxlength="500"
      rows="4"
      placeholder={`What do you think about ${productName}?`}
      bind:value={comment}
      required
    ></textarea>

    {#if errorMessage}
      <p class="comment-form__error" role="alert">{errorMessage}</p>
    {/if}

    <button type="submit">Post comment</button>
  </form>

  {#if isReady && comments.length > 0}
    <ol class="comment-list" aria-label="Comments">
      {#each comments as item (item.id)}
        <li class="comment-card">
          <div class="comment-card__meta">
            <strong>{item.name}</strong>
            <time datetime={item.createdAt}>{formatDate(item.createdAt)}</time>
          </div>
          <p>{item.comment}</p>
        </li>
      {/each}
    </ol>
  {:else if isReady}
    <p class="comment-empty">Be the first to share a comment about this product.</p>
  {/if}
</section>

<style>
  .reviews {
    border-top: 2px solid var(--primary-color);
    margin: 2rem auto 0;
    max-width: 760px;
    padding: 2rem 1rem 3rem;
  }

  .reviews__heading {
    align-items: end;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .reviews__eyebrow {
    color: var(--secondary-color);
    font-size: var(--small-font);
    font-weight: bold;
    letter-spacing: 0.08em;
    margin: 0 0 0.35rem;
    text-transform: uppercase;
  }

  .reviews h2,
  .reviews h3 {
    margin: 0;
  }

  .reviews h2 {
    font-size: 1.7rem;
  }

  .reviews__count,
  .comment-form__note,
  .comment-empty {
    color: #666;
    font-size: var(--small-font);
  }

  .reviews__count {
    margin: 0;
    white-space: nowrap;
  }

  .comment-form {
    background: #f7f7f4;
    border: 1px solid var(--light-grey);
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
  }

  .comment-form h3 {
    font-size: 1.1rem;
  }

  .comment-form__note {
    margin: 0 0 0.5rem;
  }

  .comment-form label {
    font-size: var(--small-font);
    font-weight: bold;
  }

  .comment-form input,
  .comment-form textarea {
    border: 1px solid #aaa;
    border-radius: 0;
    font: inherit;
    padding: 0.65rem;
    width: 100%;
  }

  .comment-form textarea {
    resize: vertical;
  }

  .comment-form button {
    margin: 0.5rem 0 0;
    width: fit-content;
  }

  .comment-form__error {
    color: #a12626;
    font-size: var(--small-font);
    margin: 0.25rem 0 0;
  }

  .comment-list {
    display: grid;
    gap: 1rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .comment-card {
    border-bottom: 1px solid var(--light-grey);
    padding-bottom: 1rem;
  }

  .comment-card__meta {
    align-items: baseline;
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    margin-bottom: 0.45rem;
  }

  .comment-card time {
    color: #666;
    font-size: var(--small-font);
  }

  .comment-card p {
    line-height: 1.45;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .comment-empty {
    margin: 1.5rem 0 0;
  }

  @media (max-width: 500px) {
    .comment-card__meta {
      align-items: start;
      flex-direction: column;
      gap: 0.2rem;
    }
  }
</style>
