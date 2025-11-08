<div hidden="{$hidden}">
  <slot />
</div>

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
