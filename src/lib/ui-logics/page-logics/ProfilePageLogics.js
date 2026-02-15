import { getProfile } from "$lib/services/profile";
import { executeLifecycle, executeViewLoad, panoApiServer } from "$lib/PluginAPI";

import ProfileSidebar, { load as loadSidebar } from "$lib/components/sidebars/ProfileSidebar.svelte";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent } = event;
  await parent();

  let data = {
    registerDate: 0,
    lastLoginDate: 0
  };

  // Initialize profile content
  panoApiServer.ui.profile.content.edit((items) => {
    items.push({ id: "profile-card", priority: 100, hidden: false });
  });

  // Initialize profile card rows
  panoApiServer.ui.profile.cardRows.edit((items) => {
    items.push(
      { id: "register-date", priority: 100, hidden: false },
      { id: "last-login", priority: 90, hidden: false }
    );
  });

  await executeLifecycle("theme:profile:load", {}, event);
  await executeViewLoad("profile-content", event);
  await executeViewLoad("profile-card-rows", event);

  await loadSidebar(event);

  await getProfile({ request: event }).then((body) => {
    data = body;
  });

  return { ...data, sidebar: ProfileSidebar };
}