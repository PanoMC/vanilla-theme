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
          data-bs-target="#logo"
          data-bs-toggle="tab"
          id="logo-tab"
          role="tab"
          type="button">
          Logo
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
          data-bs-target="#header"
          data-bs-toggle="tab"
          id="header-tab"
          role="tab"
          type="button">
          Kapak
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#navbar"
          data-bs-toggle="tab"
          id="navbar-tab"
          role="tab"
          type="button">
          Navigasyon Barı
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#sidebar"
          data-bs-toggle="tab"
          id="sidebar-tab"
          role="tab"
          type="button">
          Yan Bar
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#post-card"
          data-bs-toggle="tab"
          id="post-card-tab"
          role="tab"
          type="button">
          Yazı Kartı
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-target="#footer"
          data-bs-toggle="tab"
          id="footer-tab"
          role="tab"
          type="button">
          Alt Bilgi
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
      <!-- General -->
      <div class="tab-pane fade show active" id="general" role="tabpanel">
        <div class="row mb-3">
          <label for="" class="col-md-6 col-form-label">Arka Plan Rengi</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control form-control-color"
              type="color"
              value="#ffffff" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="">Arka Plan Resmi</label>
          <div class="col-md-6">
            <input id="" class="form-control" type="file" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for=""
            >Arka Plan Resmi Yerleşimi</label>
          <div class="col-md-6">
            <select class="form-select" id="">
              <option value="1">Doldur</option>
              <option value="2">Sığdır</option>
              <option value="2">Genişlet</option>
              <option value="1">Döşe</option>
              <option value="1">Ortala</option>
              <option value="1">Karış</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6" for="">Arka Plan Resmini Tekrarla</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
      </div>

      <!-- Logo -->
      <div class="tab-pane fade" id="logo" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for=""> Görünürlük </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="coverHeight"
            >Yükseklik (px)</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control"
              type="number"
              value="128"
              max="512" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="" class="col-md-6 col-form-label">Genişlik (px)</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control"
              type="number"
              value="128"
              max="512" />
          </div>
        </div>
      </div>

      <!-- Color -->
      <div class="tab-pane fade" id="colors" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="">Ana Renk</label>
          <div class="col-md-6">
            <input
              class="form-control form-control-color"
              type="color"
              id=""
              value="#0d6efd" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="">Arka Plan Rengi</label>
          <div class="col-md-6">
            <input
              class="form-control form-control-color"
              type="color"
              id=""
              value="#ffffff" />
          </div>
        </div>
      </div>

      <!-- Cover -->
      <div class="tab-pane fade" id="header" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="">Arka Plan Resmi</label>
          <div class="col-md-6">
            <input id="" class="form-control" type="file" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="">Arka Plan Rengi</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control form-control-color"
              type="color"
              value="#ffffff" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="">Yükseklik (px)</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control"
              type="number"
              value="256"
              max="500" />
          </div>
        </div>
        <div class="row mb-3">
          <label for="" class="col-md-6 col-form-label">Genişlik</label>
          <div class="col-md-6">
            <select class="form-select" id="">
              <option value="1">İçeriğe Göre</option>
              <option value="2">Tam Genişlik</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="tab-pane fade" id="sidebar" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="">Görünürlük</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="">Konum</label>
          <div class="col-md-6">
            <select class="form-select">
              <option value="1">Sağ</option>
              <option value="2">Sol</option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="">Son Kayıt Olanlar Kartı</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for=""
            >Son Kayıt Olanlar Kartı Tablo Görünümü</label>
          <div class="col-md-6">
            <select class="form-select">
              <option value="1">Liste</option>
              <option value="2">Kafalar</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6" for=""
            >Çevrimiçi Yöneticiler Kartı (Destek)</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for=""
            >Çevrimiçi Yöneticiler Kartı Tablo Görünümü</label>
          <div class="col-md-6">
            <select class="form-select">
              <option value="1">Liste</option>
              <option value="2">Kafalar</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Navbar -->
      <div class="tab-pane fade" id="navbar" role="tabpanel">
        <div class="row mb-3">
          <label for="" class="col-md-6">Renk</label>
          <div class="col-md-6">
            <input
              id=""
              class="form-control form-control-color"
              type="color"
              value="#ffffff" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="" class="col-md-6 col-form-label">Genişlik</label>
          <div class="col-md-6">
            <select class="form-select">
              <option value="1">İçeriğe Göre</option>
              <option value="2">Tam Genişlik</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label for="" class="col-md-6 col-form-label">Bağlantılar</label>
          <div class="col-md-6">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="" />
              <label class="form-check-label" for=""> Ana Sayfa </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id=""
                checked />
              <label class="form-check-label" for="">Destek</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Card -->
      <div class="tab-pane fade" id="post-card" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for=""> Görünürlük </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for=""> Kapak Resmi </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for=""> Devamını Oku Butonu </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for=""> Yazar Kafa Resmi </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="tab-pane fade" id="footer" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for=""> Alt Bilgi </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for=""> İçerik </label>
          <div class="col-md-6">
            <div class="form-check form-switch">HTML</div>
          </div>
        </div>
      </div>

      <!-- Advanced -->
      <div class="tab-pane fade" id="advanced" role="tabpanel">
        <div class="row">
          <label class="col col-form-label" for="">Custom CSS</label>
          <div class="col-6">
            <textarea class="form-control" style="height: 200px;"></textarea>
          </div>
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
