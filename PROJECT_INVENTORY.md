# Project Inventory

`C:\web` kökündeki aktif projeler. Yeni klasör eklendiğinde bu liste ve `projects/` altı kart güncellenir.

## Aktif projeler

| Proje | Yol | Tip | Kart |
|-------|-----|-----|------|
| Opus | `C:\web\Opus` | Node monorepo (API, admin, SDK) | [Opus.md](projects/Opus.md) |
| LCW mockup | `C:\web\lcw` | Statik e-ticaret simülasyonu | [LCW.md](projects/LCW.md) |
| Projector | `C:\web\Projector` | Express + OKR/Jira SPA | [Projector.md](projects/Projector.md) |
| BannerPlanner | `C:\web\BannerPlanner` | Banner planlama UI | [BannerPlanner.md](projects/BannerPlanner.md) |
| CMS Editor | `C:\web\CMS` | CMS web editör simülasyonu | [CMS.md](projects/CMS.md) |
| EPIM | `C:\web\EPIM` | EPIM admin arayüz simülasyonu | [EPIM.md](projects/EPIM.md) |
| Pulse | `C:\web\Pulse` | Web site sağlık crawler (LCW domainler) | [Pulse.md](projects/Pulse.md) |
| Backoffice Sim | `C:\web\Backoffice` | Backoffice admin arayüz simülasyonu | [Backoffice.md](projects/Backoffice.md) |

> **Hariç:** Adında `Copy` geçen klasörler yedektir; envantere alınmaz.

## Rol özeti

### Opus
Pazarlama engagement platformu (segment, event, kampanya, anket, push). Web entegrasyonu: `packages/sdk`.

### LCW mockup
LCW.com benzeri vitrin; Opus özelliklerinin sahaya çıkmadan test edildiği ortam. **Opus SDK henüz bağlı değil.**

### Projector
E-ticaret OKR ve talep yönetimi; `extract-data` / `patch-app` ile veri senkronu.

### BannerPlanner
LCW banner yönetimi arayüzü; Opus campaign modeli ile kavramsal hizalama gerekli (MD-002). Homepage matrisi → `ViewAssignment` (Layout ile hizalı).

### CMS Editor
LCW CMS web editör simülasyonu; Layout / Template / Component hiyerarşisi. Homepage UI geçici — Layout birleştirmesi MD-004.

### EPIM
E-ticaret ürün bilgisi yönetimi admin simülasyonu; Content ekibi odaklı. Ürün Havuzu referans ekranı. IIS port **3281 önerildi** — MD-008 onay bekliyor.

### Pulse
LCW çoklu domain web site sağlık izleme crawler'ı. BannerPlanner admin kabuğu; MBA ülke envanteri; Node API (3291) + IIS UI (3290). Koordinasyon kodu **MD-009**.

## Bağımlılık kategorileri

| Kategori | Hat |
|----------|-----|
| SDK entegrasyonu | Opus SDK → LCW mockup (**P0**) |
| Veri / seed | Opus `data/tables` → LCW test senaryoları |
| UI prototip | BannerPlanner ↔ LCW görsel doğrulama (manuel) |
| CMS model | CMS ↔ BannerPlanner ViewAssignment / Layout hizası (MD-004) |
| Campaign model | BannerPlanner ↔ Opus campaigns |

## Port / ortam notları

| Servis | Dokümante port | Gerçek varsayılan |
|--------|----------------|-------------------|
| Opus API | README: 3100 | `config.js`: **3102** |
| Opus Admin | 3101 | 3101 |
| LCW | 8080 (ör. python http.server) | — |
| BannerPlanner (IIS) | — | **3280** |
| EPIM (IIS, önerilen) | — | **3281** *(MD-008 onay)* |
| Pulse UI | — | **3290** |
| Pulse Crawler API | — | **3291** |
| CMS dev server | — | **3458** |
| Backoffice Sim (IIS / dev) | — | **3479** |
| Master Dev Dashboard | — | **3282** *(IIS + Node; 3020 eski)* |

Entegrasyonda tek port kullanın; `OPUS_LCW_INTEGRATION.md` içinde `data-api` ile sabitleyin.
