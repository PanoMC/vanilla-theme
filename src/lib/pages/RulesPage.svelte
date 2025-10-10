<div class="col mx-auto">
  <div
    class="alert alert-secondary"
    role="alert">
    <i class="fas fa-gavel me-2"></i> Please read the rules carefully. Violating
    its terms may result in your being banned.
  </div>

  <div class="card">
    <div class="card-header">
      {$_("pages.rules.title")}
    </div>
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
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  const session = getContext("session");
</script>
