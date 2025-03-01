{#if data.categoryUrl}
  <div class="row justify-content-between mb-3">
    <div class="col-auto">
      <h4>
        {$_("pages.category-posts.title", {
          values: {
            categoryTitle: data.category.title,
            postCount: data.postCount
          }
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

<!-- Post Cards -->
<Posts posts="{data.posts}" />
<!-- Post Cards End -->

<!-- Pagination -->
{#if data.postCount > 0}
  <Pagination
    page="{data.page}"
    totalPage="{data.totalPage}"
    loading="{false}"
    on:firstPageClick="{() => onPageClick(1)}"
    on:lastPageClick="{() => onPageClick(data.totalPage)}"
    on:pageLinkClick="{(event) => onPageClick(event.detail.page)}" />
{/if}

<!-- Pagination End -->
<script context="module">
  import HomeSidebar, { load as loadSidebar } from "$lib/component/sidebars/HomeSidebar.svelte";
  import { getPosts } from "$lib/services/posts.js";
  import { error } from "@sveltejs/kit";

  /**
   * @type {import('@sveltejs/kit').PageLoad}
   */
  export async function load(event) {
    const { parent, url: { searchParams } } = event;
    await parent();

    const page = parseInt(searchParams.get("page")) || 1;
    const categoryUrl = searchParams.get("category");

    const data = await getPosts({ page, categoryUrl, request: event });

    if (data.error) {
      if (data.error === "PAGE_NOT_FOUND") {
        throw error(404, data.error);
      }

      throw error(500, data.error);
    }

    data.page = page;
    data.categoryUrl = categoryUrl;

    if (!categoryUrl) {
      await loadSidebar(event);
    }

    return { ...data, sidebar: categoryUrl ? null : HomeSidebar };
  }
</script>

<script>
  import { goto } from "$app/navigation";

  import Pagination from "$lib/component/Pagination.svelte";
  import Posts from "$lib/component/Posts.svelte";

  import { buildQueryParams } from "$lib/api.util.js";
  import { _ } from "svelte-i18n";

  export let data;

  async function refreshData() {
    const queryParams = buildQueryParams({
      page: data.page,
      category: data.categoryUrl
    });

    await goto(queryParams, { invalidateAll: true });
  }

  async function onPageClick(page) {
    data.page = page;

    await refreshData();
  }
</script>
