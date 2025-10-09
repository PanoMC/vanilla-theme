<!-- Footer -->
<div class="container my-3">
  <div class="text-center">
    <small>
      {@html themeSettings.footerContent ||
        $_("footer.been-created-with", {
          values: {
            pano: `<a href="${PANO_WEBSITE_URL}" class="rounded focus-ring" target="_blank" rel="noreferrer">Pano</a>`,
          },
        })}
    </small>
  </div>
</div>

<!-- Footer End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import { PANO_WEBSITE_URL } from "$lib/variables";

  const themeSettings = getContext("themeSettings");
</script>
