import { getProfile } from "$lib/services/profile";

import ProfileSidebar, { load as loadSidebar } from "$lib/component/sidebars/ProfileSidebar.svelte";

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

  await loadSidebar(event);

  await getProfile({ request: event }).then((body) => {
    data = body;
  });

  return { ...data, sidebar: ProfileSidebar };
}