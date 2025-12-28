<style>
  #registerUserName {
    margin-bottom: -2px;
  }

  #registerUserName:focus {
    position: relative;
    z-index: 2;
  }

  #registerEmail {
    margin-bottom: -2px;
  }

  #registerEmail:focus {
    position: relative;
    z-index: 2;
  }
</style>

<div class="container mx-auto">
  <form on:submit|preventDefault={onSubmit}>
    <div class="vstack gap-3">
      <PageTitle title={$_("components.modals.register.title")} />
      <SuccessAlert message={successMessage} />
      <ErrorAlert error={error} />

      <div class="form-group">
        <div class="form-floating">
          <input
            bind:value={username}
            class="form-control rounded-bottom-0 border-bottom-0"
            disabled={loading}
            id="registerUserName"
            type="text" />
          <label for="registerUserName"
            >{$_("components.modals.register.inputs.username")}</label>
        </div>
        <div class="form-floating">
          <input
            bind:value={email}
            class="form-control rounded-top-0"
            disabled={loading}
            id="registerEmail"
            type="email" />
          <label for="registerEmail"
            >{$_("components.modals.register.inputs.email")}</label>
        </div>
      </div>
      <div class="form-group">
        <div class="form-floating">
          <input
            bind:value={password}
            class="form-control rounded-bottom-0 border-bottom-0"
            disabled={loading}
            id="registerPassword"
            type="password" />
          <label for="registerPassword"
            >{$_("components.modals.register.inputs.password")}</label>
        </div>
        <div class="form-floating">
          <input
            bind:value={passwordRepeat}
            class="form-control rounded-top-0"
            disabled={loading}
            id="registerPasswordRepeat"
            type="password" />
          <label for="registerPasswordRepeat"
            >{$_("components.modals.register.inputs.password-repeat")}
          </label>
        </div>
      </div>
      {#if $session.siteInfo.registerAgreement}
        <div class="form-check">
          <input
            bind:checked={agreement}
            class="form-check-input"
            disabled={loading}
            id="registerAcceptTerms"
            type="checkbox" />
          <label class="form-check-label" for="registerAcceptTerms">
            {@html $_("components.modals.register.inputs.agreement-text", {
              values: {
                link: `<a class="rounded focus-ring" href="/rules">${$_("components.modals.register.inputs.server-rules")}</a>`,
              },
            })}
          </label>
        </div>
      {/if}
      <div class="vstack gap-2">
        <button
          class="btn btn-lg btn-secondary"
          class:disabled={loading}
          disabled={loading}
          type="submit">
          {#if loading}
            <span
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-label="Loading"></span>
            <span>{$_("buttons.register")}...</span>
          {:else}
            {$_("buttons.register")}
          {/if}
        </button>
        <a
          class="btn btn-link {loading ? 'disabled pe-none' : ''}"
          aria-disabled={loading}
          tabindex={loading ? -1 : undefined}
          href="/login">
          {$_("buttons.already-registered")}
        </a>
      </div>
    </div>
  </form>
</div>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { NETWORK_ERROR } from "$lib/api.util";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
  import PageTitle from "$lib/component/PageTitle.svelte";
  import SuccessAlert from "$lib/component/SuccessAlert.svelte";

  import { sendRegister } from "$lib/services/auth.js";

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
      .then((body) => {
        loading = false;

        if (body.result === "ok") {
          successMessage = "REGISTER_SUCCESSFUL";
        } else {
          error = body.result === "error" ? body.error : NETWORK_ERROR;
        }
      })
      .catch(() => {
        loading = false;

        error = NETWORK_ERROR;
      });
  }
</script>
