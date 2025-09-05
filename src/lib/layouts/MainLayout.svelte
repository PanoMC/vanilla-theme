<Header />

<!-- Gives a gray background color to the container area -->
<Navbar />

<Main>
  <slot />
</Main>

<Footer />

<NotificationContainer />

<!-- Modals End -->

<script>
  import Header from "$lib/component/Header.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Main from "$lib/component/Main.svelte";
  import Footer from "$lib/component/Footer.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";
</script>
