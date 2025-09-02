<div class="card">
  <div class="card-body">
    <h3 class="card-title">{$_("pages.support.title")}</h3>
    <p>Sana nasıl yardımcı olabiliriz?</p>
    <ul class="list-group list-group-horizontal text-center">
      <a href="/ticket/create" class="list-group-item list-group-item-action">
        <i class="fas fa-ticket fa-2x my-3"></i>
        <h5>{$_("pages.support.options.create-ticket.title")}</h5>
        <small>
          {$_("pages.support.options.create-ticket.description")}
        </small>
      </a>

      <a
        href="mailto:{$session.siteInfo.supportEmail}"
        class="list-group-item list-group-item-action">
        <i class="fas fa-envelope fa-2x my-3"></i>
        <div class="col-auto">
          <h5>{$_("pages.support.options.send-email.title")}</h5>
          <small>
            {$_("pages.support.options.send-email.description", {
              values: { websiteName: $session.siteInfo.websiteName },
            })}
          </small>
        </div>
      </a>
    </ul>
  </div>
</div>

<script context="module">
  import SupportSidebar, { load as loadSidebar } from "$lib/component/sidebars/SupportSidebar.svelte";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    await loadSidebar(event);

    return { sidebar: SupportSidebar };
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  export let data;

  const session = getContext("session");
</script>
