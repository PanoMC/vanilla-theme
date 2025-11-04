<div class="container text-center">
    <i class="{icon} text-opacity-25 m-3"></i>
    <small class="d-block mb-3">{text}</small>
  <slot />
</div>

<script>
  import { _ } from "svelte-i18n";

  export let icon = "fa-solid fa-ghost fa-3x";
  export let text = $_("components.no-content.text");
</script>
