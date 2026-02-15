import SupportSidebar, { load as loadSidebar } from "$lib/components/sidebars/SupportSidebar.svelte";
import { executeHookLoad, executeLifecycle, executeViewLoad, panoApi } from "$lib/PluginAPI.js";

export async function processLoad(event) {
  const { parent } = event;
  const { hookProps: parentHookProps } = await parent();

  await loadSidebar(event);

  const data = {
    hookProps: { ...parentHookProps },
  };

  // Register main content sections
  panoApi.ui.view.register({
    viewId: "support-content",
    id: "support-options",
    priority: 100,
  });

  // Register buttons inside the options group
  panoApi.ui.view.register({
    viewId: "support-options",
    id: "create-ticket",
    component: "local:create-ticket",
    priority: 100,
  });

  panoApi.ui.view.register({
    viewId: "support-options",
    id: "send-email",
    component: "local:send-email",
    priority: 90,
  });

  // Execute lifecycles
  await executeLifecycle("theme:support:load", data, event);

  // Execute view loads to resolve order and visibility
  await executeViewLoad("support-content", event);
  await executeViewLoad("support-options", event);

  data.hookProps["theme:support:content"] = {
    ...data.hookProps["theme:support:content"],
    ...(await executeHookLoad("theme:support:content", event)),
  };

  return { ...data, sidebar: SupportSidebar };
}