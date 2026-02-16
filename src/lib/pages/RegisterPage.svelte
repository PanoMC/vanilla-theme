<div class="container mx-auto">
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
          loading={loading}
      >
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
</div>

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
</script>
