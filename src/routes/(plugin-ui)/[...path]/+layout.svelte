{#if data.resetLayout}
  <slot/>
{:else}
  <MainLayout data="{data}">
    <slot />
  </MainLayout>
{/if}

<script context="module">
  import { error } from "@sveltejs/kit";

  import { registeredPages } from "$lib/PluginManager.js";
  import { base } from "$app/paths";

  function removePrefix(str, prefix) {
    return str.startsWith(prefix)
      ? str.slice(prefix.length)
      : str;
  }

  /**
   * @type {import("@sveltejs/kit").PageLoad}
   */
  export async function load(event) {
    const { url: { pathname }, parent } = event;
    await parent();

    const registeredPage = registeredPages[removePrefix(pathname, base)];

    if (registeredPage === undefined) {
      throw error(404);
    }

    const resetLayout = registeredPage.resetLayout || false;

    return { registeredPage, resetLayout };
  }
</script>

<script>
  import MainLayout from "$lib/layouts/MainLayout.svelte";

  export let data;
</script>
