<Post post="{data.post}" detail="{true}" />

<div class="row justify-content-between">
  <div class="col-auto">
    <a
      href="/post/{data.previousPost === '-' ? '' : data.previousPost.url}"
      class="btn btn-link ps-0"
      class:disabled="{data.previousPost === '-'}"
      use:tooltip="{[data.previousPost.title, { placement: 'bottom' }]}">
      {$_("pages.post-detail.previous-post")}
    </a>
  </div>
  <div class="col-auto">
    <a
      href="/post/{data.nextPost === '-' ? '' : data.nextPost.url}"
      class="btn btn-link pe-0"
      class:disabled="{data.nextPost === '-'}"
      use:tooltip="{[data.nextPost.title, { placement: 'bottom' }]}">
      {$_("pages.post-detail.next-post")}
    </a>
  </div>
</div>

<script context="module">
  import { error } from "@sveltejs/kit";

  import HomeSidebar, { load as loadSidebar } from "$lib/component/sidebars/HomeSidebar.svelte";

  import { getPostDetail } from "$lib/services/posts.js";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    let data = {
      post: {
        id: -1,
        title: "",
        category: "-",
        writer: {
          username: "",
        },
        text: "",
        date: 0,
        status: 1,
        image: "",
        views: 0,
        url: "",
      },
      previousPost: "-",
      nextPost: "-",
    };

    await loadSidebar(event);

    await getPostDetail({ url: event.params.url, request: event }).then(
      (body) => {
        if (body.error) {
          if (body.error === "POST_NOT_FOUND") {
            throw error(404, body.error);
          }

          throw error(500, body.error);
        }

        data = body;
      }
    );

    return { ...data, sidebar: HomeSidebar };
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";

  import Post from "$lib/component/Post.svelte";

  export let data;
</script>
