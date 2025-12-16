<div class="text-center animate__animated animate__fadeInUp">
  <h1 class="lead mb-3">
    <slot name="title">
      {#if title}
        {title}
      {/if}
    </slot>
  </h1>
  {#if subtitle}
    <p>{subtitle}</p>
  {/if}
</div>

<script>
  export let title = "";
  export let subtitle = "";
</script>
