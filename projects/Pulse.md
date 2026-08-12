# Proje KartÄ±: Pulse â€” Web Site Health Check

| Alan | DeÄŸer |
|------|--------|
| Yol | `C:\web\Pulse` |
| Tip | Statik UI (IIS) + Node.js crawler API |
| Rol | LCW Ã§oklu domain web site saÄŸlÄ±k izleme ve periyodik crawler |
| Birincil kullanÄ±cÄ± | E-Ticaret IT / Storefront |
| **Agent gÃ¼nlÃ¼ÄŸÃ¼** | [`Pulse/AGENT_SYNC.md`](../../Pulse/AGENT_SYNC.md) |

## Dosyalar

- `index.html` â€” admin kabuk (BannerPlanner referans)
- `js/crawler-ui.js` â€” tarama, progress, geÃ§miÅŸ
- `js/api-client.js` â€” API istemcisi
- `server/crawler.js` â€” sÄ±ralÄ± site taramasÄ±, cheerio kontrolleri
- `data/checks/check-points.json` â€” HTTP status, element, performance kontrolleri

## Ä°liÅŸkili projeler

| Proje | Ä°liÅŸki |
|-------|--------|
| **BannerPlanner** | Admin shell / tema referansÄ± |
| **MasterBusiness** | MBA e-ticaret Ã¼lke envanteri (`pulse-ecommerce-countries.json`) |
| **Opus** | Gelecek: site event / alert entegrasyonu (MD-006) |

## Ortam

| Ortam | Port | Durum |
|-------|------|--------|
| IIS UI | **3290** | Aktif |
| Node crawler API | **3291** | `server/start-api.cmd` ile manuel baÅŸlatma |

## Koordinasyon tetikleyicileri

- Yeni kontrol noktasÄ± tipi veya crawler davranÄ±ÅŸÄ± â†’ `AGENT_SYNC.md`
- MBA Ã¼lke listesi deÄŸiÅŸimi â†’ `MasterBusiness` export + `data-store.js`
- Opus alert entegrasyonu â†’ `INTEGRATION_MAP.md` + MD-006

## Son tarama notu

2026-06-03 â€” Proje envantere ve dashboard registry'ye eklendi; AGENT_SYNC gÃ¼nlÃ¼ÄŸÃ¼ aÃ§Ä±ldÄ±.
