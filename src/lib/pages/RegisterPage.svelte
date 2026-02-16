<script context="module">
  import { executeLifecycle, executeViewLoad, panoApiServer } from "$lib/PluginAPI";

  export async function load(event) {
    const { parent } = event;
    await parent();

    // Initialize register content
    panoApiServer.ui.auth.register.content.edit((items) => {
      items.push({ id: "register-form", priority: 100, hidden: false });
    });

    await executeLifecycle("theme:register:load", {}, event);
    await executeViewLoad("register-content", event);

    return {};
  }
</script>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";

  import { NETWORK_ERROR } from "$lib/api.util";

  import ErrorAlert from "$lib/components/ErrorAlert.svelte";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import SuccessAlert from "$lib/components/SuccessAlert.svelte";
  import RegisterForm from "$lib/components/RegisterForm.svelte";
  import { show as showToast } from "$lib/components/ToastContainer.svelte";

  import { sendRegister, getCredentials } from "$lib/services/auth.js";
  import { panoApiClient } from "$lib/PluginAPI.js";
  import ViewComponent from "$lib/components/ViewComponent.svelte";

  const session = getContext("session");

  let loading, error, successMessage;
  let username = "",
    email = "",
    password = "",
    passwordRepeat = "";
  let agreement = !$session.siteInfo.registerAgreement ? true : false;

  async function onSubmit() {
    error = null;
    successMessage = null;
    loading = true;

    await sendRegister({
      username,
      email,
      password,
      passwordRepeat,
      agreement,
      recaptcha: "",
    })
      .then(async (body) => {
        if (body.result === "ok") {
          if (body.login) {
            const csrfToken = body.csrfToken;
            const credsBody = await getCredentials(csrfToken);

            session.update((data) => {
              data.user = {
                ...Object.keys(credsBody)
                  .filter((key) => !["result"].includes(key))
                  .reduce((object, key) => {
                    object[key] = credsBody[key];
                    return object;
                  }, {})
              };
              data.csrfToken = csrfToken;
              return data;
            });

            await showToast("successes.LOGIN_SUCCESSFUL");
            await goto("/");
            loading = false;
            return;
          }

          successMessage = "REGISTER_SUCCESSFUL";
          loading = false;
        } else {
          error = body.result === "error" ? body.error : NETWORK_ERROR;
          loading = false;
        }
      })
      .catch(() => {
        loading = false;

        error = NETWORK_ERROR;
      });
  }

  const contentItems = panoApiClient.ui.auth.register.content.get();
</script>

<div class="container mx-auto">
  <div class="vstack gap-3">
    {#each $contentItems as item (item.id)}
      {#if item.id === "register-form"}
        <form on:submit|preventDefault={onSubmit}>
          <div class="vstack gap-3">
            <PageTitle title={$_("components.modals.register.title")} />
            <SuccessAlert message={successMessage} />
            <ErrorAlert error={error} />

            <RegisterForm
              bind:username={username}
              bind:email={email}
              bind:password={password}
              bind:passwordRepeat={passwordRepeat}
              bind:agreement={agreement}
              loading={loading}>
              <div slot="footer">
                <a
                  class="btn btn-link {loading ? 'disabled pe-none' : ''}"
                  aria-disabled={loading}
                  tabindex={loading ? -1 : undefined}
                  href="/login">
                  {$_("buttons.already-registered")}
                </a>
              </div>
            </RegisterForm>
          </div>
        </form>
      {:else if item.component}
        <ViewComponent component={item.component} data={{ pageType: 'register' }} />
      {/if}
    {/each}
  </div>
</div>
