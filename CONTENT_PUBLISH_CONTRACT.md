# Content Publish Contract (CPC)

**Ä°ÅŸ kodu:** MD-007 (P1)  
**Tarih:** 2026-06-05  
**AmaÃ§:** BannerPlanner planlama katmanÄ± ile CMS Ã¼retim omurgasÄ± arasÄ±nda tek publish sÃ¶zleÅŸmesi; component/item Ã¶lÃ§Ã¼lebilirliÄŸi.

**CMS durumu (doÄŸrulandÄ±):** Faz 1 simÃ¼lasyon tamam â€” Homepage v2, Template `homePageId`, Component `componentPayload` + locale filtreleri. Layout birleÅŸtirme **geri Ã§ekildi**.

---

## Katmanlar

```
BannerPlanner (planlama)     â†’  CPC JSON  â†’  CMS (system of record)
                                              â†“
                                         Vitrin (LCW / Next)
                                              â†“
                                         Opus (content_impression / click)
```

| Katman | Rol | Veri sahibi |
|--------|-----|-------------|
| **BannerPlanner** | DÃ¶nem, workflow, Ã§eviri, slot matrisi | Planlama meta (CPC'ye girmez) |
| **CMS** | Homepage â†’ Template â†’ Component | Ãœretim kayÄ±tlarÄ± |
| **Layout** (`layouts.json`) | Runtime Ã¶nizleme / Opus | Publish **dÄ±ÅŸÄ±** |
| **Opus** | Ã–lÃ§Ã¼m eventâ€™leri | Analytics |

---

## CMS gÃ¼ncel model (2026-06 â€” Faz 1)

Ãœretim ekibi + simÃ¼lasyon (`C:\web\CMS`):

```
Ãœlke Ã— Kategori Ã— Dil
  â””â”€â”€ Homepage (1)           homepage-records.json v2
        â””â”€â”€ Template (1..n)  template-v5-records.json â€” homePageId FK
              â””â”€â”€ Component    component-v5-records.json â€” entity
                    â””â”€â”€ items[]  JSON (entity DEÄžÄ°L)
                          â””â”€â”€ componentPayload.localizedData[culture].items[]
```

### Tamamlanan CMS modÃ¼lleri

| ModÃ¼l | Dosya | Not |
|-------|-------|-----|
| Locale baÄŸlamÄ± | `js/cms-context.js` | Header Ã¼lke/dil â†’ liste filtresi |
| Homepage List/Edit | `js/homepage.js` | `countryCode`, `langCode`, `categoryKey` |
| Template v5 | `js/template-v5.js` | `homePageId` dropdown |
| Component v5 | `js/component-v5.js` | Items JSON editÃ¶rÃ¼ |
| Payload normalizer | `js/component-payload.js` | Legacy `items[]` â†’ Ã¼retim shape |
| Layout + Opus preview | `js/app.js`, `opus-preview.js` | Ä°kincil â€” CPC dÄ±ÅŸÄ± |
| MenÃ¼ aÄŸaÃ§larÄ± | `data/config/menu-trees/` | BR-NAV-001 â€” CPC appendix (nav) |

### Homepage kardinalite

`(countryCode, langCode, categoryKey)` â†’ **en fazla 1** kayÄ±t.

Ã–rnek GR / `grgr`: id 107 `kadin`, 110 `erkek`, 106 `cocuk`, 108 `home`, 1131 header-content benzeri (`categoryKey: home`).

### Component â€” iki seed ÅŸekli (CPC normalize eder)

**Legacy (simÃ¼lasyon):** dÃ¼z `items[]` + `content.culture`

**Ãœretim:** `componentPayload`:

```json
{
  "commonData": { "isHorizontal": false, "isStackView": false, "styles": {} },
  "localizedData": {
    "el-GR-GR": {
      "items": [
        {
          "desktopImageUrl": "https://â€¦",
          "mobileImageUrl": "https://â€¦",
          "url": "https://â€¦",
          "buttons": [{ "buttonUrl": "â€¦", "buttonText": "â€¦" }],
          "startDate": "â€¦",
          "endDate": "â€¦",
          "isHideItem": false
        }
      ]
    }
  },
  "countryConfigData": { "13": { "startDate": "â€¦", "endDate": "â€¦", "isActive": true } }
}
```

Culture key: `ComponentPayload.cultureKey(countryCode, langCode)` â€” Ã¶rn. `trtr`+`TR` â†’ `tr-TR-TR`, `grgr`+`GR` â†’ `el-GR-GR`.

Referans kayÄ±t: `component-v5-records.json` id **8241** (IQ slider, Ã§oklu culture).

---

## CPC paket ÅŸemasÄ± (v1)

BannerPlanner **publish** Ã§Ä±ktÄ±sÄ±; CMS import ve LCW feed tÃ¼ketir.

```json
{
  "cpcVersion": "1.0",
  "publishedAt": "2026-06-05T12:00:00.000Z",
  "source": {
    "system": "banner_planner",
    "planningPeriodId": "pp_2026_w21",
    "templatePlanId": "tp_kadin_gr_w21"
  },
  "locale": {
    "countryCode": "GR",
    "langCode": "grgr",
    "cultureKey": "el-GR-GR"
  },
  "homepage": {
    "productionHomePageId": 107,
    "categoryKey": "kadin",
    "name": "Î“Î¥ÎÎ‘Î™ÎšÎ•Î£"
  },
  "template": {
    "key": "WEB-GR-KADIN-HERO-060426",
    "homePageId": 107,
    "view": "HomePageV2",
    "platform": "Web",
    "publishStatus": "Live",
    "validFrom": "2026-06-01T00:00:00.000Z",
    "validTo": "2030-01-01T00:00:00.000Z",
    "members": [
      { "refId": "8240", "displayOrder": 1, "isActive": true }
    ]
  },
  "components": [
    {
      "id": "8240",
      "key": "WEB-GR-KADIN-HERO-060426",
      "typeCode": "FULL_WIDTH_SLIDER",
      "platform": "Web",
      "componentPayload": {
        "commonData": {},
        "localizedData": {
          "el-GR-GR": {
            "items": [
              {
                "itemKey": "hero_slide_1",
                "displayOrder": 1,
                "desktopImageUrl": "https://â€¦",
                "mobileImageUrl": "https://â€¦",
                "url": "/kadin",
                "alt": "Î“Î¥ÎÎ‘Î™ÎšÎ•Î£"
              }
            ]
          }
        },
        "countryConfigData": {}
      },
      "planningRef": {
        "componentPlanId": "cp_kadin_hero",
        "campaignId": "camp_yaz_2026",
        "slotKey": "hero_main"
      }
    }
  ],
  "measurement": {
    "enabled": true,
    "dimensions": ["homepageId", "templateKey", "componentId", "itemKey", "countryCode", "langCode", "cultureKey"]
  }
}
```

### Zorunlu alanlar

| BÃ¶lÃ¼m | Zorunlu |
|-------|---------|
| `cpcVersion`, `locale`, `template.key`, `template.homePageId`, `template.members[]` | Evet |
| `homepage.productionHomePageId` veya publish sÄ±rasÄ±nda CMS upsert | Evet |
| `components[].id` veya CMS yeni id atar | Evet |
| `components[].componentPayload.localizedData[cultureKey].items[]` | Evet |
| **`items[].itemKey`** | Publish iÃ§in **zorunlu** (Ã¶lÃ§Ã¼m) |
| `planningRef` | BannerPlanner traceability (opsiyonel CMSâ€™de saklanmaz) |

### CPCâ€™ye girmeyen alanlar

BannerPlanner-only: `assignee`, `brief`, `comments`, `workflow state`, `weekNum`, Gantt meta.

Layout (`layouts.json`): runtime Ã¶nizleme; CPC ile CMSâ€™e yazÄ±lmaz.

---

## BannerPlanner â†” CMS eÅŸleme

| BannerPlanner | CMS (Ã¼retim / sim) | CPC alanÄ± |
|---------------|----------------------|-----------|
| `ViewAssignment.viewKey` | `homepage.categoryKey` | `homepage.categoryKey` |
| `ViewAssignment.pageType: homepage` | Homepage entity | `homepage.*` |
| `PlanningPeriod` + dates | `template.validFrom/To` | `template.validFrom/To` |
| `TemplatePlan` | Template + `homePageId` | `template.*` |
| `ComponentPlan.payloadDraft` | `componentPayload` | `components[]` |
| Matris slot `camp\|page\|slot\|lang` | â€” | `planningRef.slotKey` |
| `layoutTemplates` (LCW Ã¶nizleme) | `layouts.json` | **CPC dÄ±ÅŸÄ±** |
| `CTYPES` / `typeCode` map | `typeCode` | `components[].typeCode` |

Sayfa anahtarÄ± (BannerPlanner `domain.js`):

| BP `page` | CMS `categoryKey` | `viewKey` (runtime) |
|-----------|-------------------|---------------------|
| `KADIN` | `kadin` | `kadin` |
| `ERKEK` | `erkek` | `erkek` |
| `HOME` | `home` | `homepage` |

---

## Component / item Ã¶lÃ§Ã¼lebilirlik

Item **entity yapÄ±lmaz** (CMS Ã¼retim kuralÄ±). Ã–lÃ§Ã¼m **stabil anahtarlar** ile yapÄ±lÄ±r.

### itemKey (CPC zorunlu)

| Kural | AÃ§Ä±klama |
|-------|----------|
| Format | `[a-z0-9_]+`, component iÃ§inde unique |
| Kaynak | BannerPlanner slot â†’ publish map |
| Legacy | `itemKey` yoksa runtime `item_${displayOrder}` (geÃ§ici; publishâ€™te zorunlu) |

### Opus event sÃ¶zleÅŸmesi (vitrin)

```javascript
Opus.track('content_impression', {
  homepageId: 107,
  templateKey: 'WEB-GR-KADIN-HERO-060426',
  componentId: '8240',
  itemKey: 'hero_slide_1',
  typeCode: 'FULL_WIDTH_SLIDER',
  countryCode: 'GR',
  langCode: 'grgr',
  cultureKey: 'el-GR-GR',
  viewKey: 'kadin',
  source: 'lcw_vitrin'
});
```

TÄ±klama: `content_click` â€” aynÄ± boyutlar + `targetUrl`.

### Ä°ÅŸ birimi rapor boyutlarÄ±

| Boyut | Soru |
|-------|------|
| `homepageId` + `categoryKey` | KadÄ±n GR ana sayfa performansÄ±? |
| `componentId` + `typeCode` | Hero slider CTR? |
| `itemKey` | Slide 1 vs slide 2? |
| `planningRef.campaignId` | Hangi kampanya planÄ± besledi? |
| `countryCode` / `langCode` | Locale kÄ±rÄ±lÄ±mÄ± |

Opus MD-005 gezinti raporuna ek olarak **content analytics** (MD-007 alt gÃ¶rev) planlanÄ±r.

---

## Import / export akÄ±ÅŸÄ±

```
1. BannerPlanner: TemplatePlan onaylÄ± â†’ exportCpc(locale, templatePlanId)
2. CMS API veya seed import: validate CPC â†’ upsert Homepage/Template/Component
3. ComponentPayload.resolve() legacy flat items normalize eder
4. LCW banner-feed: CPC veya CMS export JSON okur â†’ render + data-opus-* attribute
5. Opus: impression/click ingest
```

Dosya hedefleri (planlÄ±):

| TÃ¼ketici | Yol |
|----------|-----|
| CMS import | `CMS/data/import/cpc/` |
| LCW feed | `lcw/data/banner-export.json` (MD-003) |
| Ã–rnek | `MasterDevelopment/examples/cpc-v1-gr-kadin.json` |

---

## Layout vs Homepage (net ayrÄ±m)

| | Homepage | Layout |
|---|----------|--------|
| Ãœretim CMS | âœ… Entity | âŒ SimÃ¼lasyon only |
| CPC | âœ… | âŒ |
| Opus preview | âŒ | âœ… Layout editÃ¶r |
| BannerPlanner | ViewAssignment | layoutTemplates Ã¶nizleme |

---

## Yol haritasÄ± (MD-007)

| # | GÃ¶rev | Sorumlu |
|---|-------|---------|
| 1 | CPC JSON Schema + validator script | `MasterDevelopment` |
| 2 | BannerPlanner `exportCpc()` | BannerPlanner |
| 3 | CMS `importCpc()` + `itemKey` UI validasyonu | CMS |
| 4 | LCW render + Opus `content_*` events | LCW + Opus |
| 5 | Admin content analytics (itemKey kÄ±rÄ±lÄ±mÄ±) | Opus |

**Paralel:** MD-003 (LCW vitrin), MD-004 (CMS global UX), MD-005 (gezinti) â€” CPC v1 ÅŸemasÄ± bunlarÄ± bloklamaz.

---

## Referans dosyalar

| Konu | Yol |
|------|-----|
| CMS domain (gÃ¼ncel) | `C:\web\CMS\docs\domain-model.md` |
| Homepage seed v2 | `C:\web\CMS\data\config\homepage-records.json` |
| Template seed v2 | `C:\web\CMS\data\config\template-v5-records.json` |
| Component seed v2 | `C:\web\CMS\data\config\component-v5-records.json` |
| Payload helper | `C:\web\CMS\js\component-payload.js` |
| Locale context | `C:\web\CMS\js\cms-context.js` |
| BannerPlanner domain | `C:\web\BannerPlanner\docs\domain-model.md` |
| MD-004 revize | `CMS_HOME_LAYOUT_UNIFICATION.md` |
| CMS agent gÃ¼nlÃ¼ÄŸÃ¼ | `C:\web\CMS\AGENT_SYNC.md` |

---

## Onay / senkron

- [x] CMS Faz 1 durumu CPCâ€™ye yansÄ±tÄ±ldÄ± (2026-06-05)
- [ ] BannerPlanner `exportCpc` prototipi
- [ ] CMS `itemKey` editÃ¶r validasyonu
- [ ] LCW Ã¶lÃ§Ã¼m eventâ€™leri
