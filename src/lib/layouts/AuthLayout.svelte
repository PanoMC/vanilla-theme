<slot />

<script context="module">
  import { processLoad } from "$lib/ui-logics/layout-logics/AuthLayoutLogics";

  export async function load(event) {
    return await processLoad(event);
  }
</script>