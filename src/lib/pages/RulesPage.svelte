<div class="vstack gap-3">
  <PageTitle title={$_("pages.rules.title")} />
  <div class="alert alert-secondary mb-0" role="alert">
    <i class="fas fa-gavel me-2"></i>
    {$_("pages.rules.warning")}
  </div>

  <div class="container">
    <div class="card">
      <div class="card-body">
        {@html $session.siteInfo.registerAgreement}
      </div>
    </div>
  </div>
</div>

<!-- Pagination End -->
<script context="module">
  import PageTitle from "$lib/component/PageTitle.svelte";
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
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  const session = getContext("session");
</script>
