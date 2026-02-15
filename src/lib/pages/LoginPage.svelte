<style>
  #usernameOrEmail {
    margin-bottom: -2px;
  }

  #usernameOrEmail:focus {
    position: relative;
    z-index: 2;
  }
</style>

<form on:submit|preventDefault={onSubmit}>
  <div class="vstack gap-3">
    <PageTitle title={$_("components.modals.login.title")} />
    {#if $session.siteInfo.isDemo}
      <div class="alert alert-info py-2" role="alert">
        {$_("pages.login.demo-mode-alert")}
      </div>
    {/if}
    <ErrorAlert error={error} />
    <div class="form-group">
      <div class="form-floating">
        <input
          bind:value={usernameOrEmail}
          class="form-control rounded-bottom-0"
          id="usernameOrEmail"
          disabled={loading}
          type="text" />
        <label for="usernameOrEmail"
          >{$_("components.modals.login.inputs.username-email")}</label>
      </div>

      <div class="form-floating">
        <input
          bind:value={password}
          class="form-control rounded-top-0"
          id="password"
          disabled={loading}
          type="password" />
        <label for="password"
          >{$_("components.modals.login.inputs.password")}</label>
      </div>
    </div>
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
            <span>{$_("buttons.login")}...</span>
          {:else}
            {$_("buttons.login")}
          {/if}
      </button>
      <a
          class="btn btn-link {loading ? 'disabled pe-none' : ''}"
          aria-disabled={loading}
          tabindex={loading ? -1 : undefined}
          href="/reset-password">
          {$_("buttons.forgot-password")}
        </a>
    </div>
  </div>
</form>

<script>
  import { _ } from "svelte-i18n";
  import { getContext, onMount } from "svelte";
  import { format } from "date-fns";
  import * as locales from "date-fns/locale";

  import { goto } from "$app/navigation";

  import { NETWORK_ERROR } from "$lib/api.util";
  import { currentLanguage } from "$lib/language.util";

  import ErrorAlert from "$lib/components/ErrorAlert.svelte";
  import PageTitle from "$lib/components/PageTitle.svelte";

  import { getCredentials, sendLogin } from "$lib/services/auth.js";

  let usernameOrEmail = "",
    password = "";
  let loading, error, errorProperties;

  const session = getContext("session");

  async function onSubmit() {
    error = null;
    loading = true;

    await sendLogin({ usernameOrEmail, password, recaptcha: "" })
      .then(async (body) => {
        if (body.result !== "ok") {
          loading = false;
          error = body.result === "error" ? body.error : NETWORK_ERROR;

          if (
            body.result === "error" &&
            body.error === "LOGIN_USER_IS_BANNED"
          ) {
            if (!body.until) {
              error = { key: "LOGIN_USER_IS_BANNED_PERMANENTLY" };
              if (body.reason) {
                error = {
                  key: "LOGIN_USER_IS_BANNED_PERMANENTLY_WITH_REASON",
                  props: { reason: `'${body.reason}'` },
                };
              }
            } else {
              const formattedUntil = format(
                new Date(body.until),
                "dd/MM/yyyy HH:mm",
                {
                  locale: locales[$currentLanguage.dateFnsCode],
                },
              );

              error = {
                key: "LOGIN_USER_IS_BANNED_TEMPORARY",
                props: { untilTime: formattedUntil },
              };

              if (body.reason) {
                error = {
                  key: "LOGIN_USER_IS_BANNED_TEMPORARY_WITH_REASON",
                  props: {
                    reason: `'${body.reason}'`,
                    untilTime: formattedUntil,
                  },
                };
              }
            }
          }

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
                }, {}),
            };

            data.csrfToken = csrfToken;

            return data;
          });

          await goto("/");

          loading = false;
        });
      })
      .catch((err) => {
        console.log(err);
        loading = false;
      });
  }

  onMount(() => {
    if ($session.siteInfo.isDemo) {
      usernameOrEmail = "demo";
      password = "123456";
    }
  });
</script>
