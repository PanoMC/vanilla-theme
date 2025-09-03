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
  import { processLoad } from "$lib/ui-logics/page-logics/PostDetailPageLogics";

  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import tooltip from "$lib/tooltip.util";

  import Post from "$lib/component/Post.svelte";

  export let data;
</script>
