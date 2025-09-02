<Header />

<!-- Gives a gray background color to the container area -->
<Navbar />

<Main>
  <slot />
</Main>

<Footer />

<!-- Modals End -->

<script>
  import Header from "$lib/component/Header.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Main from "$lib/component/Main.svelte";
  import Footer from "$lib/component/Footer.svelte";
</script>
