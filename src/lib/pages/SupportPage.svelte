<div class="vstack gap-3">
  <PageTitle title={$_("pages.support.title")} />

  <ul class="list-group list-group-horizontal text-center">
    <a
      href="/ticket/create"
      class="list-group-item list-group-item-action focus-ring">
      <i class="fas fa-ticket fa-2x my-3"></i>
      <h5>{$_("pages.support.options.create-ticket.title")}</h5>
      <small>
        {$_("pages.support.options.create-ticket.description")}
      </small>
    </a>

    <a
      href="mailto:{$session.siteInfo.supportEmail}"
      class="list-group-item list-group-item-action focus-ring">
      <i class="fas fa-envelope fa-2x my-3"></i>
      <div class="col-auto">
        <h5>
          {$_("pages.support.options.send-email.title")}<i
            class="fas fa-external-link-alt ms-2"></i>
        </h5>
        <small>
          {$_("pages.support.options.send-email.description", {
            values: { websiteName: $session.siteInfo.websiteName },
          })}
        </small>
      </div>
    </a>
  </ul>
</div>

<script context="module">
  import PageTitle from "$lib/component/PageTitle.svelte";
  import { processLoad } from "$lib/ui-logics/page-logics/SupportPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return await processLoad(event);
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  export let data;

  const session = getContext("session");
</script>
