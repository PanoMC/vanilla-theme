<div class="vstack gap-3">
  <PageTitle title={$_("pages.support.title")} />

  {#each $items as item (item.id)}
    {#if item.id === "support-options"}
      <ul class="list-group list-group-horizontal text-center">
        {#each $optionItems as opt (opt.id)}
          {#if opt.id === "create-ticket"}
            <a
              href="/ticket/create"
              class="list-group-item list-group-item-action focus-ring">
              <i class="fas fa-ticket fa-2x my-3"></i>
              <h5>{$_("pages.support.options.create-ticket.title")}</h5>
              <small>
                {$_("pages.support.options.create-ticket.description")}
              </small>
            </a>
          {:else if opt.id === "send-email"}
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
          {:else}
            <div class="list-group-item list-group-item-action p-0 overflow-hidden">
              <ViewComponent component={opt.component} data={data} {...opt.props} />
            </div>
          {/if}
        {/each}
      </ul>
    {:else}
      <ViewComponent component={item.component} data={data} {...item.props} />
    {/if}
  {/each}

  <Hook name="theme:support:content" />
</div>

<script context="module">
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

  import PageTitle from "$lib/components/PageTitle.svelte";
  import Hook from "$lib/components/Hook.svelte";
  import ViewComponent from "$lib/components/ViewComponent.svelte";
  import { panoApi } from "$lib/PluginAPI";

  export let data;

  const session = getContext("session");

  const items = panoApi.ui.view.get("support-content");
  const optionItems = panoApi.ui.view.get("support-options");
</script>
