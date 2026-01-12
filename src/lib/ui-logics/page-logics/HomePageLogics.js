import { error } from "@sveltejs/kit";

import { goto } from "$app/navigation";

import { getPosts } from "$lib/services/posts";
import { buildQueryParams } from "$lib/api.util";

import HomeSidebar, { load as loadSidebar } from "$lib/component/sidebars/HomeSidebar.svelte";
import { executeHookLoad } from "$lib/PluginAPI.js";

/**
 * @type {import("@sveltejs/kit").PageLoad}
 */
export async function processLoad(event) {
  const { parent, url: { searchParams } } = event;
  const parentData = await parent();

  const page = parseInt(searchParams.get("page")) || 1;
  const categoryUrl = searchParams.get("category");

  const data = await getPosts({ page, categoryUrl, request: event });

  if (data.error) {
    if (data.error === "PAGE_NOT_FOUND" || data.error === "NOT_EXISTS" || data.error === "CATEGORY_NOT_EXISTS" || data.error === "BAD_REQUEST") {
      throw error(404, data.error);
    }

    throw error(500, data.error);
  }

  data.page = page;
  data.categoryUrl = categoryUrl;

  if (!categoryUrl) {
    await loadSidebar(event);
  }

  return {
    ...data,
    sidebar: categoryUrl ? null : HomeSidebar,
    hookProps: categoryUrl ? undefined : {
      ...parentData.hookProps,
      'page:home:top': await executeHookLoad('page:home:top', event)
    }
  };
}

async function refreshData(data) {
  const queryParams = buildQueryParams({
    page: data.page,
    category: data.categoryUrl
  });

  await goto(queryParams);
}

export async function onPageClick(data, page) {
  data.page = page;

  await refreshData(data);
}