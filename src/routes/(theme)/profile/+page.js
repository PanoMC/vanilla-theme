import { processLoad } from "$lib/ui-logics/page-logics/ProfilePageLogics";

/**
 * @type {import("@sveltejs/kit").Load}
 */
export async function load(event) {
  return processLoad(event);
}
