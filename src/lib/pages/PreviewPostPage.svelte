<h5 class="card-title mb-3">{$_("pages.preview-post.title", {values: {postTitle: post.title}})}</h5>

<Post post="{post}" detail="{true}" />

<script context="module">
  /**
   * @type {import("@sveltejs/kit").Load}
   */
  import { processLoad } from "$lib/ui-logics/page-logics/PreviewPostPageLogics";

  export async function load(event) {
    return processLoad(event);
  }
</script>

<script>
  import { _ } from "svelte-i18n";

  import Post from "$lib/components/Post.svelte";

  export let post;
</script>
