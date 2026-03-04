<style global lang="scss">
  .clamp-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3; /* Ensure it clamps to 3 lines */
  }

  .vanilla-post-card {
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    border: var(--bs-border-width) solid var(--bs-border-color);
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--bs-box-shadow-lg);

      .post-card-thumbnail-wrapper img {
        transform: scale(1.05);
      }
    }
  }

  .post-card-thumbnail-wrapper {
    display: block;
    width: 100%;
    overflow: hidden;
  }

  .post-card-thumbnail-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease-in-out;
  }
</style>

<div class="card vanilla-post-card h-100 rounded rounded-5">
  {#if (typeof themeSettings.postCoverImageEnabled === "undefined" ? true : themeSettings.postCoverImageEnabled) && post.thumbnailUrl}
    <a
      href="/post/{post.url}"
      class="post-card-thumbnail-wrapper focus-ring d-block">
      <div class="ratio ratio-16x9">
        <img
          src={post.thumbnailUrl}
          class="card-img-top"
          alt={post.title}
          title={post.title} />
      </div>
    </a>
  {/if}
  <div class="card-body d-flex flex-column">
    <div class="d-flex justify-content-between align-items-start mb-3 gap-2">
      <a
        class="text-decoration-none focus-ring rounded text-reset flex-grow-1"
        href="/post/{post.url}">
        <h3 class="mb-0 text-break h4 fw-bold">
          {truncate(post.title, 100)}{@html post.title.length > 100
            ? "&hellip;"
            : ""}
        </h3>
      </a>
      {#if post.category.title !== "-"}
        <a
          class="badge text-bg-primary text-decoration-none rounded-pill focus-ring flex-shrink-0"
          href="/?category={post.category.url}"
          use:tooltip={[$_("buttons.filter"), { placement: "bottom" }]}>
          {post.category.title}
        </a>
      {/if}
    </div>

    <div
      class="card-text text-break word-break text-muted mb-4 flex-grow-1"
      class:clamp-text={!detail}>
      {@html post.text}
    </div>

    <div class="d-flex align-items-center justify-content-between mt-auto">
      {#if detail}
        {#if typeof themeSettings.postViewCountEnabled === "undefined" ? true : themeSettings.postViewCountEnabled}
          <div
            class="text-muted small d-flex align-items-center"
            use:tooltip={[$_("components.post.view"), { placement: "bottom" }]}>
            <i class="fas fa-eye me-2"></i>
            {post.views}
          </div>
        {:else}
          <div></div>
        {/if}

        <div class="d-flex align-items-center gap-2">
          <Date time={post.date} class="text-muted small" />
          <a
            href="/player/{post.writer.username}"
            class="d-inline-block rounded focus-ring rounded-circle"
            hidden={typeof themeSettings.postAuthorImageEnabled === "undefined"
              ? false
              : !themeSettings.postAuthorImageEnabled}>
            <img
              src="/api/profile/picture/{post.writer.username}?{$avatarVersion}"
              alt={post.writer.username}
              width="32"
              height="32"
              use:tooltip={[post.writer.username, { placement: "bottom" }]}
              class="rounded-circle border" />
          </a>
        </div>
      {:else}
        {#if typeof themeSettings.postReadMoreButtonEnabled === "undefined" ? true : themeSettings.postReadMoreButtonEnabled}
          <a
            class="mb-0 p-0 btn btn-link text-decoration-none focus-ring fw-bold"
            href="/post/{post.url}">
            {$_("components.post.read-more")}
            <i class="fas fa-long-arrow-alt-right ms-1"></i>
          </a>
        {:else}
          <div></div>
        {/if}

        <div class="d-flex align-items-center gap-2">
          <Date time={post.date} class="text-muted small" />
          <a
            class="d-inline-block rounded focus-ring rounded-circle"
            href="/player/{post.writer.username}"
            hidden={typeof themeSettings.postAuthorImageEnabled === "undefined"
              ? false
              : !themeSettings.postAuthorImageEnabled}>
            <img
              src="/api/profile/picture/{post.writer.username}?{$avatarVersion}"
              alt={post.writer.username}
              width="28"
              height="28"
              use:tooltip={[post.writer.username, { placement: "bottom" }]}
              class="rounded-circle border border-2 border-white shadow-sm" />
          </a>
        </div>
      {/if}
    </div>
  </div>
</div>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { truncate } from "$lib/string.util";
  import tooltip from "$lib/tooltip.util";

  import Date from "$lib/components/Date.svelte";

  export let post;
  export let detail = false;

  import { avatarVersion } from "$lib/Store";
  const themeSettings = getContext("themeSettings");
</script>
