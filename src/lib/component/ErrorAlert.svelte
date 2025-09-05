{#if error || alwaysVisible}
  <div class="alert alert-danger" in:fade out:fade>
    {$_('errors.' + (error.key || error), { values: error.props })}
  </div>
{/if}

<script>
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";

  export let error;

  const alwaysVisible = false;
</script>
