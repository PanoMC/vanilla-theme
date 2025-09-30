<!-- Footer -->
<div class="container text-center my-3">
  <small>
    {@html themeSettings.footerContent || $_("footer.been-created-with", {
      values: {
        pano: `<a href="https://panomc.com" target="_blank" rel="noreferrer">Pano</a>`,
      },
    })}
  </small>
</div>

<!-- Footer End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  const themeSettings = getContext("themeSettings");
</script>
