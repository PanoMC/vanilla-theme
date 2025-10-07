<!-- Footer -->
<div class="container text-center my-3">
  <small>
    {@html themeSettings.footerContent || $_("footer.been-created-with", {
      values: {
        pano: `<a href="${PANO_WEBSITE_URL}" target="_blank" rel="noreferrer">Pano</a>`,
      },
    })}
  </small>
</div>

<!-- Footer End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import { PANO_WEBSITE_URL } from "$lib/variables";

  const themeSettings = getContext("themeSettings");
</script>
