<div class="container">
  <div class="col-4 mx-auto">
  <div class="card mt-5 ratio ratio-1x1">
    <div class="card-body">
      <div class="row">
        <div class="col-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error aut,
            accusantium cum itaque, est nisi labore, quia temporibus pariatur
            fuga necessitatibus. Quia modi labore atque dicta eligendi tempore
            molestiae itaque!
          </p>
        </div>
        <div class="col-8">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error aut,
            accusantium cum itaque, est nisi labore, quia temporibus pariatur
            fuga necessitatibus. Quia modi labore atque dicta eligendi tempore
            molestiae itaque!
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>

</div>

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
