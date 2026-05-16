# Pano Vanilla Theme

Pano'nun varsayılan teması. Aynı zamanda yeni tema oluştururken **template** olarak kullanılır — bütün license/DRM altyapısı bu klasörde hazır, yeni temayı bunu kopyalayarak başlatırsan otomatik miras alır.

## Geliştirme

```bash
bun install
bun run dev          # vite dev — :3000
bun run build        # production build → build/
```

`bun run dev` sırasında license/DRM altyapısı **devre dışı**, premium check'ler no-op olur. License doğrulaması sadece `bun run build` ile çalışan prebuild adımından sonra devreye girer.

## Bir temayı premium yapmak

İki şey değişir, başka hiçbir şey yapmana gerek yok:

1. `manifest.json` içinde:
   ```diff
   - "premium": false   // ya da bu satır yok
   + "premium": true
   ```

2. CI ortamında `PANO_LICENSE_SERVER` env değişkeninin set olduğundan emin ol (zaten release.yml'da `branch == 'main' ? 'prod' : 'dev'` olarak ayarlanmış, dokunmana gerek yok).

`bun run build` çalıştırıldığında:
- prebuild script (`scripts/license/generate-license-constants.js`) panomc.com'dan **public key**'i çeker, `src/lib/server/license-constants.generated.js`'e gömer
- vite build sonrası fingerprint plugin'i tüm `build/` dosyalarının kümülatif SHA-256'sını hesaplayıp `build/manifest.json`'a `fileFingerprint` olarak yazar
- Pano host bu temayı kurarken/başlatırken aynı hash'i tekrar hesaplar, eşleşmiyorsa reddeder
- Çalışma zamanında tema kendi dosyalarını da bağımsız olarak doğrular

## License server seçimi (PANO_LICENSE_SERVER)

prebuild script şu sırayla seçim yapar:

| Öncelik | Env değişkeni | Davranış |
|---|---|---|
| 1 | `PANO_LICENSE_PUBLIC_KEY` | Public key'i direkt env'den alır (CI secret olarak), sunucuya hiç bağlanmaz |
| 2 | `PANO_LICENSE_SERVER=prod` | `https://api.panomc.com`'dan key fetch eder |
| 2 | `PANO_LICENSE_SERVER=dev` | `https://api-dev.panomc.com`'dan key fetch eder |
| 2 | `PANO_LICENSE_SERVER=http://localhost:8087` | Verilen URL'den key fetch eder (lokal backend testi için) |
| 3 | (hiçbiri set değil) | Git branch'ten otomatik tespit eder: `main`/`master`/`release-*` → prod, `dev`/`develop`/`feat-*`/`fix-*`/`hotfix-*` → dev |
| 4 | (yine yok) | Premium tema build'i **fail eder** (sessizce free build'e düşmez) |

Bonus: `PANO_LICENSE_ISSUER` — JWT `iss` doğrulaması için override (genelde gerekmez, server'dan otomatik türetilir).

## GitHub Actions

Mevcut `.github/workflows/release.yml` zaten her şeyi hallediyor:

```yaml
- name: Build
  env:
    PANO_LICENSE_SERVER: ${{ steps.extract_branch.outputs.branch == 'main' && 'prod' || 'dev' }}
  run: bun run build
```

- `dev` branch'e push → otomatik dev sunucudan key fetch
- `main` branch'e push (veya release) → prod sunucudan key fetch

Free temalarda bu env zararsız (manifest.premium=false olduğu için prebuild script onu görmezden gelir).

### CI'da gizli key ile build almak istersen (offline / restricted runner)

Public key'i bir kez prod'dan alıp GH repository secret'a koy:
```
Settings → Secrets → Actions → New repository secret
  Name:  PANO_LICENSE_PUBLIC_KEY
  Value: <base64 RSA-2048 key, panomc.com'dan>
```

Sonra workflow:
```yaml
- name: Build
  env:
    PANO_LICENSE_PUBLIC_KEY: ${{ secrets.PANO_LICENSE_PUBLIC_KEY }}
  run: bun run build
```

Bu durumda prebuild hiçbir HTTP çağrısı yapmaz, key'i secret'tan okur.

## Lokal'de premium tema build almak

```bash
# Lokal Pano backend'ini :8087'de çalıştırıyorsan
PANO_LICENSE_SERVER=http://localhost:8087 bun run build

# Veya panomc.com'un dev sunucusunu kullanmak istersen
PANO_LICENSE_SERVER=dev bun run build

# Geçici olarak free build (test için)
PANO_LICENSE_REQUIRED=false bun run build
```

## Yeni tema oluşturmak

```bash
cp -r vanilla-theme shadow-theme
cd shadow-theme

# 1. manifest.json düzenle: id, title, version, screenshots
# 2. Premium olacaksa: "premium": true ekle
# 3. (varsa) .github/workflows/release.yml içinde zip ismini güncelle

bun install
bun run dev
```

`scripts/license/` ve `src/lib/server/license-runtime.js` zaten bütün premium altyapıyı kapsıyor; sadece manifest'i değiştirmek yeterli.
