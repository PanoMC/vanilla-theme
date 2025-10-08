<div class="card rounded-4 mb-3">
  {#if (typeof themeSettings.postCoverImageEnabled === "undefined" ? true : themeSettings.postCoverImageEnabled) && post.thumbnailUrl}
    <a href="/post/{post.url}">
      <div
        style="
          aspect-ratio: 16 / 9;
          width: 100%;
          overflow: hidden;
        ">
        <img
          src={post.thumbnailUrl}
          class="card-img-top rounded-top rounded-top-4"
          style="object-fit: cover;"
          alt={post.title}
          title={post.title} />
      </div>
    </a>
  {/if}
  <div class="card-body">
    <div class="row mb-3 justify-content-center">
      <div class="col">
        <a class="card-title text-black focus-ring rounded" href="/post/{post.url}">
          <h3 class="mb-0 d-inline-block text-break">
            {truncate(post.title, 100)}{@html post.title.length > 100
              ? "&hellip;"
              : ""}
          </h3>
        </a>
      </div>
      <div class="col-auto">
        {#if post.category.title !== "-"}
          <a
            class="badge text-bg-secondary text-decoration-none rounded-pill focus-ring"
            href="/?category={post.category.url}"
            use:tooltip={[$_("buttons.filter"), { placement: "bottom" }]}>
            {post.category.title}
          </a>
        {/if}
      </div>
    </div>

    <div class="card-text text-break word-break">
      {@html post.text}
    </div>
  </div>
  <div class="card-footer d-flex align-items-center justify-content-between">
    {#if detail}
      {#if typeof themeSettings.postViewCountEnabled === "undefined" ? true : themeSettings.postViewCountEnabled}
        <ul class="m-0 p-0 text-muted">
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
