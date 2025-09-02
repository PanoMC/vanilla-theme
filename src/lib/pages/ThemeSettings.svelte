<!-- Tema ayarları -->
<div class="card">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs" id="themeSettingsTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" data-bs-target="#general" data-bs-toggle="tab"
                id="general-tab" role="tab" type="button">
          Genel
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-target="#colors" data-bs-toggle="tab"
                id="colors-tab" role="tab" type="button">
          Renkler
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" data-bs-target="#advanced" data-bs-toggle="tab"
                id="advanced-tab" role="tab" type="button">
          Gelişmiş
        </button>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <div class="tab-content">
      <!-- Genel Ayarlar -->
      <div class="tab-pane fade show active" id="general" role="tabpanel">
        <div class="mb-3">
          <label class="form-label">Başlık</label>
          <input class="form-control" placeholder="Site başlığını giriniz" type="text">
        </div>
        <div class="mb-3">
          <label class="form-label">Logo</label>
          <input class="form-control" type="file">
        </div>
      </div>

      <!-- Renk Ayarları -->
      <div class="tab-pane fade" id="colors" role="tabpanel">
        <div class="mb-3">
          <label class="form-label">Ana Renk</label>
          <input class="form-control form-control-color" type="color" value="#0d6efd">
        </div>
        <div class="mb-3">
          <label class="form-label">Arka Plan Rengi</label>
          <input class="form-control form-control-color" type="color" value="#ffffff">
        </div>
      </div>

      <!-- Gelişmiş Ayarlar -->
      <div class="tab-pane fade" id="advanced" role="tabpanel">
        <div class="mb-3">
          <label class="form-label">Custom CSS</label>
          <textarea class="form-control" placeholder="Ek CSS kodları buraya..." rows="4"></textarea>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <button class="btn btn-secondary">Kaydet</button>
    </div>
  </div>
</div>

<script context="module">
  /**
   * @type {import("@sveltejs/kit").Load}
   */
  export async function load(event) {
    const { parent } = event;
    await parent();

    return {};
  }
</script>

<script>
  export let data;
</script>