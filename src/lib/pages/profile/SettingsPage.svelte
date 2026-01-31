<!-- Settings -->
<div class="vstack gap-3">
  <div class="card">
    <div class="card-header">
      {$_("pages.settings.title")}
    </div>
    <div class="card-body">
      <div class="row">
        <label class="col-md-4 col-form-label" for="resetPassword">
          {$_("pages.settings.inputs.change-password.title")}
        </label>
        <div class="col col-form-label">
          <button
            class="btn btn-primary"
            class:is-invalid={$resetPasswordError}
            onclick={() =>
              sendResetPasswordLink(
                resetPasswordError,
                resetPasswordLoading,
                resetPasswordSuccess,
                session,
              )}
            aria-describedby="resetPassword validationResetPassword"
            disabled={$resetPasswordLoading || !$session.siteInfo.emailEnabled}
            type="button"
            >{$_("pages.settings.inputs.change-password.description")}</button>

          <div id="validationResetPassword" class="invalid-feedback">
            {$_("errors." + $resetPasswordError)}
          </div>
          {#if $resetPasswordSuccess}
            <p class="mb-0">
              {$_("pages.settings.inputs.change-password.success-message")}
            </p>
          {/if}
        </div>
      </div>

      <div class="row">
        <label class="col-md-4 col-form-label" for="userEmail">
          {$_("pages.settings.inputs.change-email.title")}
        </label>
        <div class="col col-form-label">
          <form
            onsubmit={(e) => {
              e.preventDefault();
              $changingEmail2ndStep
                ? sendChangeEmailLink(
                    changingEmailError,
                    changingEmailLoading,
                    changingEmailSuccess,
                    currentPassword,
                    newEmail,
                    changingEmail,
                    changingEmail2ndStep,
                  )
                : startChangingEmail2ndStep(changingEmail2ndStep);
            }}>
            <div class="row">
              {#if !$changingEmail}
                <div class="col-12">
                  {#if $changingEmailSuccess}
                    <p class="text-dark mb-0">
                      {$_(
                        "pages.settings.inputs.change-email.success-message",
                        {
                          values: { newEmail: $newEmail },
                        },
                      )}
                    </p>
                  {:else}
                    <button
                      type="button"
                      class="btn btn-primary"
                      aria-describedby="userEmail"
                      onclick={() => startChangingEmail(changingEmail)}
                      disabled={!$session.siteInfo.emailEnabled}
                      >{$_(
                        "pages.settings.inputs.change-email.description",
                      )}</button>
                  {/if}
                </div>
              {:else if $changingEmail2ndStep}
                <div class="col">
                  <input
                    type="email"
                    id="newEmail"
                    placeholder={$_(
                      "pages.settings.inputs.change-password.new-email-placeholder",
                    )}
                    class="form-control"
                    aria-describedby="validationChangingEmail"
                    bind:value={$newEmail}
                    class:is-invalid={$changingEmailError}
                    autofocus />
                  <div id="validationChangingEmail" class="invalid-feedback">
                    {$_("errors." + $changingEmailError)}
                  </div>
                </div>
                <div class="col-auto">
                  <button
                    type="reset"
                    class="btn btn-link link-primary"
                    onclick={() =>
                      stopChangingEmail2ndStep(changingEmail2ndStep)}>
                    {$_("pages.settings.inputs.change-email.back")}
                  </button>
                  <button
                    type="submit"
                    class="btn btn-link link-secondary"
                    class:disabled={$changingEmailLoading}>
                    {$_("pages.settings.inputs.change-email.confirm")}
                  </button>
                </div>
              {:else}
                <div class="col">
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder={$_(
                      "pages.settings.inputs.change-email.current-password-placeholder",
                    )}
                    class="form-control"
                    bind:value={$currentPassword}
                    autofocus />
                </div>
                <div class="col-auto">
                  <button
                    type="reset"
                    class="btn btn-link link-danger"
                    onclick={() =>
                      stopChangingEmail(
                        currentPassword,
                        newEmail,
                        changingEmail,
                      )}>
                    {$_("pages.settings.inputs.change-email.cancel")}
                  </button>
                  <button type="submit" class="btn btn-link"
                    >{$_(
                      "pages.settings.inputs.change-email.continue",
                    )}</button>
                </div>
              {/if}
            </div>
          </form>
        </div>
      </div>

      {#if $session.siteInfo.allowUserLocaleSelection}
        <div class="row">
          <label class="col-md-4 col-form-label" for="userLocaleCode">
            {$_("pages.settings.inputs.display-language.title")}
          </label>
          <div class="col col-form-label">
            <select
              class="form-control"
              id="userLocaleCode"
              bind:value={$userLocale}>
              {#each Object.keys($Languages) as language, index (language)}
                <option value={$Languages[language].code}
                  >{$Languages[language].name}</option>
              {/each}
            </select>
          </div>
        </div>
      {/if}
      {#if saveButtonVisible}
        <button
          class="btn btn-secondary"
          class:disabled={saveButtonDisabled}
          aria-disabled={saveButtonDisabled}
          onclick={() => saveSettings(userLocale, saveButtonLoading)}
          >{$_("buttons.save")}
        </button>
      {/if}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      {$_("pages.settings.inputs.sessions.title")}
      <small class="d-block"
        >{$_("pages.settings.inputs.sessions.max-sessions-warning")}</small>
    </div>
    {#if !sessions}
      <div class="text-center p-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    {:else if sessions.length === 0}
      <div class="card-body">
        <NoContent />
      </div>
    {:else}
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th class="align-middle">ID</th>
              <th class="align-middle"></th>
              <th class="align-middle"
                >{$_("pages.settings.inputs.sessions.browser")}</th>
              <th class="align-middle">IP</th>
              <th class="align-middle"
                >{$_("pages.settings.inputs.sessions.last-entrance")}</th>
              <th class="align-middle"
                >{$_("pages.settings.inputs.sessions.expire-date")}</th>
              <th class="align-middle"></th>
            </tr>
          </thead>
          <tbody>
            {#each sessions as session}
              <tr class:table-active={session.isCurrent}>
                <td class="align-middle">
                  <code>#{session.id}</code>
                </td>
                <td class="align-middle">
                  {#if session.isCurrent}
                    <span class="badge text-bg-primary"
                      >{$_(
                        "pages.settings.inputs.sessions.current-session",
                      )}</span>
                  {/if}
                </td>
                <td class="align-middle">
                  <span title={session.userAgent}>
                    {parseUserAgent(session.userAgent)}
                  </span>
                </td>
                <td class="align-middle">
                  <code>{session.ip}</code>
                </td>
                <td class="align-middle"
                  ><DateComponent time={session.lastActivityTime} /></td>
                <td class="align-middle"
                  ><DateComponent time={session.expireDate} /></td>
                <td class="align-middle text-end">
                  <button
                    class="btn btn-link text-danger"
                    title={$_("buttons.logout")}
                    aria-label={$_("buttons.logout")}
                    onclick={() =>
                      onLogoutSession(
                        session.id,
                        session.isCurrent,
                        loadingSessionId,
                        showToast,
                        invalidateAll,
                      )}
                    disabled={$loadingSessionId === session.id}>
                    {#if $loadingSessionId === session.id}
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"></span>
                    {:else}
                      <i class="fas fa-sign-out-alt"></i>
                    {/if}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/SettingsPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { getContext, onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { _ } from "svelte-i18n";
  import { parseUserAgent } from "$lib/string.util";
  import NoContent from "$lib/component/NoContent.svelte";
  import DateComponent from "$lib/component/Date.svelte";
  import tooltip from "$lib/tooltip.util";
  import { show as showToast } from "$lib/component/ToastContainer.svelte";

  import {
    init,
    sendChangeEmailLink,
    sendResetPasswordLink,
    startChangingEmail,
    startChangingEmail2ndStep,
    stopChangingEmail,
    stopChangingEmail2ndStep,
    saveSettings,
    onLogoutSession,
  } from "$lib/ui-logics/page-logics/SettingsPageLogics";

  import { Languages, currentLanguage } from "$lib/language.util";

  export let data;
  let sessions = [];

  const session = getContext("session");

  const {
    resetPasswordError,
    resetPasswordLoading,
    resetPasswordSuccess,
    currentPassword,
    newEmail,
    changingEmail,
    changingEmail2ndStep,
    changingEmailError,
    changingEmailLoading,
    changingEmailSuccess,
    userLocale,
    saveButtonLoading,
    loadingSessionId,
  } = init($session);

  $: sessions = data.sessions;

  $: saveButtonVisible = $session.siteInfo.allowUserLocaleSelection;
  $: saveButtonDisabled =
    $userLocale === $currentLanguage.code || $saveButtonLoading;
</script>
