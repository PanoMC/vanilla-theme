<style global lang="scss">
  .clamp-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .post-card-thumbnail-wrapper {
    display: block;
    width: 100%;
  }

  .post-card-thumbnail-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>

<div class="card rounded-4">
  {#if (typeof themeSettings.postCoverImageEnabled === "undefined" ? true : themeSettings.postCoverImageEnabled) && post.thumbnailUrl}
    <a href="/post/{post.url}" class="post-card-thumbnail-wrapper focus-ring rounded-top rounded-top-4 d-block">
      <div class="ratio ratio-16x9 rounded-top rounded-top-4 overflow-hidden">
        <img
          src={post.thumbnailUrl}
          class="card-img-top rounded-top rounded-top-4"
          alt={post.title}
          title={post.title} />
      </div>
    </a>
  {/if}
  <div class="card-body">
    <div class="row mb-3 g-2 justify-content-center">
      <div class="col">
        <a class="d-inline-block focus-ring rounded" href="/post/{post.url}">
          <h2 class="mb-0 d-inline-block text-break display-6">
            {truncate(post.title, 100)}{@html post.title.length > 100
              ? "&hellip;"
              : ""}
          </h2>
        </a>
      </div>
      <div class="col-sm-auto order-sm-last order-first">
        {#if post.category.title !== "-"}
          <a
            class="badge fs-6 text-bg-secondary text-decoration-none rounded-pill focus-ring"
            href="/?category={post.category.url}"
            use:tooltip={[$_("buttons.filter"), { placement: "bottom" }]}>
            {post.category.title}
          </a>
        {/if}
      </div>
    </div>

    <div class="card-text text-break word-break clamp-text">
      {@html post.text}
    </div>
  </div>
  <div class="card-footer d-flex align-items-center justify-content-between">
    {#if detail}
      {#if typeof themeSettings.postViewCountEnabled === "undefined" ? true : themeSettings.postViewCountEnabled}
        <ul class="m-0 p-0">
          <li class="list-inline">
            <div
              class="list-inline-item px-1"
              use:tooltip={[
                $_("components.post.view"),
                { placement: "bottom" },
              ]}>
              <i class="fas fa-eye me-2"></i>
              {post.views}
            </div>
          </li>
        </ul>
      {:else}
        <div></div>
      {/if}

      <div>
        <Date time={post.date} />
        <a
          href="/player/{post.writer.username}"
          class="d-inline-block rounded focus-ring rounded-circle ms-2"
          hidden={typeof themeSettings.postAuthorImageEnabled === "undefined"
            ? false
            : !themeSettings.postAuthorImageEnabled}>
          <img
            src="https://minotar.net/avatar/{post.writer.username}"
            alt={post.writer.username}
            width="32"
            height="32"
            use:tooltip={[post.writer.username, { placement: "bottom" }]}
            class="rounded-circle" />
        </a>
      </div>
    {:else}
      {#if typeof themeSettings.postReadMoreButtonEnabled === "undefined" ? true : themeSettings.postReadMoreButtonEnabled}
        <a class="h6 mb-0 p-0 btn btn-link text-decoration-none focus-ring" href="/post/{post.url}">
          {$_("components.post.read-more")}
          <i class="fas fa-caret-right ms-1"></i>
        </a>
      {:else}
        <div></div>
      {/if}

      <div>
        <Date time={post.date} />
        <a
          class="d-inline-block rounded focus-ring rounded-circle ms-2"
          href="/player/{post.writer.username}"
          hidden={typeof themeSettings.postAuthorImageEnabled === "undefined"
            ? false
            : !themeSettings.postAuthorImageEnabled}>
          <img
            src="https://minotar.net/avatar/{post.writer.username}"
            alt={post.writer.username}
            width="32"
            height="32"
            use:tooltip={[post.writer.username, { placement: "bottom" }]}
            class="rounded-circle" />
        </a>
      </div>
    {/if}
  </div>
</div>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { truncate } from "$lib/string.util";
  import tooltip from "$lib/tooltip.util";

  import Date from "$lib/component/Date.svelte";

  export let post;
  export let detail = false;

  const themeSettings = getContext("themeSettings");
</script>
