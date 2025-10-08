{@html $session.siteInfo.registerAgreement}

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

  const session = getContext("session");
</script>