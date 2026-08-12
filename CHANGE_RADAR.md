# Change Radar â€” Ä°zleme Listesi

Agent her taramada bu yollarÄ± kontrol eder. DeÄŸiÅŸiklik gÃ¶rÃ¼lÃ¼rse `SCAN_LOG.md` + gerekirse `WORK_QUEUE.md` gÃ¼ncellenir.

**HariÃ§ tutma:** `C:\web` altÄ±nda adÄ±nda `Copy` geÃ§en klasÃ¶rler (yedek) taranmaz.

## Opus (`C:\web\Opus`)

| Yol | Etki |
|-----|------|
| `packages/sdk/src/**` | **P0** â€” LCW ve tÃ¼m web entegrasyonlarÄ± |
| `packages/sdk/dist/**` | Build Ã§Ä±ktÄ±sÄ±; deploy Ã¶ncesi LCW test |
| `apps/api/src/**` | API sÃ¶zleÅŸmesi, event/campaign endpoint |
| `apps/admin/public/**` | Operasyon paneli; kampanya tanÄ±mlarÄ± |
| `data/tables/*.json` | Seed / demo veri; LCW test senaryolarÄ± |
| `apps/api/.env` | Site key, port, CORS |
| `sql/**` | Åžema deÄŸiÅŸikliÄŸi â†’ uzun vadeli uyum |

## BannerPlanner (`C:\web\BannerPlanner`)

| Yol | Etki |
|-----|------|
| **`AGENT_SYNC.md`** | **Agent gÃ¼nlÃ¼ÄŸÃ¼ â€” entegrasyon deÄŸiÅŸiklik bildirimi** |
| `docs/LCW_EXPORT.md` | LCW export sÃ¶zleÅŸmesi |
| `data/planning/*.json` | Banner/slot seed â†’ LCW vitrin |
| `js/app.js` | `exportData()`, planlama UI |
| `js/data-store.js` | content-slots yÃ¼kleme |
| `docs/domain-model.md` | Model deÄŸiÅŸikliÄŸi |

## LCW Mockup (`C:\web\lcw`)

| Yol | Etki |
|-----|------|
| **`AGENT_SYNC.md`** | **Agent gÃ¼nlÃ¼ÄŸÃ¼** |
| `docs/BANNER_FEED.md` | BannerPlanner tÃ¼ketim sÃ¶zleÅŸmesi |
| `data/banner-export.json` | *(planlÄ±)* import dosyasÄ± |
| `js/common.js` | Sepet, header, Opus event kancalarÄ± |
| `js/main.js`, `js/category.js` | Hero / kategori â€” BannerPlanner feed hedefi |
| `js/opus-integration.js` | Opus SDK |
| `*.html` | SDK script, vitrin alanlarÄ± |
| `css/style.css` | Popup/z-index Ã§akÄ±ÅŸmalarÄ± |

## CMS Editor (`C:\web\CMS`)

| Yol | Etki |
|-----|------|
| **`AGENT_SYNC.md`** | **Agent gÃ¼nlÃ¼ÄŸÃ¼ â€” Homepage â†’ Layout sinyali** |
| `docs/domain-model.md` | Layout / Template / Component hiyerarÅŸisi |
| `data/config/layouts.json` | Layout seed â€” birleÅŸim hedefi |
| `data/config/homepage-records.json` | GeÃ§ici Homepage entity (MD-004) |
| `js/homepage.js` | Home Page List/Edit UI |
| `js/app.js` | Layout editÃ¶r |

## EPIM (`C:\web\EPIM`)

| Yol | Etki |
|-----|------|
| **`AGENT_SYNC.md`** | **Agent gÃ¼nlÃ¼ÄŸÃ¼ â€” bootstrap / port talebi** |
| `js/product-pool.js` | ÃœrÃ¼n Havuzu simÃ¼lasyonu |
| `js/menu.js` | Admin menÃ¼ tanÄ±mÄ± |
| `data/catalog/filter-options.json` | Filtre seed |

## Pulse (`C:\web\Pulse`)

| Yol | Etki |
|-----|------|
| **`AGENT_SYNC.md`** | **Agent gÃ¼nlÃ¼ÄŸÃ¼ â€” crawler / site envanteri deÄŸiÅŸiklikleri** |
| `server/crawler.js` | Tarama motoru, kontrol noktasÄ± Ã§alÄ±ÅŸtÄ±rma |
| `server/index.js` | REST API, health, runs |
| `js/crawler-ui.js` | Tarama UI, progress, polling |
| `js/api-client.js` | API baÄŸlantÄ±sÄ± (3290 â†” 3291 mixed content) |
| `data/checks/check-points.json` | Kontrol tanÄ±mlarÄ± |
| `data/runtime/*.json` | Tarama sonuÃ§larÄ±, site durumu |

## Projector (`C:\web\Projector`)

| Yol | Etki |
|-----|------|
| `js/app.js` | Ana uygulama mantÄ±ÄŸÄ± |
| `js/jira-module.js` | Jira entegrasyonu |
| `data/*.json` | OKR / talep verisi |
| `scripts/*.mjs` | `extract-data`, `patch-app` â€” LCW veri senkronu olasÄ±lÄ±ÄŸÄ± |
| `server.js` | API davranÄ±ÅŸÄ± |

## MasterBusiness (iÅŸ kÃ¶prÃ¼sÃ¼)

| Yol | Etki |
|-----|------|
| `../MasterBusiness/Data/exports/**` | Yeni handoff â†’ MD/AGENT_SYNC gÃ¼ncelle |
| `../MasterBusiness/PRIORITIZATION_MATRIX.md` | Teknik Ã¶ncelik Ã§akÄ±ÅŸmasÄ± |
| `../MasterBusiness/WORK_QUEUE.md` | MB-xxx â†” MD-xxx eÅŸlemesi |

## MasterDevelopment (meta)

| Yol | Etki |
|-----|------|
| `WORK_QUEUE.md` | Aktif koordinasyon iÅŸleri |
| `SCAN_LOG.md` | Tarama geÃ§miÅŸi |

## HÄ±zlÄ± Tarama Komutu (PowerShell)

```powershell
$roots = @(
  'C:\web\Opus\packages\sdk\src',
  'C:\web\Opus\apps\api\src',
  'C:\web\lcw\js',
  'C:\web\BannerPlanner\js',
  'C:\web\BannerPlanner\data\planning',
  'C:\web\CMS\js',
  'C:\web\CMS\data\config',
  'C:\web\shared\opus-client',
  'C:\web\Opus\AGENT_SYNC.md',
  'C:\web\Projector\js'
)
# Agent gÃ¼nlÃ¼kleri
Get-Content 'C:\web\BannerPlanner\AGENT_SYNC.md','C:\web\lcw\AGENT_SYNC.md','C:\web\CMS\AGENT_SYNC.md' -ErrorAction SilentlyContinue |
  Select-String 'agent-sync:log' -Context 0,15
foreach ($r in $roots) {
  if (Test-Path $r) {
    Get-ChildItem $r -Recurse -File |
      Sort-Object LastWriteTime -Descending |
      Select-Object -First 3 FullName, LastWriteTime
  }
}
```
