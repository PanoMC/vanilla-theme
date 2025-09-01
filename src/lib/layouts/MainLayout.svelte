<Header />

<!-- Gives a gray background color to the container area -->
<Navbar />
<!-- Announcement Alert -->
<div class="container">
  <div class="mb-3">
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <button
        aria-label="Close"
        class="btn-close"
        data-bs-dismiss="alert"
        type="button"></button>
      Alert 1
    </div>
  </div>
</div>
<!--Announcement Alert End-->
<Main>
  <slot />
</Main>

<Footer />

<!-- Modals Start-->
<LoginModal />

<RegisterModal />

<!-- Modals End -->

<NotificationContainer />

<script>
  import Header from "$lib/component/Header.svelte";
  import Navbar from "$lib/component/Navbar.svelte";
  import Main from "$lib/component/Main.svelte";
  import Footer from "$lib/component/Footer.svelte";

  import LoginModal from "$lib/component/modals/LoginModal.svelte";
  import RegisterModal from "$lib/component/modals/RegisterModal.svelte";
  import NotificationContainer from "$lib/component/NotificationContainer.svelte";
</script>
