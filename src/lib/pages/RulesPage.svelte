<div class="vstack gap-3">
  <div class="alert alert-secondary mb-0" role="alert">
    <i class="fas fa-gavel me-2"></i>
    {$_("pages.rules.warning")}
  </div>

  <div class="card">
    <div class="card-body">
      {@html $session.siteInfo.registerAgreement}
    </div>
  </div>
</div>

<!-- Pagination End -->
<script context="module">
  import { error } from "@sveltejs/kit";

  /**
   * @type {import("@sveltejs/kit").PageLoad}
   */
  export async function load(event) {
    const parentData = await event.parent();
    const session = parentData.session;
    const registerAgreement = session.siteInfo.registerAgreement;

    if (!registerAgreement) {
      throw error(404);
    }

    return parentData;
  }
</script>

<script>
  import { getContext, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  const session = getContext("session");
  const pageTitle = getContext("pageTitle");
  onMount(() => {
    $pageTitle = $_("pages.rules.title");
  });
</script>
