<style global lang="scss">
  .clamp-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .clamp-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .vanilla-post-card {
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
    border: var(--bs-border-width) solid var(--bs-border-color);
    overflow: hidden;
    background-color: var(--bs-body-bg);

    &:not(.post-detail) {
      min-height: 240px;
    }

    &.is-overlay {
      background-color: #000;

      .card-img-overlay {
        background: linear-gradient(
          0deg,
          var(--bs-body-bg) 0%,
          color-mix(in srgb, var(--bs-body-bg), transparent 40%) 50%,
          color-mix(in srgb, var(--bs-body-bg), transparent 90%) 100%
        );
        transition: background 0.4s ease;
      }

      .text-muted,
      .text-white-50,
      .link-secondary {
        color: var(--bs-secondary) !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        opacity: 1 !important;
      }

      h3, .card-text {
        color: var(--bs-body-color) !important;
        text-shadow: none;
      }

      .category-badge {
        background-color: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        color: var(--bs-white) !important;
      }
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--bs-box-shadow-lg) !important;
    }
  }

  .card-img {
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  .feature-blur-bg {
    position: absolute;
    top: -10%;
    left: -10%;
    right: -10%;
    bottom: -10%;
    background-image: var(--blur-bg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(40px) saturate(1.2);
    opacity: 0.05;
    z-index: 0;
    pointer-events: none;
    transition: transform 0.4s ease;
  }

  :global([data-bs-theme="dark"]) .feature-blur-bg {
    opacity: 0.08;
    filter: blur(50px) saturate(1);
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
  .category-badge {
    background-color: transparent !important;
    border: 1px solid var(--bs-emphasis-color) !important;
    color: var(--bs-emphasis-color) !important;
    transition: all 0.2s;

    &:hover {
      background-color: var(--bs-emphasis-color) !important;
      color: var(--bs-body-bg) !important;
      opacity: 1;
    }
  }

  /* Make link-secondary work on span and use theme secondary color (emphasis for contrast) */
  .link-secondary {
    color: var(--bs-secondary-text-emphasis) !important;
    transition: color 0.4s;
  }

  .vanilla-post-card:hover .link-secondary {
    color: var(--bs-secondary) !important;
    opacity: 1;
  }

  .post-card-gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--random-gradient);
    z-index: 0;
    opacity: 0.8;
  }

  :global([data-bs-theme="dark"]) .post-card-gradient-bg {
    opacity: 0.6;
  }
</style>

<div
  class="card vanilla-post-card h-100 rounded-4 focus-ring position-relative overflow-hidden"
  class:post-clickable={!detail}
  class:post-detail={detail}
  class:is-overlay={!detail}
  style={post.thumbnailUrl ? `--blur-bg: url('${post.thumbnailUrl}');` : `--random-gradient: ${getGradient(post.title)};`}>

  {#if !detail}
    {#if post.thumbnailUrl}
      <img
        src={post.thumbnailUrl}
        class="card-img h-100 object-fit-cover"
        alt={post.title} />
    {:else}
      <div class="post-card-gradient-bg"></div>
    {/if}
  {:else if post.thumbnailUrl}
    <div class="feature-blur-bg"></div>
  {/if}

  {#if (typeof themeSettings.postCoverImageEnabled === "undefined" ? true : themeSettings.postCoverImageEnabled) && detail}
    <div class="post-card-thumbnail-wrapper d-block">
      <div class="ratio ratio-16x9">
        {#if post.thumbnailUrl}
          <img
            src={post.thumbnailUrl}
            class="card-img-top"
            alt={post.title}
            title={post.title} />
        {:else}
          <div class="post-card-gradient-bg"></div>
        {/if}
      </div>
    </div>
  {/if}

  <div
    class:card-img-overlay={!detail}
    class:card-body={detail}
    class="d-flex flex-column justify-content-end">
    <div class="d-flex justify-content-between align-items-start mb-3 gap-2 mt-auto">
      <a
        class="text-decoration-none rounded text-reset flex-grow-1 z-1"
        class:stretched-link={!detail}
        href="/post/{post.url}">
        <h3 class="mb-0 text-break h4 fw-bold clamp-title" title={post.title}>
          {post.title}
        </h3>
      </a>
    </div>

    <div
      class="card-text text-break word-break mb-4"
      class:text-muted={detail || !post.thumbnailUrl}
      class:clamp-text={!detail}>
      {#if detail}
        {@html post.text}
      {:else}
        {truncate(post.text.replace(/<[^>]*>?/gm, ""), 80)}...
      {/if}
    </div>

    <div class="d-flex align-items-center justify-content-between">
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
        {#if post.category.title !== "-"}
          <a
            class="badge category-badge text-decoration-none rounded-pill focus-ring z-2"
            href="/?category={post.category.url}"
            use:tooltip={[$_("buttons.filter"), { placement: "bottom" }]}>
            {post.category.title}
          </a>
        {:else}
          <div></div>
        {/if}

        <div class="d-flex align-items-center gap-2 z-2">
          <Date time={post.date} class="text-white-50 small" />
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
              class="rounded-circle border border-2 border-white" />
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

  const getGradient = (seed = "") => {
    const variants = [
      "circle at 0% 0%, #4158D0 0%, #C850C0 46%, #FFCC70 100%",
      "circle at 100% 0%, #00DBDE 0%, #FC00FF 100%",
      "circle at 100% 100%, #FBAB7E 0%, #F7CE68 100%",
      "circle at 0% 100%, #85FFBD 0%, #FFFB7D 100%",
      "circle at 50% 50%, #21D4FD 0%, #B721FF 100%",
      "circle at 30% 20%, #08AEEA 0%, #2AF598 100%",
      "circle at 80% 40%, #FEE140 0%, #FA709A 100%",
      "circle at 10% 90%, #74EBD5 0%, #9FACE6 100%",
      "circle at 90% 10%, #647dee 0%, #7f53ac 100%",
      "circle at 40% 60%, #ff9a9e 0%, #fecfef 100%",
      "circle at 70% 30%, #a18cd1 0%, #fbc2eb 100%",
      "circle at 20% 80%, #ffecd2 0%, #fcb69f 100%"
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % variants.length;
    return `radial-gradient(${variants[index]})`;
  };
</script>
