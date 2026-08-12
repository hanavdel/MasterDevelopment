# BannerPlanner â†’ LCW Mockup Entegrasyon Rehberi

**Ä°ÅŸ kodu:** MD-003 (P1)  
**Durum:** Planlama â€” otomatik baÄŸ yok; yakÄ±n vadede LCW vitrinde BannerPlanner Ã§Ä±ktÄ±larÄ± gÃ¶rÃ¼lecek

## AmaÃ§

BannerPlannerâ€™da planlanan banner / hero / slot iÃ§eriklerinin LCW mockup sitesinde (`C:\web\lcw`) gÃ¶rsel olarak doÄŸrulanmasÄ± â€” gerÃ§ek CMS Ã¶ncesi â€œvitrin testiâ€.

## Proje baÄŸlantÄ±larÄ±

| Proje | Rol | Agent dosyasÄ± |
|-------|-----|----------------|
| BannerPlanner | Planlama, export | [`BannerPlanner/AGENT_SYNC.md`](../BannerPlanner/AGENT_SYNC.md) |
| LCW mockup | Vitrin, render | [`lcw/AGENT_SYNC.md`](../lcw/AGENT_SYNC.md) |
| Opus | Kampanya/popup (ayrÄ± hat) | [`OPUS_LCW_INTEGRATION.md`](OPUS_LCW_INTEGRATION.md) |

## Hedef veri akÄ±ÅŸÄ± (v1 â€” Ã¶nerilen)

```mermaid
flowchart LR
  BP[BannerPlanner]
  JSON[banner-export.json]
  LCW[LCW mockup]
  BP -->|exportData / data/planning| JSON
  JSON -->|fetch veya build script| LCW
  LCW -->|hero / vitrin DOM| Browser
```

### BannerPlanner tarafÄ± (kaynak)

- Seed: `data/planning/content-slots.json`, `component-plans.json`
- KullanÄ±cÄ± dÃ¼zenlemesi: `localStorage` (`lcw_v4`) â€” UI **DÄ±ÅŸa Aktar (JSON)**
- Detay: [`BannerPlanner/docs/LCW_EXPORT.md`](../BannerPlanner/docs/LCW_EXPORT.md)

### LCW tarafÄ± (hedef)

- Mevcut hero: statik HTML + Unsplash (`index.html`, `js/main.js`)
- Hedef: `js/banner-feed.js` (henÃ¼z yok) â€” export JSONâ€™dan hero/kategori banner render
- Detay: [`lcw/docs/BANNER_FEED.md`](../lcw/docs/BANNER_FEED.md)

## Sayfa eÅŸlemesi (taslak)

| BannerPlanner `page` / ViewKey | LCW dosyasÄ± |
|-------------------------------|-------------|
| HOMEPAGE | `index.html` hero slider |
| kadin | `kadin.html` |
| erkek | `erkek.html` |
| â€¦ | ilgili kategori HTML |

## Koordinasyon kuralÄ± (geliÅŸtirici)

Entegrasyonla ilgili **her** deÄŸiÅŸiklikte:

1. Ä°lgili projede [`AGENT_SYNC.md`](../BannerPlanner/AGENT_SYNC.md) gÃ¼nlÃ¼k tablosuna satÄ±r ekle
2. KarÅŸÄ± projede etki varsa oranÄ±n `AGENT_SYNC.md` dosyasÄ±na da not dÃ¼ÅŸ
3. `MasterDevelopment/SCAN_LOG.md` â€” standart tarama veya bÃ¼yÃ¼k adÄ±mlarda kayÄ±t
4. Gerekirse `WORK_QUEUE.md` MD-003 alt gÃ¶revlerini gÃ¼ncelle

## MD-003 kapanÄ±ÅŸ kriterleri (gelecek)

- [ ] Export formatÄ± dokÃ¼mante (`LCW_EXPORT.md` + Ã¶rnek JSON)
- [ ] LCWâ€™de en az homepage hero BannerPlanner exportâ€™undan render
- [ ] Ãœlke/dil filtresi (TR) netleÅŸtirildi
- [ ] Admin/agent taramasÄ±nda `AGENT_SYNC` gÃ¼nlÃ¼kleri senkron

## Opus ile iliÅŸki

- BannerPlanner â†’ **gÃ¶rsel/planlama** vitini (LCW DOM)
- Opus â†’ **kampanya/popup/push** (SDK)
- Ä°kisi LCWâ€™de aynÄ± sayfada birlikte test edilebilir; veri kaynaklarÄ± ayrÄ± kalÄ±r (MD-002 Opus campaign eÅŸlemesi ayrÄ± iÅŸ)
