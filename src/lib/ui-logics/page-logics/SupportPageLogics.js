import SupportSidebar, { load as loadSidebar } from "$lib/components/sidebars/SupportSidebar.svelte";
import { executeHookLoad } from "$lib/PluginAPI.js";

export async function processLoad(event) {
  const { parent } = event;
  await parent();

  await loadSidebar(event);

  const hookProps = {
    "theme:support:content": await executeHookLoad("theme:support:content", event),
  };

  return { sidebar: SupportSidebar, hookProps };
}