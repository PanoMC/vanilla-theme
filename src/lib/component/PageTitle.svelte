<div class="text-center animate__animated animate__fadeInUp">
  <h1 class="fs-3 mb-0 text-break word-break">
    <slot name="title">
      {#if title}
        {#if html}
          {@html title}
        {:else}
          {title}
        {/if}
      {/if}
    </slot>
  </h1>
  {#if subtitle}
    <p class="lead mb-0 mt-2">
      {#if subtitleHtml}
        {@html subtitle}
      {:else}
        {subtitle}
      {/if}
    </p>
  {/if}
</div>

<script>
  export let title = "";
  export let subtitle = "";
  export let html;
  export let subtitleHtml = false;
</script>
