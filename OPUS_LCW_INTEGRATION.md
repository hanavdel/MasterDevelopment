# Opus → LCW Mockup Entegrasyon Rehberi

**İş kodu:** MD-001 (P0)  
**Durum:** LCW kod entegrasyonu yapıldı (2026-05-27); tarayıcı testi T1–T6 bekliyor

## Amaç

Opus'ta geliştirilen pazarlama özelliklerini (event, kampanya, anket, push) gerçeğe yakın bir e-ticaret vitrininde doğrulamak.

## Önkoşullar

| Bileşen | Konum | Port / not |
|---------|--------|------------|
| Opus API | `C:\web\Opus\apps\api` | Varsayılan **3102** (`config.js`); README'de 3100 yazıyor — entegrasyonda `data-api` ile netleştirin |
| Opus Admin | `C:\web\Opus\apps\admin` | 3101 |
| LCW mockup | `C:\web\lcw` | Statik; `python -m http.server 8080` önerilir |
| Site key | API `.env` / seed | SDK `data-site-key` ile eşleşmeli |

## Adım 1 — Opus API ve SDK erişimi

```powershell
cd C:\web\Opus
npm run dev:api
# Ayrı terminal:
npm run dev:admin
```

Sağlık: `http://127.0.0.1:3102/api/health`  
SDK: `http://127.0.0.1:3102/sdk/opus.js` (API static serve)

## Adım 2 — LCW sayfalarına SDK ekleme (uygulandı)

Tüm HTML sayfalarında `js/opus-config.js` + `js/opus-integration.js` yüklenir. Yapılandırma: `lcw/js/opus-config.js`.

**Not:** LCW `file://` ile açılırsa CORS/fetch sorunları çıkar; mutlaka HTTP sunucusu kullanın.

## Adım 3 — Event kancaları (LCW `js/common.js`)

| Kullanıcı aksiyonu | LCW fonksiyonu | Önerilen Opus event |
|--------------------|----------------|---------------------|
| Sayfa yükleme | `initCommon` sonu | `page_view` |
| Sepete ekleme | `addToCart(id)` | `add_to_cart` + `product_id` |
| Sepetten çıkarma | `removeFromCart(id)` | `remove_from_cart` |
| Kategori tıklama | nav link click | `category_click` |
| Çerez kabul | Opus consent şeridi (`ensureDecided`) | `consent_granted` / `cookie_consent_updated` |
| Çerez tercihleri (footer) | `Opus.showConsentBanner()` | Şerit yeniden açılır — **MD-012** |

**Consent (MD-012 — zorunlu):** Site özel çerez banner’ı kullanılmaz. İlk ziyaret Opus şeridi; footer “Çerez Tercihleri” → `Opus.showConsentBanner()`. Detay: [`COOKIE_CONSENT_COMPLIANCE.md`](COOKIE_CONSENT_COMPLIANCE.md).

Örnek footer kancası (LCW Next.js):

```javascript
import { showOpusConsentBanner } from '@/lib/opus';
<a href="#" onClick={showOpusConsentBanner}>Çerez Tercihleri</a>
```

Örnek kanca (`addToCart` içinde, `saveCart()` sonrası):

```javascript
if (window.opus && typeof window.opus.track === 'function') {
  const p = getProductById(id);
  window.opus.track('add_to_cart', { product_id: id, name: p?.name, price: p?.price });
}
```

Global erişim için `opusReady` içinde `window.opus = opus` atanabilir.

## Adım 4 — Kampanya / anket / push doğrulama

Admin panelden oluşturulan kampanya ve anketlerin LCW'de görünmesi için:

1. Admin'de entity oluştur / seed çalıştır (`npm run seed:entities`)
2. SDK bootstrap + decisions API yanıtını tarayıcıda kontrol et (`pageType`, `country`, `platform` query)
3. Popup/survey UI'nin mockup üzerinde engellenmediğini doğrula (z-index, çerez banner çakışması)

**Anket (2026-05-27):** API `surveyDecisions.js` admin kurallarını uygular (status, schedule, countries, platform, `targeting.rules`, `display_rules.behavior`). SDK `opus-survey.js` çok sayfalı akış (scale, multi, text, thankyou, branching). LCW `opus-page-context.js` sayfa tipini Admin `pageType` ile eşler (`Checkout` → `checkout.html`).

## Test Matrisi (MD-001 kapanışı)

| # | Senaryo | Sayfa | Beklenen |
|---|---------|-------|----------|
| T1 | SDK yüklenir | `index.html` | Konsolda hata yok, `opus_anon` localStorage |
| T2 | `page_view` | Tüm sayfalar | API `/api/v1/events` veya SDK pipeline kaydı |
| T3 | `add_to_cart` | Kategori + ana sayfa | Event payload doğru |
| T4 | Kampanya popup | Ana sayfa | Admin'deki aktif kampanya görünür |
| T5 | Anket (admin kuralları) | `checkout.html` (Checkout) | Modal açılır, çok sayfa + branching, `survey_responses` kaydı |
| T6 | Web push (opsiyonel) | HTTPS veya localhost | İzin + subscription kaydı |
| T7 | Consent yeniden açma (MD-012) | Footer, giriş yok | `showConsentBanner()` → Opus şeridi; modal inline değil |

Sonuçlar `SCAN_LOG.md` içine T1–T6 satır olarak işlenir.

## Web Push (push_subscriptions)

| Gereksinim | Açıklama |
|------------|----------|
| Opus API | `npm run dev:api` (3102), VAPID anahtarları |
| LCW sunucusu | `node server.js` veya `:3000` — **`/opus-sw.js` aynı origin'de** |
| `opus_guid` | `localStorage.opus_anon` ile aynı (API `resolveOrCreateProfile`) |

Çerez banner’da “Tüm çerezlere izin ver” → `lcwEnablePush()` tetiklenir. Konsolda `POST .../api/v1/push/subscribe` 201 dönmeli.

## Bilinen Riskler

- **Port tutarsızlığı:** README 3100, `config.js` 3102 — entegrasyon script'inde tek port kullanın.
- **CORS:** LCW farklı portta (8080) ise API `corsOrigin` ayarı kontrol edilmeli.
- **file://:** SDK çalışmaz; local sunucu şart.
- **Push SW:** SW yalnızca site origin’inde kayıt olur (`localhost:3000/opus-sw.js`); API origin’ine (`3102`) kayıt push aboneliğini oluşturmaz.
- **Çerez banner vs Opus popup:** CSS `z-index` çakışması test edilmeli. Site özel banner olmamalı (MD-012).

## İlgili Dosyalar

- Opus SDK: `Opus/packages/sdk/src/opus.js`
- Opus API: `Opus/apps/api/src/server.js`
- LCW ortak JS: `lcw/js/common.js`, `lcw/js/main.js`, `lcw/js/category.js`
