<style>
  #usernameOrEmail {
    margin-bottom: -2px;
  }

  #usernameOrEmail:focus {
    position: relative;
    z-index: 2;
  }
</style>

<!-- Login Modal -->
<div class="modal fade" id={dialogID} aria-hidden="true">
  <div class="modal-dialog modal-md modal-dialog-centered" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">{$_("components.modals.login.title")}</h4>
        <button
          aria-label={$_("buttons.close")}
          class="btn-close"
          data-bs-dismiss="modal"
          type="button"></button>
      </div>

      <form on:submit|preventDefault={onSubmit}>
        <div class="modal-body">
          <ErrorAlert error={$error} />
          <div class="vstack gap-3">
            <div class="vstack gap-0">
              <div class="form-floating">
                <input
                  type="text"
                  id="usernameOrEmail"
                  class="form-control rounded-bottom-0"
                  bind:value={$data.usernameOrEmail} />
                <label for="usernameOrEmail"
                  >{$_("components.modals.login.inputs.username-email")}</label>
              </div>

              <div class="form-floating">
                <input
                  type="password"
                  id="password"
                  class="form-control rounded-top-0"
                  bind:value={$data.password} />
                <label for="password"
                  >{$_("components.modals.login.inputs.password")}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="submit"
            class="btn btn-lg btn-secondary w-100"
            class:disabled={loading}
            disabled={loading}>
            {$_("buttons.login")}
          </button>
          <a href="/reset-password" class="btn btn-link w-100" on:click={hide}>
            {$_("buttons.forgot-password")}
          </a>
        </div>
      </form>
    </div>
  </div>
</div>

<script context="module">
  import { get, writable } from "svelte/store";

  const dataDefault = {
    usernameOrEmail: "",
    password: "",
    recaptcha: "",
  };

  const dialogID = "loginModal";
  const data = writable(dataDefault);
  const error = writable();

  let callback = () => {};
  let hideCallback = () => {};
  let modal;

  export function show() {
    error.set(null);

    data.set({ ...dataDefault });

    modal = new window.bootstrap.Modal(document.getElementById(dialogID), {
      backdrop: "static",
      keyboard: false,
    });
    modal.show();
  }

  export function hide() {
    hideCallback();

    modal.hide();
  }

  export function setCallback(newCallback) {
    callback = newCallback;
  }

  export function onHide(newCallback) {
    hideCallback = newCallback;
  }
</script>

<script>
  import { _ } from "svelte-i18n";
  import { getContext } from "svelte";

  import { invalidateAll } from "$app/navigation";

  import { NETWORK_ERROR } from "$lib/api.util";

  import ErrorAlert from "$lib/component/ErrorAlert.svelte";

  import { getCredentials, sendLogin } from "$lib/services/auth.js";

  let loading = false;

  const session = getContext("session");

  async function onSubmit() {
    error.set(null);

    loading = true;

    await sendLogin(get(data))
      .then(async (body) => {
        if (body.result === "ok") {
          const csrfToken = body.csrfToken;

          await getCredentials(csrfToken).then(async (body) => {
            session.update((data) => {
              data.user = {
                ...Object.keys(body)
                  .filter((key) => !["result"].includes(key))
                  .reduce((object, key) => {
                    object[key] = body[key];

                    return object;
                  }, {}),
              };

              data.csrfToken = csrfToken;

              return data;
            });

            await invalidateAll();

            loading = false;

            hide();

            callback(get(data));
          });
        } else {
          loading = false;

          error.set(body.result === "error" ? body.error : NETWORK_ERROR);
        }
      })
      .catch((err) => {
        console.log(err);
        loading = false;

        error.set(NETWORK_ERROR);
      });
  }
</script>
