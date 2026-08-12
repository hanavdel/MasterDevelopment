# CMS Read API — Menü, Homepage, Template, Component

**İş kodu:** MD-011 · **Port:** CMS dev `3458`  
**Tüketici modül:** `C:\web\shared\cms-client`

## Amaç

CMS’de yönetilen içerik yapılarını HTTP API ile bağımsız uygulamalara sunmak. Her entegrasyon `enabled.*` bayrakları ile açılıp kapatılır; LCW varsayılan olarak yerel JSON ile **standalone** çalışır.

| Domain | Durum |
|--------|--------|
| Menü | ✅ Faz 1 |
| Homepage | ✅ Faz 2 |
| Template | ✅ Faz 2 |
| Component | ✅ Faz 2 |
| Page bundle (resolved / CPC) | ✅ Faz 2 |

## Veri modeli

```
Ülke × Kategori × Dil → Homepage
  └── Template (homePageId FK)
        └── Component (members[].refId)
              └── items[] / componentPayload.localizedData[cultureKey]
```

Kaynak dosyalar:
- `data/config/homepage-records.json`
- `data/config/template-v5-records.json`
- `data/config/component-v5-records.json`

---

## Endpoint'ler

### Sağlık

```
GET /api/v1/content/health
```

### Menü (Faz 1)

```
GET /api/v1/content/menus
GET /api/v1/content/menus/:countryCode/:langCode?format=vitrin|raw
```

### Homepage

```
GET /api/v1/content/homepages?countryCode=TR&langCode=trtr&categoryKey=kadin
GET /api/v1/content/homepages/:id
GET /api/v1/content/homepages/:countryCode/:langCode/:categoryKey
```

### Template

```
GET /api/v1/content/templates?homePageId=641&countryCode=TR&langCode=trtr
GET /api/v1/content/templates/:id
```

Query filtreleri: `homePageId`, `countryCode`, `langCode`, `publishStatus`, `platform`, `view`

### Component

```
GET /api/v1/content/components/:id?countryCode=TR&langCode=trtr&format=resolved
GET /api/v1/content/components?ids=7331,7332&countryCode=TR&langCode=trtr&format=cpc
```

| `format` | Açıklama |
|----------|----------|
| `raw` | CMS kayıt dosyasındaki ham kayıt |
| `resolved` | Locale items + htmlEditor projection |
| `cpc` | CPC vitrin component shape |

### Page bundle (birleşik)

```
GET /api/v1/content/pages/:countryCode/:langCode/:categoryKey?format=resolved|cpc|raw&platform=Web
```

Örnekler:

```http
GET /api/v1/content/pages/TR/trtr/kadin?format=resolved&platform=Web
GET /api/v1/content/pages/TR/trtr/23-nisan?format=cpc&platform=Web
```

**`format=resolved`** yanıtı:

```json
{
  "locale": { "countryCode": "TR", "langCode": "trtr", "cultureKey": "tr-TR-TR", "categoryKey": "23-nisan" },
  "homepage": { "id": 641, "name": "23 NİSAN", "categoryKey": "23-nisan" },
  "template": { "id": 4175, "key": "WEB-23-NISAN-2026", "members": [] },
  "slots": [
    { "refId": "7331", "displayOrder": 1, "component": { "id": 7331, "items": [] } }
  ]
}
```

**`format=cpc`** → [`CONTENT_PUBLISH_CONTRACT.md`](CONTENT_PUBLISH_CONTRACT.md) vitrin paketi.

### Template FK sapması

Homepage import (yeni id, örn. `95691`) ile template import (eski `homePageId`, örn. `641`) farklı olabilir. Page API:

1. `homePageId === homepage.id` ile template arar
2. Bulunamazsa `fuzzyMatch` (varsayılan açık) ile aynı locale + `homePage` adı / `categoryKey` hizalaması yapar

---

## Konfigüratif tüketim

### shared/cms-client

| Modül | Rol |
|-------|-----|
| `config.js` | `enabled.menu`, `enabled.homepage`, fallback |
| `menu.js` | Menü fetch |
| `content.js` | Homepage / template / component / page bundle |

### LCW

| Dosya | Rol |
|-------|-----|
| `lib/cms-config.js` | Env bayrakları |
| `lib/menu.js` | CMS menü + `/data/menu-tree.json` fallback |
| `lib/page-content.js` | CMS page bundle + `/data/banners/*.json` fallback |

### Ortam değişkenleri

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `NEXT_PUBLIC_CMS_BASE_URL` | `http://127.0.0.1:3458` | CMS API |
| `NEXT_PUBLIC_CMS_MENU_ENABLED` | `false` | Menü CMS kaynağı |
| `NEXT_PUBLIC_CMS_HOMEPAGE_ENABLED` | `false` | Sayfa bundle CMS kaynağı |
| `NEXT_PUBLIC_CMS_*_FALLBACK` | `local` | `local` \| `none` |

---

## Uygulama dosyaları

| Dosya | Rol |
|-------|-----|
| `CMS/scripts/content-api-handler.js` | HTTP router |
| `CMS/scripts/content-api-menu-lib.js` | Menü dosya okuma |
| `CMS/scripts/content-records-lib.js` | Homepage/template/component + page resolve |
| `CMS/scripts/content-payload-lib.js` | cultureKey + component projection |
| `CMS/scripts/menu-vitrin-transform.js` | Menü vitrin dönüşümü |
| `CMS/scripts/test-content-api.js` | Smoke test |

---

## Test

```powershell
cd C:\web\CMS
npm run test:content-api
npm start
npm run test:content-api:http
```

LCW CMS modu:

```powershell
cd C:\web\lcw
$env:NEXT_PUBLIC_CMS_MENU_ENABLED='true'
$env:NEXT_PUBLIC_CMS_HOMEPAGE_ENABLED='true'
$env:NEXT_PUBLIC_CMS_BASE_URL='http://127.0.0.1:3458'
npm run dev
```

---

## Tüketiciler

| Uygulama | Menü | Homepage/Page |
|----------|------|---------------|
| **LCW** | Birincil | Birincil (banner fallback) |
| **Pulse** | Opsiyonel | Opsiyonel |
| **BannerPlanner** | Opsiyonel | Planlama bağlamı / CPC doğrulama |

Editör yazma API’si ayrıdır: `GET/PUT /api/records/{homepages|templateV5|componentV5}`.
