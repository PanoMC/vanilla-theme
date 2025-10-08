<style>
    #usernameOrEmail {
        margin-bottom: -2px;
    }

    #usernameOrEmail:focus {
        position: relative;
        z-index: 2;
    }
</style>

<div class="col-6 mx-auto">
  <div class="card">
    <div class="card-header">{$_("components.modals.login.title")}</div>
    <div class="card-body">
      <form on:submit|preventDefault={onSubmit}>
        <div class="modal-body">
          <ErrorAlert error={error} />
          <div class="vstack gap-3">
            <div class="vstack gap-0">
              <div class="form-floating">
                <input
                  bind:value={usernameOrEmail}
                  class="form-control rounded-bottom-0"
                  id="usernameOrEmail"
                  type="text" />
                <label for="usernameOrEmail"
                >{$_("components.modals.login.inputs.username-email")}</label>
              </div>

              <div class="form-floating">
                <input
                  bind:value={password}
                  class="form-control rounded-top-0"
                  id="password"
                  type="password" />
                <label for="password"
                >{$_("components.modals.login.inputs.password")}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-lg btn-secondary w-100"
            class:disabled={loading}
            disabled={loading}
            type="submit">
            {$_("buttons.login")}
          </button>
          <a class="btn btn-link w-100" href="/reset-password" on:click={hide}>
            {$_("buttons.forgot-password")}
          </a>
        </div>
      </form>

    </div>
  </div>
</div>

<script>
  import { _ } from "svelte-i18n";
  import { getContext } from "svelte";

  import { invalidateAll } from "$app/navigation";

  import { NETWORK_ERROR } from "$lib/api.util";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";

  import { getCredentials, sendLogin } from "$lib/services/auth.js";

  let usernameOrEmail = "", password = "";
  let loading, error;

  const session = getContext("session");

  async function onSubmit() {
    error = null;
    loading = true;

    await sendLogin({ usernameOrEmail, password, recaptcha: "" })
      .then(async (body) => {
        if (body.result !== "ok") {
          loading = false;
          error = body.result === "error" ? body.error : NETWORK_ERROR;

          return;
        }

        const csrfToken = body.csrfToken;

        await getCredentials(csrfToken).then(async (body) => {
          session.update((data) => {
            data.user = {
              ...Object.keys(body)
                .filter((key) => !["result"].includes(key))
                .reduce((object, key) => {
                  object[key] = body[key];

                  return object;
                }, {})
            };

            data.csrfToken = csrfToken;

            return data;
          });

          await invalidateAll();

          loading = false;
        });
      })
      .catch((err) => {
        console.log(err);
        loading = false;
      });
  }
</script>
