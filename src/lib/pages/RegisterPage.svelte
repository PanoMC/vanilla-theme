<div class="col-6 mx-auto">
  <div class="card">
    <div class="card-header">{$_("components.modals.register.title")}</div>
    <form on:submit|preventDefault={onSubmit}>
      <div class="card-body">
        <SuccessAlert message={successMessage} />
        <ErrorAlert error={error} />
        <div class="vstack gap-3">
          <div>
            <div class="form-floating">
              <input
                bind:value={username}
                class="form-control rounded-bottom-0 border-bottom-0"
                id="registerUserName"
                type="text" />
              <label for="registerUserName"
                >{$_("components.modals.register.inputs.username")}</label>
            </div>
            <div class="form-floating">
              <input
                bind:value={email}
                class="form-control rounded-top-0"
                id="registerEmail"
                type="email" />
              <label for="registerEmail"
                >{$_("components.modals.register.inputs.email")}</label>
            </div>
          </div>
          <div class="input-group">
            <div class="form-floating">
              <input
                bind:value={password}
                class="form-control"
                id="registerPassword"
                type="password" />
              <label for="registerPassword"
                >{$_("components.modals.register.inputs.password")}</label>
            </div>
            <div class="form-floating">
              <input
                bind:value={passwordRepeat}
                class="form-control"
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
        </div>
      </div>
      <div class="card-footer vstack gap-2">
        <button
          class="btn btn-lg btn-secondary"
          class:disabled={loading}
          disabled={loading}
          type="submit">
          {$_("buttons.register")}
        </button>
        <a class="btn btn-link" href="/login">
          {$_("buttons.already-registered")}
        </a>
      </div>
    </form>
  </div>
</div>

<script>
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import { NETWORK_ERROR } from "$lib/api.util";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";
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
