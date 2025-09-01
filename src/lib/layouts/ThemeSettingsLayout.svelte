<div hidden="{hidden}">
  <slot />
</div>

<style global>
    :global(html),
    :global(body) {
        background: transparent !important;
        margin: 0;
        padding: 0;
    }
</style>

<script context="module">
  import { redirect } from "@sveltejs/kit";

  import { hasPermission, Permissions } from "$lib/auth.util.js";

  export async function load(event) {
    const { parent } = event;
    const parentData = await parent();
    const { user, siteInfo: { themeSettings } } = parentData;

    if (!hasPermission(Permissions.MANAGE_VIEW, user || {})) {
      throw redirect(302, "/");
    }

    return { themeSettings };
  }
</script>

<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let hidden = true;

  onMount(() => {
    if (typeof window !== "undefined" && window.top === window.self) {
      goto("/");
      return;
    }

    hidden = false;

    document.body.classList.remove("bg-light");
  });

  function postHeight() {
    const h = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    window.parent.postMessage({ type: "theme-iframe-height", height: h }, "*");
  }

  onMount(() => {
    window.addEventListener("load", postHeight);
    window.addEventListener("resize", postHeight);
    window.addEventListener("message", function(e) {
      if (e.data && e.data.type === "theme-iframe-ping") postHeight();
    });

    const ro = new ResizeObserver(postHeight);
    ro.observe(document.body);
  });
</script>
