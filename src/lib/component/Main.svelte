<!-- Main Container -->
<main class="container">
  <div class="row g-3">
    {#if sidebarEnabled && sidebarPosition === 'LEFT'}
      <svelte:component this="{$sidebar}"
                        {...{ ...$sidebarProps, side: sidebarPosition === 'LEFT' ? 'left' : 'right' }} />
    {/if}

    <!-- Content -->
    <div class="col">
      <slot />
    </div>
    <!-- Content End -->

    {#if sidebarEnabled && sidebarPosition === 'RIGHT' && (!$sidebarProps || !$sidebarProps.side)}
      <svelte:component this="{$sidebar}"
                        {...{ ...$sidebarProps, side: sidebarPosition === 'LEFT' ? 'left' : 'right' }} />
    {/if}
  </div>
</main>

<!-- Main Container End -->
<script>
  import { getContext } from "svelte";

  const sidebar = getContext("sidebar");
  const sidebarProps = getContext("sidebarProps");
  const themeSettings = getContext("themeSettings");

  $: sidebarEnabled = typeof themeSettings.sidebarEnabled === "undefined" ? true : themeSettings.sidebarEnabled;
  $: sidebarPosition = typeof themeSettings.sidebarPosition !== "undefined" ? themeSettings.sidebarPosition : !$sidebarProps.side ? "RIGHT" : $sidebarProps.side === "left" ? "LEFT" : "RIGHT";
</script>
