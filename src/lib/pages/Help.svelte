<div class="card">
  <div class="card-body">
    <h3 class="card-title">Yardım Merkezi</h3>
    <p class="my-3">Nasıl yardım almak istersin?</p>
    <ul class="list-group list-group-horizontal text-center">
      <a
        href="/ticket/create"
        class="list-group-item list-group-item-action disabled">
        <i class="fas fa-ticket fa-2x my-3"></i>
        <h5>Oyun Rehberi</h5>
        <p class="mb-0">
          {$session.siteInfo.websiteName} öğretici rehberine göz at.
        </p>
      </a>

      <a href="#" class="list-group-item list-group-item-action disabled">
        <i class="fas fa-envelope fa-2x my-3"></i>
        <div class="col-auto">
          <h5>Kurallar</h5>
          <p class="mb-0">Şartları ve kuralları öğren.</p>
        </div>
      </a>

      <a href="#" class="list-group-item list-group-item-action disabled">
        <i class="fas fa-question fa-2x my-3"></i>
        <div class="col-auto">
          <h5>Sık Sorulan Sorular</h5>
          <p class="mb-0">
            {$session.siteInfo.websiteName} hakkında aklına takılan sorulara cevap
            bul.
          </p>
        </div>
      </a>
    </ul>
  </div>
</div>

<script>
  import { getContext } from "svelte";

  export let data;

  const session = getContext("session");
</script>
