# Proje Kartı: BannerPlanner

| Alan | Değer |
|------|--------|
| Yol | `C:\web\BannerPlanner` |
| Tip | Statik frontend (Bootstrap 5, FullCalendar) |
| Rol | LCW banner yönetimi — planlama arayüzü |
| **Agent günlüğü** | [`BannerPlanner/AGENT_SYNC.md`](../../BannerPlanner/AGENT_SYNC.md) |

## Dosyalar

- `index.html` — kabuk ve sayfalar
- `js/app.js` — uygulama mantığı, `exportData()`
- `data/planning/*.json` — seed banner/slot
- `docs/LCW_EXPORT.md` — LCW export sözleşmesi

## İlişkili projeler

| Proje | İlişki |
|-------|--------|
| **LCW mockup** | Vitrin önizleme — **MD-003** (planlı) |
| **Opus** | Kampanya model eşlemesi — **MD-002** |

## Koordinasyon tetikleyicileri

- Export format / planning JSON değişimi → `AGENT_SYNC.md` + `lcw/AGENT_SYNC.md`
- Banner alan değişimi → Opus `campaigns` şeması (MD-002)

## Son tarama notu

2026-06-01: LCW entegrasyon iskeleti; otomatik import henüz yok.
