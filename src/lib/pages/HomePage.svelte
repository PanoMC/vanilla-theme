{#if data.categoryUrl}
  <div class="row justify-content-between mb-3">
    <div class="col-auto">
      <h4>
        {$_("pages.category-posts.title", {
          values: {
            categoryTitle: data.category.title,
            postCount: data.postCount,
          },
        })}
      </h4>
    </div>
    <div class="col-auto">
      <a href="/">
        <i class="fas fa-arrow-left me-2"></i>
        {$_("pages.category-posts.posts")}
      </a>
    </div>
  </div>
{/if}

<!-- Posts -->
<div class="vstack gap-3">
  {#if typeof themeSettings.postsEnabled === "undefined" ? true : themeSettings.postsEnabled}
    <Posts posts={data.posts} />
  {/if}
</div>
<!-- Posts End -->

<!-- Pagination -->
{#if (typeof themeSettings.postsEnabled === "undefined" ? true : themeSettings.postsEnabled) && data.postCount > 0}
  <Pagination
    page={data.page}
    totalPage={data.totalPage}
    loading={false}
    on:firstPageClick={() => onPageClick(data, 1)}
    on:lastPageClick={() => onPageClick(data, data.totalPage)}
    on:pageLinkClick={(event) => onPageClick(data, event.detail.page)} />
{/if}

<!-- Pagination End -->
<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/HomePageLogics";

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { onPageClick } from "$lib/ui-logics/page-logics/HomePageLogics";

  import Pagination from "$lib/component/Pagination.svelte";
  import Posts from "$lib/component/Posts.svelte";

  export let data;

  const themeSettings = getContext("themeSettings");
</script>
