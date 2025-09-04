<!-- Tema ayarları -->
<div class="card">
  <div class="card-header">
    <ul
      class="nav nav-tabs card-header-tabs"
      id="themeSettingsTabs"
      role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          data-bs-target="#general"
          data-bs-toggle="tab"
          id="general-tab"
          role="tab"
          type="button">
          Genel
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#colors"
          data-bs-toggle="tab"
          id="colors-tab"
          role="tab"
          type="button">
          Renkler
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#advanced"
          data-bs-toggle="tab"
          id="advanced-tab"
          role="tab"
          type="button">
          Gelişmiş
        </button>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <div class="tab-content">
      <!-- Genel Ayarlar -->
      <div class="tab-pane fade show active" id="general" role="tabpanel">
        <div class="mb-3 form-floating">
          <input class="form-control" type="text" />
          <label class="form-label">Site Başlığı</label>
        </div>
        <div class="mb-3">
          <label class="form-label">Logo Görünürlüğü</label>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault" />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Kapak Arkaplanı</label>
          <div class="row">
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault" />
              </div>
            </div>
            <div class="col-md-6">DRAG-DROP</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Yan Panel</label>
          <div class="row">
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select">
                  <option value="1">Sağ</option>
                  <option value="2">Sol</option>
                </select>
                <label for="">Yan Panel Konumu</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Son Kayıt Olanlar</label>
          <div class="row">
            <div class="col-md-6">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <select class="form-select">
                  <option value="1">Liste</option>
                  <option value="2">Kafalar</option>
                </select>
                <label for="">Tablo Stili</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Renk Ayarları -->
      <div class="tab-pane fade" id="colors" role="tabpanel">
        <div class="mb-3">
          <label class="form-label">Ana Renk</label>
          <input
            class="form-control form-control-color"
            type="color"
            value="#0d6efd" />
        </div>
        <div class="mb-3">
          <label class="form-label">Arka Plan Rengi</label>
          <input
            class="form-control form-control-color"
            type="color"
            value="#ffffff" />
        </div>
      </div>

      <!-- Gelişmiş Ayarlar -->
      <div class="tab-pane fade" id="advanced" role="tabpanel">
        <div class="mb-3 form-floating">
          <textarea class="form-control" style="height: 200px;"></textarea>
          <label class="form-label">Custom CSS</label>
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
