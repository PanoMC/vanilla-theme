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
          <label class="col-md-6 col-form-label" for="theme-color"
          >Tema Rengi</label>
          <div class="col-md-6">
            <select class="form-select" id="theme-color" on:change={e => themeSettings.themeColor = e.target.value}
                    value={themeSettings.themeColor || 'dark'}>
              <option value="dark">Koyu</option>
              <option value="light">Açık</option>
              <option value="copper">Bakır</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="bgColor">Arka Plan Rengi</label>
          <div class="col-md-6">
            <input
              id="bgColor"
              class="form-control form-control-color"
              type="color"
              on:input={e => themeSettings.backgroundColor = e.target.value}
              value="{themeSettings.backgroundColor || '#f5f7fa'}" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="background-image-upload">Arka Plan Resmi</label>
          <div class="col-md-6">
            {#if themeSettings.files?.backgroundImage}
              <div class="input-group">
                <img
                  alt="Arka Plan Resmi"
                  class="border rounded-start"
                  style="object-fit: contain;"
                  width="71"
                  height="40"
                  src={'/api/theme/file/' + themeSettings.files.backgroundImage}
                />

                <input id="background-image-upload" class="form-control" type="file" accept="image/*"
                       bind:files={backgroundImageFiles}
                       on:change={onBackgroundImageChange} />
                <button
                  class="btn btn-outline-danger shadow-none rounded-end"
                  on:click={onRemoveBackgroundImageClick}
                >{$_("buttons.remove")}</button>
              </div>
            {:else}
              <input id="background-image-upload" class="form-control" type="file" accept="image/*"
                     bind:files={backgroundImageFiles}
                     on:change={onBackgroundImageChange} />
            {/if}
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="bg-image-position"
            >Arka Plan Resmi Yerleşimi</label>
          <div class="col-md-6">
            <select class="form-select" id="bg-image-position" on:change={e => themeSettings.bgImagePosition = e.target.value}
                    value={themeSettings.bgImagePosition || 'center center'}>
              <option value="left top">Sol Üst</option>
              <option value="center center">Ortala</option>
              <option value="right bottom">Sağ Alt</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="bg-image-repeat"
          >Arka Plan Resmi Tekrarla</label>
          <div class="col-md-6">
            <select class="form-select" id="bg-image-repeat" on:change={e => themeSettings.bgImageRepeat = e.target.value}
                    value={themeSettings.bgImageRepeat || 'no-repeat'}>
              <option value="repeat">Döşe</option>
              <option value="no-repeat">Tek Görsel</option>
              <option value="repeat-x">Yatay Döşe</option>
              <option value="repeat-y">Dikey Döşe</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="background-image-position"
          >Arka Plan Resmi Boyutu</label>
          <div class="col-md-6">
            <select class="form-select" id="background-image-position" on:change={e => themeSettings.bgImageSize = e.target.value}
                    value={themeSettings.bgImageSize || 'auto'}>
              <option value="auto">Orijinal Boyut</option>
              <option value="cover">Doldur</option>
              <option value="contain">Sığdır</option>
              <option value="100% 100%">Genişlet</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Logo -->
      <div class="tab-pane fade" id="logo" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="logo-visibility">Görünürlük</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input
                checked={typeof themeSettings.logoVisibility === 'undefined' ? true : themeSettings.logoVisibility }
                class="form-check-input" id="logo-visibility"
                on:change={e => themeSettings.logoVisibility = e.target.checked}
                type="checkbox" />
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="logoPosition">Pozisyon</label>
          <div class="col-md-6">
            <select class="form-select" id="logoPosition" on:change={e => themeSettings.logoPosition = e.target.value}
                    value={themeSettings.logoPosition || 'CENTER'}>
              <option value="TOP_START">Üst Sol</option>
              <option value="TOP">Üst Orta</option>
              <option value="TOP_END">Üst Sağ</option>
              <option value="CENTER_START">Orta Sol</option>
              <option value="CENTER">Orta</option>
              <option value="CENTER_END">Orta Sağ</option>
              <option value="BOTTOM_START">Alt Sol</option>
              <option value="BOTTOM">Alt Orta</option>
              <option value="BOTTOM_END">Alt Sağ</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="logo-height"
            >Yükseklik (px)</label>
          <div class="col-md-6">
            <input
              id="logo-height"
              class="form-control"
              type="number"
              on:input={e => themeSettings.logoHeight = e.target.value}
              placeholder="auto"
              value="{themeSettings.logoHeight}" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="logo-width">Genişlik (px)</label>
          <div class="col-md-6">
            <input
              id="logo-width"
              class="form-control"
              type="number"
              on:input={e => themeSettings.logoWidth = e.target.value}
              placeholder="auto"
              value="{themeSettings.logoWidth}" />
          </div>
        </div>
      </div>

      <!-- Header -->
      <div class="tab-pane fade" id="header" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="logo-visibility">Varsayılan Arkaplan Resmi</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input
                checked={defaultHeaderBg}
                class="form-check-input" id="logo-visibility"
                on:change={e => themeSettings.defaultHeaderBg = e.target.checked}
                type="checkbox" />
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerBackgroundImage">Arka Plan Resmi</label>
          <div class="col-md-6">
            {#if themeSettings.files?.headerBackgroundImage || defaultHeaderBg}
              <div class="input-group">
                <div style="height: 40px; width: 150px;">
                  <img
                    alt="Arka Plan Resmi"
                    class="border rounded-start"
                    style="height: 100%; width: 100%; object-fit: cover;"
                    src={defaultHeaderBg ? '/assets/img/default-header-bg.png' : '/api/theme/file/' + themeSettings.files.headerBackgroundImage}
                  />
                </div>

                <input id="headerBackgroundImage" class="form-control" type="file" accept="image/*"
                       bind:files={headerBackgroundImageFiles}
                       on:change={onHeaderBackgroundImageChange}
                       disabled={defaultHeaderBg} />

                <button
                  class="btn btn-outline-danger shadow-none rounded-end"
                  on:click={onRemoveHeaderBackgroundImageClick}
                  class:disabled={defaultHeaderBg}
                >{$_("buttons.remove")}</button>
              </div>
            {:else}
              <input id="headerBackgroundImage" class="form-control" type="file" accept="image/*"
                     bind:files={headerBackgroundImageFiles}
                     on:change={onHeaderBackgroundImageChange} />
            {/if}
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerBgImagePosition"
          >Arka Plan Resmi Yerleşimi</label>
          <div class="col-md-6">
            <select class="form-select" id="headerBgImagePosition"
                    on:change={e => themeSettings.headerBgImagePosition = e.target.value}
                    value={themeSettings.headerBgImagePosition || 'center center'}>
              <option value="left top">Sol Üst</option>
              <option value="center center">Ortala</option>
              <option value="right bottom">Sağ Alt</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerBgImageRepeat"
          >Arka Plan Resmi Tekrarla</label>
          <div class="col-md-6">
            <select class="form-select" id="headerBgImageRepeat"
                    on:change={e => themeSettings.headerBgImageRepeat = e.target.value}
                    value={themeSettings.headerBgImageRepeat || 'no-repeat'}>
              <option value="repeat">Döşe</option>
              <option value="no-repeat">Tek Görsel</option>
              <option value="repeat-x">Yatay Döşe</option>
              <option value="repeat-y">Dikey Döşe</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerBgImageSize"
          >Arka Plan Resmi Boyutu</label>
          <div class="col-md-6">
            <select class="form-select" id="headerBgImageSize"
                    on:change={e => themeSettings.headerBgImageSize = e.target.value}
                    value={themeSettings.headerBgImageSize || 'auto'}>
              <option value="auto">Orijinal Boyut</option>
              <option value="cover">Doldur</option>
              <option value="contain">Sığdır</option>
              <option value="100% 100%">Genişlet</option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerBgColor">Arka Plan Rengi</label>
          <div class="col-md-6">
            <input
              id="headerBgColor"
              class="form-control form-control-color"
              type="color"
              on:input={e => themeSettings.headerBgColor = e.target.value}
              value="{themeSettings.headerBgColor || '#ffffff'}" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerHeight">Yükseklik (px)</label>
          <div class="col-md-6">
            <input
              class="form-control"
              id="headerHeight"
              on:input={e => themeSettings.headerHeight = e.target.value}
              placeholder="auto"
              type="number"
              value="{themeSettings.headerHeight}" />
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerWidthOption">Genişlik</label>
          <div class="col-md-6">
            <select class="form-select" id="headerWidthOption" on:change={e => themeSettings.headerWidthOption = e.target.value}
                    value={themeSettings.headerWidthOption || 'BY_CONTENT'}>
              <option value="BY_CONTENT">İçeriğe Göre</option>
              <option value="FULL_SIZE">Tam Genişlik</option>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="headerNavBarGap">Navigason Menü Aralığı</label>
          <div class="col-md-6">
            <input class="form-range" id="headerNavBarGap" max="5" min="0" on:input={e => themeSettings.headerNavBarGap = e.target.value}
                   type="range"
                   value={themeSettings.headerNavBarGap || '3'}>
            <output aria-hidden="true" for="headerNavBarGap">{themeSettings.headerNavBarGap || '3'}</output>
          </div>
        </div>
      </div>

      <!-- Navbar -->
      <div class="tab-pane fade" id="navbar" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="navbarWidthOption">Genişlik</label>
          <div class="col-md-6">
            <select class="form-select" id="navbarWidthOption" on:change={e => themeSettings.navbarWidthOption = e.target.value}
                    value={themeSettings.navbarWidthOption || 'BY_CONTENT'}>
              <option value="BY_CONTENT">İçeriğe Göre</option>
              <option value="FULL_SIZE">Tam Genişlik</option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="navRoundEnabled">Kenar Yuvarlaması</label>
          <div class="col-md-6">
            <input class="form-range" id="headerNavBarGap" max="5" min="0" on:input={e => themeSettings.navRoundLevel = e.target.value}
                   type="range"
                   value={themeSettings.navRoundLevel || 5}>
            <output aria-hidden="true" for="headerNavBarGap">{themeSettings.navRoundLevel || '5'}</output>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6" for="logo-visibility">Linklerin Görünürlüğü</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.navLinksEnabled === 'undefined' ? true : themeSettings.navLinksEnabled} class="form-check-input" id="logo-visibility"
                     on:change={e => themeSettings.navLinksEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="navbarLinks">Bağlantılar</label>
          <div class="col-md-6" id="navbarLinks">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.navLinksEnableStatus?.home === 'undefined' ? true : themeSettings.navLinksEnableStatus?.home} class="form-check-input" id="navbarHomeLinkToggle"
                     on:change={e => {if (!themeSettings.navLinksEnableStatus) themeSettings.navLinksEnableStatus = {}; themeSettings.navLinksEnableStatus.home = e.target.checked}}
                     type="checkbox" />
              <label class="form-check-label" for="navbarHomeLinkToggle"> Ana Sayfa </label>
            </div>
            <div class="form-check form-switch">
              <input
                checked={typeof themeSettings.navLinksEnableStatus?.support === 'undefined' ? true : themeSettings.navLinksEnableStatus?.support}
                class="form-check-input"
                id="navbarSupportLinkToggle"
                on:change={e => {if (!themeSettings.navLinksEnableStatus) themeSettings.navLinksEnableStatus = {}; themeSettings.navLinksEnableStatus.support = e.target.checked}}
                type="checkbox" />
              <label class="form-check-label" for="navbarSupportLinkToggle">Destek</label>
            </div>
            <div class="form-check form-switch">
              <input
                checked={typeof themeSettings.navLinksEnableStatus?.rules === 'undefined' ? true : themeSettings.navLinksEnableStatus?.rules}
                class="form-check-input"
                id="navbarRulesLinkToggle"
                on:change={e => {if (!themeSettings.navLinksEnableStatus) themeSettings.navLinksEnableStatus = {}; themeSettings.navLinksEnableStatus.rules = e.target.checked}}
                type="checkbox" />
              <label class="form-check-label" for="navbarRulesLinkToggle">Kurallar</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="tab-pane fade" id="sidebar" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="sidebarVisibility">Görünürlük</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.sidebarEnabled === 'undefined' ? true : themeSettings.sidebarEnabled} class="form-check-input" id="sidebarVisibility"
                     on:change={e => themeSettings.sidebarEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="sidebarPosition">Konum</label>
          <div class="col-md-6">
            <select class="form-select" id="sidebarPosition" on:change={e => themeSettings.sidebarPosition = e.target.value}
                    value={themeSettings.sidebarPosition || 'RIGHT'}>
              <option value="LEFT">Sol</option>
              <option value="RIGHT">Sağ</option>
            </select>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="lastRegistrantsCartVisibility">Son Kayıt Olanlar Kartı</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.sidebarCarts?.lastRegistrants === 'undefined' ? true : themeSettings.sidebarCarts?.lastRegistrants} class="form-check-input" id="lastRegistrantsCartVisibility"
                     on:change={e => {if (!themeSettings.sidebarCarts) themeSettings.sidebarCarts = {}; themeSettings.sidebarCarts.lastRegistrants = e.target.checked}}
                     type="checkbox" />
            </div>
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-md-6" for="onlineAdminsCartVisibility"
          >Çevrimiçi Yöneticiler Kartı (Destek)</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.sidebarCarts?.onlineAdmins === 'undefined' ? true : themeSettings.sidebarCarts?.onlineAdmins} class="form-check-input" id="onlineAdminsCartVisibility"
                     on:change={e => {if (!themeSettings.sidebarCarts) themeSettings.sidebarCarts = {}; themeSettings.sidebarCarts.onlineAdmins = e.target.checked}}
                     type="checkbox" />
            </div>
          </div>
        </div>
      </div>

      <!-- Post Card -->
      <div class="tab-pane fade" id="post-card" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="postsEnabled">Görünürlük</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postsEnabled === 'undefined' ? true : themeSettings.postsEnabled} class="form-check-input" id="postsEnabled"
                     on:change={e => themeSettings.postsEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postCoverImageEnabled">Kapak Resmi</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postCoverImageEnabled === 'undefined' ? true : themeSettings.postCoverImageEnabled} class="form-check-input" id="postCoverImageEnabled"
                     on:change={e => themeSettings.postCoverImageEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postReadMoreButtonEnabled">Devamını Oku Butonu</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postReadMoreButtonEnabled === 'undefined' ? true : themeSettings.postReadMoreButtonEnabled} class="form-check-input" id="postReadMoreButtonEnabled"
                     on:change={e => themeSettings.postReadMoreButtonEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postAuthorImageEnabled">Yazar Kafa Resmi</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postAuthorImageEnabled === 'undefined' ? true : themeSettings.postAuthorImageEnabled} class="form-check-input" id="postAuthorImageEnabled"
                     on:change={e => themeSettings.postAuthorImageEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postViewCountEnabled">Görüntülenme</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postViewCountEnabled === 'undefined' ? true : themeSettings.postViewCountEnabled} class="form-check-input" id="postViewCountEnabled"
                     on:change={e => themeSettings.postViewCountEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postPreviousPageEnabled">Önceki Yazı Butonu</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postPreviousPageEnabled === 'undefined' ? true : themeSettings.postPreviousPageEnabled} class="form-check-input" id="postPreviousPageEnabled"
                     on:change={e => themeSettings.postPreviousPageEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6" for="postNextPageEnabled">Sonraki Yazı Butonu</label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.postNextPageEnabled === 'undefined' ? true : themeSettings.postNextPageEnabled} class="form-check-input" id="postNextPageEnabled"
                     on:change={e => themeSettings.postNextPageEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="tab-pane fade" id="footer" role="tabpanel">
        <div class="row mb-3">
          <label class="col-md-6" for="footerEnabled"> Alt Bilgi </label>
          <div class="col-md-6">
            <div class="form-check form-switch">
              <input checked={typeof themeSettings.footerEnabled === 'undefined' ? true : themeSettings.footerEnabled} class="form-check-input" id="footerEnabled"
                     on:change={e => themeSettings.footerEnabled = e.target.checked}
                     type="checkbox" />
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <label class="col-md-6 col-form-label" for="footerContent"> İçerik </label>
          <div class="col-md-6">
            <textarea class="form-control" id="footerContent" on:input="{e => themeSettings.footerContent = e.target.value}"
                      style="height: 200px;"
                      value="{themeSettings.footerContent}"></textarea>
          </div>
        </div>
      </div>

      <!-- Advanced -->
      <div class="tab-pane fade" id="advanced" role="tabpanel">
        <div class="row">
          <label class="col col-form-label" for="customCss">Custom CSS</label>
          <div class="col-6">
            <textarea class="form-control" id="customCss" on:input="{e => themeSettings.customCss = e.target.value}" style="height: 200px;"
                      value="{themeSettings.customCss}"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-3 d-flex gap-2">
      <button class="btn btn-secondary" class:disabled={saving || savingEnabled} on:click={save}>Kaydet <i
        class="fas fa-spinner fa-spin" hidden="{!saving}"></i></button>
      <button class="btn btn-dark" class:disabled={resetting || saving} hidden="{!resetVisible}" on:click={reset}>Reset
        All
        <i class="fas fa-spinner fa-spin" hidden="{!resetting}"></i></button>
    </div>
  </div>
</div>

<script context="module">
  import { writable } from "svelte/store";

  /**
   * @type {import("@sveltejs/kit").Load}
   */
  export async function load(event) {
    const { parent } = event;

    const { themeSettings } = await parent();
    const originalThemeSettings = writable(structuredClone(themeSettings));

    return { themeSettings, originalThemeSettings };
  }
</script>

<script>
  import { _ } from "svelte-i18n";
  import { saveThemeSettings } from "$lib/services/theme-setting";

  export let data;

  let { themeSettings, originalThemeSettings } = data;

  let saving, resetting;
  let backgroundImageFiles, headerBackgroundImageFiles = null;

  $: savingEnabled = JSON.stringify($originalThemeSettings) === JSON.stringify(themeSettings);
  $: resetVisible = Object.keys($originalThemeSettings).length > 0;
  $: defaultHeaderBg = typeof themeSettings.defaultHeaderBg === "undefined" ? true : themeSettings.defaultHeaderBg;

  function onBackgroundImageChange(event) {
    // const reader = new FileReader();
    const image = event.target.files[0];

    themeSettings.uploads = { ...(themeSettings.uploads || {}), backgroundImage: image };


    // reader.readAsDataURL(image);
    //
    // reader.onload = (e) => {
    //   favicon = e.target.result;
    // };
    //
    // selectedFaviconFiles = faviconFiles;
  }

  function onRemoveBackgroundImageClick() {
    delete themeSettings.files.backgroundImage;

    themeSettings = themeSettings;
  }

  function onRemoveHeaderBackgroundImageClick() {
    delete themeSettings.files.headerBackgroundImage;

    themeSettings = themeSettings;
  }

  function onHeaderBackgroundImageChange(event) {
    // const reader = new FileReader();
    const image = event.target.files[0];

    themeSettings.uploads = { ...(themeSettings.uploads || {}), headerBackgroundImage: image };


    // reader.readAsDataURL(image);
    //
    // reader.onload = (e) => {
    //   favicon = e.target.result;
    // };
    //
    // selectedFaviconFiles = faviconFiles;
  }

  export async function save() {
    saving = true;

    const response = await saveThemeSettings(themeSettings);
    const newSettings = JSON.parse(await response.text());
    delete newSettings["result"];

    backgroundImageFiles = null;
    headerBackgroundImageFiles = null;

    themeSettings = newSettings;
    originalThemeSettings.set(structuredClone(themeSettings));

    saving = false;
  }

  export async function reset() {
    resetting = true;

    await saveThemeSettings({});

    backgroundImageFiles = null;
    headerBackgroundImageFiles = null;

    themeSettings = {};
    originalThemeSettings.set(structuredClone({}));

    resetting = false;
  }
</script>
