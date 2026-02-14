<div class="vstack gap-3">
  <PageTitle title={$session.user?.username} />

  <!-- Accordion -->
  <div class="accordion" id="profileAccordion">
    <!-- Statistics -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#statisticsCollapse">
          {$_("pages.profile.title")}
        </button>
      </h2>
      <div id="statisticsCollapse" class="accordion-collapse collapse show" data-bs-parent="#profileAccordion">
        <div class="accordion-body p-0">
          <div class="table-responsive">
            <table class="table">
              <tbody>
                <tr>
                  <td class="ps-3">{$_("pages.profile.register-date")}</td>
                  <td class="pe-3 text-end"><Date time={data.registerDate} /></td>
                </tr>
                <tr>
                  <td class="ps-3">{$_("pages.profile.last-login")}</td>
                  <td class="pe-3 text-end"><Date time={data.lastLoginDate} relativeFormat="true" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tickets -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ticketsCollapse">
          {$_("buttons.tickets")}
        </button>
      </h2>
      <div id="ticketsCollapse" class="accordion-collapse collapse" data-bs-parent="#profileAccordion">
        <div class="accordion-body p-0">
          <div class="card border-0">
            <div class="card-header d-flex justify-content-between align-items-center flex-column flex-md-row gap-2 bg-transparent">
              <div class="btn-group w-100">
                <a class="btn btn-outline-primary btn-sm" class:active={data.pageType === PageTypes.ALL} role="button" href="/profile?pageType=ALL">{$_("pages.tickets.all")}</a>
                <a class="btn btn-outline-primary btn-sm" class:active={data.pageType === PageTypes.CLOSED} role="button" href="/profile?pageType=CLOSED">{$_("pages.tickets.closed")}</a>
              </div>
            </div>
            <Tickets on:closeTicket={(event) => onTicketsClose(event.detail.ticket)} tickets={$tickets} />
            {#if data.ticketsData.ticketCount > 0}
              <div class="card-footer bg-transparent border-top">
                <Pagination
                  page={data.ticketsData.page}
                  totalPage={data.ticketsData.totalPage}
                  loading={false}
                  on:firstPageClick={() => onTicketsPageClick(1)}
                  on:lastPageClick={() => onTicketsPageClick(data.ticketsData.totalPage)}
                  on:pageLinkClick={(event) => onTicketsPageClick(event.detail.page)} />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#settingsCollapse">
          {$_("buttons.settings")}
        </button>
      </h2>
      <div id="settingsCollapse" class="accordion-collapse collapse" data-bs-parent="#profileAccordion">
        <div class="accordion-body">
          <div class="vstack gap-3">
            <!-- Change Password -->
            <div class="row mb-3">
              <label class="col-md-6 col-form-label">{$_("pages.settings.inputs.change-password.title")}</label>
              <div class="col-md-6">
                <button class="btn btn-primary" on:click={() => sendResetPasswordLink(resetPasswordError, resetPasswordLoading, resetPasswordSuccess, session)} disabled={$resetPasswordLoading || !$session.siteInfo.emailEnabled} type="button">
                  {$_("pages.settings.inputs.change-password.description")}
                </button>
                {#if $resetPasswordSuccess}
                  <p class="text-success mt-1 mb-0 small">{$_("pages.settings.inputs.change-password.success-message")}</p>
                {/if}
                {#if $resetPasswordError}
                  <div class="text-danger mt-1 small">{$_("errors." + $resetPasswordError)}</div>
                {/if}
              </div>
            </div>

            <!-- Change Email -->
            <div class="row mb-3">
              <label class="col-md-6 col-form-label">{$_("pages.settings.inputs.change-email.title")}</label>
              <div class="col-md-6">
                {#if !$changingEmail}
                  {#if $changingEmailSuccess}
                    <p class="text-success mb-0 small">{$_("pages.settings.inputs.change-email.success-message", { values: { newEmail: $newEmail } })}</p>
                  {:else}
                    <button type="button" class="btn btn-primary" on:click={() => startChangingEmail(changingEmail)} disabled={!$session.siteInfo.emailEnabled}>
                      {$_("pages.settings.inputs.change-email.description")}
                    </button>
                  {/if}
                {:else}
                  <form on:submit={(e) => { e.preventDefault(); $changingEmail2ndStep ? sendChangeEmailLink(changingEmailError, changingEmailLoading, changingEmailSuccess, currentPassword, newEmail, changingEmail, changingEmail2ndStep) : startChangingEmail2ndStep(changingEmail2ndStep); }}>
                    <div class="vstack gap-2">
                      {#if $changingEmail2ndStep}
                        <input type="email" placeholder={$_("pages.settings.inputs.change-password.new-email-placeholder")} class="form-control" bind:value={$newEmail} class:is-invalid={$changingEmailError} required />
                        <div class="invalid-feedback">{$_("errors." + $changingEmailError)}</div>
                        <div class="d-flex gap-2">
                          <button type="button" class="btn btn-link btn-sm ps-0" on:click={() => stopChangingEmail2ndStep(changingEmail2ndStep)}>{$_("pages.settings.inputs.change-email.back")}</button>
                          <button type="submit" class="btn btn-primary btn-sm" disabled={$changingEmailLoading}>{$_("pages.settings.inputs.change-email.confirm")}</button>
                        </div>
                      {:else}
                        <input type="password" placeholder={$_("pages.settings.inputs.change-email.current-password-placeholder")} class="form-control" bind:value={$currentPassword} required />
                        <div class="d-flex gap-2">
                          <button type="button" class="btn btn-link btn-sm ps-0" on:click={() => stopChangingEmail(currentPassword, newEmail, changingEmail)}>{$_("pages.settings.inputs.change-email.cancel")}</button>
                          <button type="submit" class="btn btn-primary btn-sm">{$_("pages.settings.inputs.change-email.continue")}</button>
                        </div>
                      {/if}
                    </div>
                  </form>
                {/if}
              </div>
            </div>

            <!-- Language -->
            {#if $session.siteInfo.allowUserLocaleSelection}
              <div class="row mb-3">
                <label class="col-md-6 col-form-label">{$_("pages.settings.inputs.display-language.title")}</label>
                <div class="col-md-6">
                  <select class="form-select" bind:value={$userLocale}>
                    {#each Object.keys($Languages) as language (language)}
                      <option value={$Languages[language].code}>{$Languages[language].name}</option>
                    {/each}
                  </select>
                </div>
              </div>

              {#if saveButtonVisible}
                <button class="btn btn-secondary mt-2" disabled={saveButtonDisabled} on:click={() => saveSettings(userLocale, saveButtonLoading)}>
                  {$_("buttons.save")}
                </button>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#notificationsCollapse">
          {$_("buttons.notifications")}
        </button>
      </h2>
      <div id="notificationsCollapse" class="accordion-collapse collapse" data-bs-parent="#profileAccordion">
        <div class="accordion-body">
          <div class="d-flex justify-content-end mb-2">
            {#if $notifications.length !== 0}
              <button type="button" class="btn btn-link link-danger p-0" aria-label={$_("buttons.delete-all")} use:tooltip={[$_("buttons.delete-all")]} on:click={() => onDeleteAllClick(notificationProcessID, interval)}>
                <i class="fas fa-trash-alt"></i>
              </button>
            {/if}
          </div>

          <div class="list-group mt-2" class:d-none={$notifications.length === 0}>
            {#each $notifications as notification (notification.id)}
              <div class="fw-normal list-group-item list-group-item-action d-flex align-items-center gap-3 text-wrap" class:notification-unread={notification.status === "NOT_READ"}>
                <button type="button" title={$_("buttons.view")} aria-label={$_("buttons.view")} on:click={() => onNotificationClick(notification)} class="flex-grow-1 text-start border-0 bg-transparent p-0 d-flex align-items-center gap-3">
                  <span class="d-flex align-items-center">
                    {#if notification.details.faIcon}
                      <i class="{notification.details.faIcon} fa-xl fa-fw text-primary"></i>
                    {:else if notification.details.image || notification.details.username}
                      <img src={notification.details.image || `https://minotar.net/avatar/${notification.details.username}/64`} alt={$_("buttons.view")} width="30" height="30" class="rounded" />
                    {:else}
                      <i class="fa fa-bolt fa-xl fa-fw text-primary"></i>
                    {/if}
                  </span>
                  <div class="fw-normal">
                    <span class="text-wrap markdown-renderer text-break">{@html $_("notifications." + notification.type, { values: { ...sanitizeObject(notification.details || {}) } })}</span>
                    <br />
                    <small>{getTime($checkTime, parseInt(notification.createdAt), locales[$currentLanguage.dateFnsCode])}</small>
                  </div>
                </button>
                <button type="button" class="btn-close ms-2" aria-label={$_("pages.notifications.delete-notification")} use:tooltip={[$_("pages.notifications.delete-notification"), { placement: "bottom" }]} on:click={() => onDeleteNotificationClick(notifications, count, notification.id)}></button>
              </div>
            {/each}
          </div>

          {#if $notifications.length === 0}
            <NoContent />
          {/if}

          {#if data.notificationsData.notificationCount > 0}
            <div class="mt-3">
              <Pagination
                page={data.notificationsData.page}
                totalPage={data.notificationsData.totalPage}
                loading={false}
                on:firstPageClick={() => onNotificationsPageClick(1)}
                on:lastPageClick={() => onNotificationsPageClick(data.notificationsData.totalPage)}
                on:pageLinkClick={(event) => onNotificationsPageClick(event.detail.page)} />
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Sessions -->
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sessionsCollapse">
          {$_("pages.settings.inputs.sessions.title")}
        </button>
      </h2>
      <div id="sessionsCollapse" class="accordion-collapse collapse" data-bs-parent="#profileAccordion">
        <div class="accordion-body p-0">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th class="ps-3">ID</th>
                  <th>{$_("pages.settings.inputs.sessions.browser")}</th>
                  <th>IP</th>
                  <th>{$_("pages.settings.inputs.sessions.last-entrance")}</th>
                  <th class="pe-3"></th>
                </tr>
              </thead>
              <tbody>
                {#each data.sessions as sessionItem}
                  <tr class:table-active={sessionItem.isCurrent}>
                    <td class="ps-3"><code>#{sessionItem.id}</code></td>
                    <td><span use:tooltip={[sessionItem.userAgent]}>{parseUserAgent(sessionItem.userAgent)}</span></td>
                    <td><code>{sessionItem.ip}</code></td>
                    <td><Date time={sessionItem.lastActivityTime} relativeFormat="true" /></td>
                    <td class="pe-3 text-end">
                      <button class="btn btn-link link-danger p-0" aria-label={$_("buttons.logout")} on:click={() => onSessionLogout(sessionItem.id, sessionItem.isCurrent)} disabled={$loadingSessionId === sessionItem.id} use:tooltip={[$_("buttons.logout")]}>
                        <i class="fas fa-sign-out-alt"></i>
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmRemoveAllNotificationsModal />
</div>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/ProfilePageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { getContext } from "svelte";
  import { invalidateAll, goto } from "$app/navigation";
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";

  import Date from "$lib/components/Date.svelte";
  import PageTitle from "$lib/components/PageTitle.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Tickets from "$lib/components/Tickets.svelte";

  import { parseUserAgent } from "$lib/string.util";
  import { logout } from "$lib/Store";
  import { Languages, currentLanguage } from "$lib/language.util";
  import { show as showToast } from "$lib/components/ToastContainer.svelte";

  import {
    init as initTickets,
    onCloseTicketClick,
    onPageClick
  } from "$lib/ui-logics/page-logics/TicketsPageLogics";
  import { PageTypes } from "$lib/ui-logics/page-logics/ProfilePageLogics";

  import {
    init as initSettings,
    sendChangeEmailLink,
    sendResetPasswordLink,
    startChangingEmail,
    startChangingEmail2ndStep,
    stopChangingEmail,
    stopChangingEmail2ndStep,
    saveSettings,
    onLogoutSession
  } from "$lib/ui-logics/page-logics/SettingsPageLogics";

  import * as locales from "date-fns/locale";
  import { onNotificationClick } from "$lib/NotificationManager";
  import {
    init as initNotifications,
    onDeleteNotificationClick,
    loadMore,
    onDeleteAllClick,
    sanitizeObject,
    getTime
  } from "$lib/ui-logics/page-logics/NotificationsPageLogics";

  import ConfirmRemoveAllNotificationsModal from "$lib/components/modals/ConfirmRemoveAllNotificationsModal.svelte";
  import PageActions from "$lib/components/PageActions.svelte";
  import NoContent from "$lib/components/NoContent.svelte";

  export let data;

  const session = getContext("session");

  // Notifications Logic
  const {
    notifications,
    count,
    notificationProcessID,
    checkTime,
    interval
  } = initNotifications(data.notificationsData);

  $: {
    notifications.set(data.notificationsData.notifications);
    count.set(data.notificationsData.notificationCount);
  }

  // Tickets Logic
  let tickets;
  $: {
    tickets = initTickets(data.ticketsData).tickets;
  }
  function onTicketsClose(ticket) {
    onCloseTicketClick(tickets, ticket);
  }
  function onTicketsPageClick(page) {
    onPageClick({ page, pageType: data.pageType }, page);
  }
  function onNotificationsPageClick(page) {
    const url = new URL(window.location);
    url.searchParams.set("notificationsPage", page);
    goto(url.toString(), { invalidateAll: true });
  }

  // Settings Logic
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
  } = initSettings($session);

  $: saveButtonVisible = $session.siteInfo.allowUserLocaleSelection;
  $: saveButtonDisabled = $userLocale === $currentLanguage.code || $saveButtonLoading;

  // Sessions Logic
  function onSessionLogout(sessionId, isCurrent) {
    if (isCurrent) {
      if (confirm($_("components.modals.logout-session-confirm.title"))) {
        logout();
      }
    } else {
      onLogoutSession(sessionId, loadingSessionId, showToast, invalidateAll);
    }
  }
</script>
