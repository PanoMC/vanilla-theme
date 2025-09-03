import { onMount } from "svelte";
import { redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";

import { goto } from "$app/navigation";

import { hasPermission, Permissions } from "$lib/auth.util";

function postHeight() {
  const h = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  window.parent.postMessage({ type: "theme-iframe-height", height: h }, "*");
}

export async function processLoad(event) {
  const { parent } = event;
  const parentData = await parent();
  const { user, siteInfo: { themeSettings } } = parentData;

  if (!hasPermission(Permissions.MANAGE_VIEW, user || {})) {
    throw redirect(302, "/");
  }

  return { themeSettings };
}

export function init() {
  const hidden = writable(true);

  onMount(async () => {
    window.addEventListener("load", postHeight);
    window.addEventListener("resize", postHeight);
    window.addEventListener("message", function(e) {
      if (e.data && e.data.type === "theme-iframe-ping") postHeight();
    });

    const ro = new ResizeObserver(postHeight);
    ro.observe(document.body);

    if (typeof window !== "undefined" && window.top === window.self) {
      await goto("/");
      return;
    }

    hidden.set(false);

    document.body.classList.remove("bg-light");
  });

  return hidden;
}