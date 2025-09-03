import SupportSidebar, { load as loadSidebar } from "$lib/component/sidebars/SupportSidebar.svelte";

export async function processLoad(event) {
  const { parent } = event;
  await parent();

  await loadSidebar(event);

  return { sidebar: SupportSidebar };
}