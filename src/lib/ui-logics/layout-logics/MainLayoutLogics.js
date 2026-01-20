import { executeHookLoad } from "$lib/PluginAPI.js";

export async function processLoad(event) {
  const { parent } = event;
    await parent();

  return {
    hookProps: {
      "theme:top": await executeHookLoad("theme:top", event),
      "page:top": await executeHookLoad("page:top", event)
    }
    };
}
