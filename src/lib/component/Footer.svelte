<!-- Footer -->
<div class="container-fluid text-bg-primary mt-5 bg-gradient border-top py-5">
  <div class="row justify-content-center align-items-center pb-5">
    <div
      class="col-lg-4 d-flex justify-content-center align-items-center order-lg-first order-md-2 order-last">
      <ul data-bs-theme="dark" class="nav justify-content-center">
        <li class="nav-item">
          <a class="nav-link active" href="#" aria-current="page">Ana Sayfa</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Destek</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Kurallar</a>
        </li>
      </ul>
    </div>
    <div class="col-lg-4 col-sm-8">
      <div class="text-center vstack gap-3">
        <a href="/" class="d-inline-block">
          <img
            class="d-block mx-auto"
            height="128"
            width="128"
            alt={$_("components.header.alt")}
            src="/api/websiteLogo" />
        </a>
        <h5>Panocraft</h5>
        <small class="text-gray">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor,
          eveniet maiores similique, excepturi, impedit quae nisi pariatur
          dolorum quod quam officiis ut quasi est rem distinctio vero iure
          minima eligendi!
        </small>
      </div>
    </div>
    <div class="col-lg-4 d-flex justify-content-center align-items-center" data-bs-theme="dark">
      <a href="#" class="btn btn-link font-monospace">
        #minecraf <br /> #vanilla <br /> #N3d10nCr4fT <br /> #official #server</a>
    </div>
    <div class="w-100"></div>
    <div class="col order-last">
      <div class="text-center my-3">
        <small data-bs-theme="dark">
          {@html themeSettings.footerContent ||
            $_("footer.been-created-with", {
              values: {
                pano: `<a href="${PANO_WEBSITE_URL}" class="rounded focus-ring" target="_blank" rel="noreferrer">Pano</a>`,
              },
            })}
        </small>
      </div>
    </div>
  </div>
</div>

<!-- Footer End -->
<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import { PANO_WEBSITE_URL } from "$lib/variables";

  const themeSettings = getContext("themeSettings");
</script>
