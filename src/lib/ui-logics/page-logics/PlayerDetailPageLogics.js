import { error } from "@sveltejs/kit";

import { getPlayerProfile } from "$lib/services/profile";

import PlayerDetailSidebar, { load as loadSidebar } from "$lib/components/sidebars/PlayerDetailSidebar.svelte";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function processLoad(event) {
  const { parent } = event;
  await parent();

  let data = {
    registerDate: 0
  };

  await loadSidebar(event);

  await getPlayerProfile({
    username: event.params.player,
    request: event
  }).then((body) => {
    if (body.error) {
      if (body.error === "NOT_EXISTS") {
        throw error(404, body.error);
      }

      throw error(500, body.error);
    }

    data = body;
  });

  return {
    ...data,
    sidebar: PlayerDetailSidebar,
    sidebarProps: { side: "left" }
  };
}