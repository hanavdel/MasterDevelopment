# CMS Editor SimÃ¼lasyonu

| Alan | DeÄŸer |
|------|--------|
| Yol | `C:\web\CMS` |
| Tip | Statik SPA â€” CMS web editÃ¶r simÃ¼lasyonu |
| Durum | Aktif geliÅŸtirme (UI simÃ¼lasyon) |
| Koordinasyon | MD-004 (Homepage domain) + MD-007 (CPC) + **MD-010** + **MD-011** Read API + **MD-015** kiÅŸiselleÅŸtirme + **MD-016** EPIM sÄ±nÄ±r |

## AmaÃ§

Ãœretim LCW CMS (`cms.lcwaikiki.com`) ekranlarÄ±nÄ± BannerPlanner shell yaklaÅŸÄ±mÄ±yla simÃ¼le etmek. Domain: **Homepage â†’ Template â†’ Component** (Layout = Ã¶nizleme only, CPC dÄ±ÅŸÄ±).

## Teknoloji

- Vanilla JS, Bootstrap Icons, localStorage (`cms_editor_v1`)
- Seed JSON: `data/config/`, `data/catalog/`
- HTTP server gerekli (fetch)

## ModÃ¼ller

| MenÃ¼ | View | Dosya |
|------|------|-------|
| Layout EditÃ¶r | `editor` | `js/app.js` |
| Opus preview | Layout editÃ¶r | `js/opus-preview.js`, `../shared/opus-client/` |
| Template(new) | `template-new` / `template-edit` | `js/template-v5.js` |
| Component(new) | `component-new` / `component-edit` | `js/component-v5.js` |
| Homepage | `homepage` / `homepage-edit` | `js/homepage.js`, `js/cms-context.js` |
| ÃœrÃ¼n KiÅŸiselleÅŸtirme | `personalization*` | `js/personalization.js`, catalog, player |
| Content Read API | HTTP `:3458` | `CMS_READ_API.md` â€” menÃ¼, page bundle, personalization |

## Entegrasyon hatlarÄ±

| Hedef | Rehber | Durum |
|-------|--------|-------|
| BannerPlanner model hizasÄ± | [`CONTENT_PUBLISH_CONTRACT.md`](../CONTENT_PUBLISH_CONTRACT.md) | MD-007 publish sÃ¶zleÅŸmesi |
| Homepage domain | [`CMS_HOME_LAYOUT_UNIFICATION.md`](../CMS_HOME_LAYOUT_UNIFICATION.md) | MD-004 revize |
| MBA Ã¼lke/dil katalog | `MasterBusiness/Data/exports/pulse-ecommerce-countries.json` | KÄ±smen (catalog.js) |
| LCW vitrin | [`CMS_READ_API.md`](../CMS_READ_API.md) Â· MD-011 / MD-015 | MenÃ¼ + page + perso API |
| Opus SDK preview | `shared/opus-client` | **Aktif** â€” Layout editÃ¶r, MD-006 |
| EPIM kategori | [`EPIM_CMS_BOUNDARY.md`](../EPIM_CMS_BOUNDARY.md) | MD-016 â€” taksonomi EPIM, menÃ¼ CMS |

## Bilinen teknik borÃ§

- `itemKey` CPC publish validasyonu (MD-007)
- Sidebar hide grid CSS (shell)
- CRUD Ã§oÄŸunlukla simÃ¼lasyon (persist kÄ±sÄ±tlÄ±)

## Agent gÃ¼nlÃ¼ÄŸÃ¼

[`CMS/AGENT_SYNC.md`](../../CMS/AGENT_SYNC.md)
