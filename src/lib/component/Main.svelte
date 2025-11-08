<style lang="scss" global>
  @import "src/styles/style.scss";
</style>

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
  import { getContext } from "svelte";

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
