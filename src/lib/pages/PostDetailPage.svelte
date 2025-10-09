<div class="col-lg-10 mx-auto">
  <div class="card rounded-4 my-3 border-0">
    <!-- Kapak görseli + gradient + başlık + footer -->
    {#if (typeof themeSettings.postCoverImageEnabled === "undefined" ? true : themeSettings.postCoverImageEnabled) && data.post.thumbnailUrl}
      <div
        class="position-relative"
        style="
        aspect-ratio: 16 / 9;
        width: 100%;
        overflow: hidden;
      ">
        <img
          src={data.post.thumbnailUrl}
          class="w-100 h-100 d-block rounded-4"
          style="object-fit: cover;"
          alt={data.post.title}
          title={data.post.title} />

        <!-- Başlık + footer -->
        <div
          class="position-absolute bottom-0 start-0 w-100 text-white p-3"
          style="
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        ">
          <div class="hstack gap-2">
            <h1 class="m-0 text-truncate display-4">
              {truncate(data.post.title, 100)}{@html data.post.title.length >
              100
                ? "&hellip;"
                : ""}
            </h1>
          </div>
          <!-- Footer bilgileri -->
          <div
            class="d-flex align-items-center justify-content-between mt-2 small text-white-50">
            {#if typeof themeSettings.postViewCountEnabled === "undefined" ? true : themeSettings.postViewCountEnabled}
              <div class="text-white">
                <i class="fas fa-eye me-2"></i>
                {data.post.views}
              </div>
            {/if}

            <div class="d-flex align-items-center">
              <Date time={data.post.date} />
              <a
                href="/player/{data.post.writer.username}"
                class="d-inline-block rounded focus-ring rounded-circle ms-2"
                hidden={typeof themeSettings.postAuthorImageEnabled ===
                "undefined"
                  ? false
                  : !themeSettings.postAuthorImageEnabled}>
                <img
                  src="https://minotar.net/avatar/{data.post.writer.username}"
                  alt={data.post.writer.username}
                  width="28"
                  height="28"
                  use:tooltip={[
                    data.post.writer.username,
                    { placement: "bottom" },
                  ]}
                  class="rounded-circle" />
              </a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <div class="card mt-3">
    <div class="card-body">
      <div class="hstack gap-2">
        {#if data.post.category.title !== "-"}
          <a
            class="badge text-bg-secondary text-decoration-none rounded-pill focus-ring mb-2"
            href="/?category={data.post.category.url}"
            use:tooltip={[$_("buttons.filter"), { placement: "bottom" }]}>
            {data.post.category.title}
          </a>
        {/if}
        <h1
          class="m-0 text-truncate display-4"
          hidden={(typeof themeSettings.postCoverImageEnabled === "undefined"
            ? true
            : themeSettings.postCoverImageEnabled) && data.post.thumbnailUrl}>
          {truncate(data.post.title, 100)}{@html data.post.title.length > 100
            ? "&hellip;"
            : ""}
        </h1>
      </div>

      <div class="card-text text-break word-break">
        {@html data.post.text}
      </div>
    </div>
    <div
      class="card-footer"
      hidden={(typeof themeSettings.postCoverImageEnabled === "undefined"
        ? true
        : themeSettings.postCoverImageEnabled) && data.post.thumbnailUrl}>
      <div class="d-flex align-items-center justify-content-between small">
        {#if typeof themeSettings.postViewCountEnabled === "undefined" ? true : themeSettings.postViewCountEnabled}
          <div>
            <i class="fas fa-eye me-2"></i>
            {data.post.views}
          </div>
        {/if}

        <div class="d-flex align-items-center">
          <Date time={data.post.date} />
          <a
            href="/player/{data.post.writer.username}"
            class="d-inline-block rounded focus-ring rounded-circle ms-2"
            hidden={typeof themeSettings.postAuthorImageEnabled === "undefined"
              ? false
              : !themeSettings.postAuthorImageEnabled}>
            <img
              src="https://minotar.net/avatar/{data.post.writer.username}"
              alt={data.post.writer.username}
              width="28"
              height="28"
              use:tooltip={[data.post.writer.username, { placement: "bottom" }]}
              class="rounded-circle" />
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-between mt-3">
    <div class="col-auto">
      <a
        href="/post/{data.previousPost === '-' ? '' : data.previousPost.url}"
        class="btn btn-link ps-0"
        class:disabled={data.previousPost === "-"}
        hidden={typeof themeSettings.postPreviousPageEnabled === "undefined"
          ? false
          : !themeSettings.postPreviousPageEnabled}
        use:tooltip={[data.previousPost.title, { placement: "bottom" }]}>
        <i class="fas fa-caret-left me-1"></i>
        {$_("pages.post-detail.previous-post")}
      </a>
    </div>

    <div class="col-auto">
      <a
        href="/post/{data.nextPost === '-' ? '' : data.nextPost.url}"
        class="btn btn-link pe-0"
        class:disabled={data.nextPost === "-"}
        hidden={typeof themeSettings.postNextPageEnabled === "undefined"
          ? false
          : !themeSettings.postNextPageEnabled}
        use:tooltip={[data.nextPost.title, { placement: "bottom" }]}>
        {$_("pages.post-detail.next-post")}
        <i class="fas fa-caret-right ms-1"></i>
      </a>
    </div>
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/PostDetailPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";

  import { truncate } from "$lib/string.util";
  import { getContext } from "svelte";

  export let data;

  const themeSettings = getContext("themeSettings");
</script>
