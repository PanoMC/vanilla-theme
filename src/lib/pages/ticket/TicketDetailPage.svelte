<style global>
  .answer {
    margin-bottom: 0;
  }
</style>

<article class="container">
  <div class="card">
    <div
      class="card-header bg-opacity-25 py-3 rounded-top"
      class:bg-danger="{$ticket.status === TicketStatuses.CLOSED}"
      class:bg-secondary="{$ticket.status === TicketStatuses.NEW}"
      class:bg-warning="{$ticket.status === TicketStatuses.REPLIED}">
      <div class="row">
        <div class="col">
          <h5 class="card-title">{$ticket.title}</h5>
          <small class="mb-0">
            {$_("pages.ticket-detail.detail.ticket", { values: { ticketId: $ticket.id, } })},
            <Date relativeFormat="{true}" time="{$ticket.date}" />
            ,
            {@html $_("pages.ticket-detail.detail.opened-in-category", {values: {category: `<a
              href="/tickets?category=${$ticket.category.url}"
              title="${$_("pages.ticket-detail.filter")}"
              >${$ticket.category === "-"
                ? $_("pages.ticket-detail.no-category")
                  : $ticket.category.title}
            </a>`, }})}</small>
        </div>
        <div class="col-auto">
          <TicketStatus status="{$ticket.status}" />
        </div>
      </div>
    </div>
    <div
      class="card-body"
      id="messageSection"
      bind:this="{$messagesSectionDiv}">
      {#if $messages.length < $ticket.messageCount && $ticket.messageCount > 5}
        <button
          class="btn btn-link bg-light d-block m-auto"
          class:disabled="{$loadMoreLoading}"
          on:click="{() => loadMore(loadMoreLoading, messages, data)}"
        ><i class="fas fa-arrow-up mr-1"></i> {$_("pages.ticket-detail.previous-messages", {
          values: {
            count: $ticket
                .messageCount -
              ($messages.length - $sentMessageCount)
          }
        })}
        </button>
      {/if}

      {#each $messages as message, index (message)}
        {#if message.panel}
          <div class="row py-2 flex-nowrap justify-content-start">
            <div class="col-auto">
              <a href="/player/{message.username}">
                <img
                  src="https://minotar.net/avatar/{message.username}/48"
                  alt="{message.username}"
                  class="rounded d-block mr-auto animate__animated animate__zoomIn"
                  use:tooltip="{[message.username, { placement: 'bottom' }]}"
                  width="48"
                  height="48" />
              </a>
            </div>
            <div class="col-auto">
              <div class="card text-bg-light">
                <div class="card-header small">
                  <Date time="{message.date}" />
                </div>
                <div class="card-body answer">
                  {@html message.message}
                </div>
              </div>
            </div>
          </div>
        {:else}
          <div class="row py-2 flex-nowrap justify-content-end">
            <div class="col-auto">
              <a href="/player/{message.username}">
                <img
                  src="https://minotar.net/avatar/{message.username}/48"
                  alt="{message.username}"
                  class="rounded animate__animated animate__zoomIn"
                  use:tooltip="{[message.username, { placement: 'bottom' }]}"
                  width="48"
                  height="48" />
              </a>
            </div>
            <div class="col-auto">
              <div class="card text-bg-secondary">
                <div class="card-header small">
                  <Date time="{message.date}" />
                </div>
                <div class="card-body">
                  {message.message}
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/each}

      <div
        class="row align-items-end mt-3"
        class:d-none="{$ticket.status === TicketStatuses.CLOSED}">
        <div class="col">
          <textarea
            placeholder="{$_('pages.ticket-detail.inputs.message.placeholder')}"
            class="form-control"
            bind:value="{$message}"></textarea>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-secondary"
            :disabled="{$messageSendLoading || isSendButtonDisabled}"
            class:disabled="{$messageSendLoading || isSendButtonDisabled}"
            on:click="{() => sendMessage(messageSendLoading, sentMessageCount, shouldScroll, messages, message, data)}">
            <i class="fas fa-paper-plane"></i>
            <span class="d-xl-inline d-none ms-2">{$_("pages.ticket-detail.send-button")}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</article>

<script context="module">
  import { processLoad } from "$lib/ui-logics/page-logics/TicketDetailPageLogics.js";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import { init, loadMore, sendMessage } from "$lib/ui-logics/page-logics/TicketDetailPageLogics";

  import Date from "$lib/component/Date.svelte";
  import tooltip from "$lib/tooltip.util";

  import TicketStatus, {
    TicketStatuses,
  } from "$lib/component/TicketStatus.svelte";

  export let data;

  const {
    message,
    messageSendLoading,
    messagesSectionDiv,
    loadMoreLoading,
    shouldScroll,
    sentMessageCount,
    messages,
    ticket
  } = init(data);

  $: isSendButtonDisabled = $message === "";
</script>
