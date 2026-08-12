# Proje Kartı: EPIM Admin Simülasyonu

| Alan | Değer |
|------|--------|
| Yol | `C:\web\EPIM` |
| Tip | Statik frontend (Bootstrap 5) |
| Rol | E-ticaret ürün bilgisi yönetimi (EPIM) admin arayüz simülasyonu |
| Birincil kullanıcı | Content ekibi |
| Geliştiren takım | E-Ticaret IT — EPIM |
| **Agent günlüğü** | [`EPIM/AGENT_SYNC.md`](../../EPIM/AGENT_SYNC.md) |

## Dosyalar

- `index.html` — admin kabuk
- `js/product-pool.js` — Ürün Havuzu ekranı
- `js/menu.js` — sol menü
- `data/catalog/filter-options.json` — filtre seed

## İlişkili projeler

| Proje | İlişki |
|-------|--------|
| **CMS Editor** | Kategori ağacı senkronu — [`EPIM_CMS_BOUNDARY.md`](../EPIM_CMS_BOUNDARY.md) (MD-016); perso master hedef MD-015 |
| **BannerPlanner** | Admin kabuk şablonu (UI referans) |

## Ortam

| Ortam | Port | Durum |
|-------|------|--------|
| IIS (önerilen) | **3281** | Master Development onayı bekleniyor — MD-008 |
| python http.server | 3281 | Geliştirme alternatifi |

## Koordinasyon tetikleyicileri

- Yeni EPIM ekranı simülasyonu → `AGENT_SYNC.md`
- Port / IIS site tanımı → `WORK_QUEUE.md` MD-008
- Üretim API mock sözleşmesi → proje kartı + `INTEGRATION_MAP.md`

## Son tarama notu

2026-06-06: Proje bootstrap; Ürün Havuzu referans ekranı hazır.
