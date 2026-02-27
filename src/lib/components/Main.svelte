

<svelte:head>
  {#if dev && !devUi}
    <link rel="stylesheet" href="/style.css" />
  {/if}
</svelte:head>

<!-- Main Container -->
<main class="container">
  <div class="row g-3">
    {#if sidebarEnabled}
      <svelte:component
        this={$sidebar}
        {...{
          ...$sidebarProps,
          side: sidebarPosition === "LEFT" ? "left" : "right",
        }} />
    {/if}

    <!-- Content -->
    <div class:col={!sidebarEnabled} class:col-lg-8={sidebarEnabled && $sidebar}>
      <slot />
    </div>
    <!-- Content End -->
  </div>
</main>

<!-- Main Container End -->
<script>
  import "@theme-style";
  import { getContext } from "svelte";
  import { dev } from "$app/environment";

  const devUi = import.meta.env.VITE_DEV_UI === "true";

  const sidebar = getContext("sidebar");
  const sidebarProps = getContext("sidebarProps");
  const themeSettings = getContext("themeSettings");

  $: sidebarEnabled =
    typeof themeSettings.sidebarEnabled === "undefined"
      ? true
      : themeSettings.sidebarEnabled;
  $: sidebarPosition =
    typeof themeSettings.sidebarPosition !== "undefined"
      ? themeSettings.sidebarPosition
      : !$sidebarProps.side
        ? "RIGHT"
        : $sidebarProps.side === "left"
          ? "LEFT"
          : "RIGHT";
</script>
