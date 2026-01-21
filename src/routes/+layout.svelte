<script>
  import { page } from "$app/stores";
  import AppLayout from "$lib/layouts/AppLayout.svelte";
  import MainLayout from "$lib/layouts/MainLayout.svelte";

  export let data;

  $: isThemeSettings = $page.route.id?.includes("(theme-settings)");
  $: isResetLayout = $page.data.resetLayout;
  $: showMainLayout = !isThemeSettings && !isResetLayout;
</script>

<AppLayout {data}>
  {#if showMainLayout}
    <MainLayout>
      <slot />
    </MainLayout>
  {:else}
    <slot />
  {/if}
</AppLayout>
