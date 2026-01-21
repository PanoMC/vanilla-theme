import { load as loadApp } from "$lib/layouts/AppLayout.svelte";
import { load as loadMain } from "$lib/layouts/MainLayout.svelte";

/**
 * @type {import("@sveltejs/kit").LayoutLoad}
 */
export async function load(event) {
  const appData = await loadApp(event);
  const mainData = await loadMain(event);

  return {
    ...appData,
    ...mainData
  };
}
