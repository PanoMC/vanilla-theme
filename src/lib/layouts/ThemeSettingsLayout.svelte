<div hidden="{$hidden}">
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
  import { processLoad } from "$lib/ui-logics/layout-logics/ThemeSettingsLayoutLogics";

  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { init } from "$lib/ui-logics/layout-logics/ThemeSettingsLayoutLogics";

  const hidden = init();
</script>
