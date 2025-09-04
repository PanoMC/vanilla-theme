<!-- Settings -->
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
          class="btn btn-outline-primary"
          class:is-invalid={$resetPasswordError}
          on:click={sendResetPasswordLink}
          aria-describedby="resetPassword validationResetPassword"
          disabled={$resetPasswordLoading || !$session.siteInfo.emailEnabled}
          type="button"
          >{$_("pages.settings.inputs.change-password.description")}</button>

        <div id="validationResetPassword" class="invalid-feedback">
          {$resetPasswordError}
        </div>
        {#if $resetPasswordSuccess}
          <p class="text-dark mb-0">
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
          on:submit|preventDefault={() =>
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
              : startChangingEmail2ndStep(changingEmail2ndStep)}>
          <div class="row">
            {#if !$changingEmail}
              <div class="col-12">
                {#if $changingEmailSuccess}
                  <p class="text-dark mb-0">
                    {$_("pages.settings.inputs.change-email.success-message", {
                      values: { $newEmail },
                    })}
                  </p>
                {:else}
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    aria-describedby="userEmail"
                    on:click={() => startChangingEmail(changingEmail)}
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
                  {$changingEmailError}
                </div>
              </div>
              <div class="col-auto">
                <button
                  type="reset"
                  class="btn btn-link link-primary"
                  on:click={() =>
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
                  on:click={() =>
                    stopChangingEmail(
                      currentPassword,
                      newEmail,
                      changingEmail,
                    )}>
                  {$_("pages.settings.inputs.change-email.cancel")}
                </button>
                <button type="submit" class="btn btn-link"
                  >{$_("pages.settings.inputs.change-email.continue")}</button>
              </div>
            {/if}
          </div>
        </form>
      </div>
    </div>
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
  import { getContext } from "svelte";
  import { _ } from "svelte-i18n";

  import {
    init,
    sendChangeEmailLink,
    startChangingEmail,
    startChangingEmail2ndStep,
    stopChangingEmail,
    stopChangingEmail2ndStep,
  } from "$lib/ui-logics/page-logics/SettingsPageLogics";

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
  } = init();

  const session = getContext("session");
</script>
