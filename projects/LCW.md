# Proje Kartı: LCW Mockup

| Alan | Değer |
|------|--------|
| Yol | `C:\web\lcw` |
| Tip | Statik HTML/CSS/JS + `node server.js` |
| Rol | LCW.com benzeri simülasyon — UX ve entegrasyon test vitrini |
| **Agent günlüğü** | [`lcw/AGENT_SYNC.md`](../../lcw/AGENT_SYNC.md) |

## Sayfalar

`index.html`, `kadin.html`, `erkek.html`, kategori sayfaları, `markalar.html`, vb.

## JS yapısı

- `js/data.js` — ürün verisi
- `js/common.js` — header, footer, sepet, Opus kancaları
- `js/main.js` — ana sayfa hero
- `js/opus-integration.js` — Opus SDK
- `docs/BANNER_FEED.md` — BannerPlanner tüketim (planlı)

## Çalıştırma

```powershell
cd C:\web\lcw
node server.js
```

http://localhost:3000

## Upstream bağımlılık

| Kaynak | Durum |
|--------|--------|
| **Opus SDK** | Entegre — MD-001 devam; consent **MD-012** (Opus banner, footer yeniden açma) |
| **BannerPlanner** | Planlı — MD-003 hero/banner feed |
| **CMS API (Next.js)** | Planlı — MD-011 menü → homepage API tüketimi |

## Gelecek mimari (MD-011)

Statik HTML → **Next.js App Router** vitrin; CMS Read API (menü, homepage, component); BannerPlanner → CMS (MD-007) → LCW gözlem hattı. Rehber: [`LCW_NEXTJS_HEADLESS.md`](../LCW_NEXTJS_HEADLESS.md).

## Koordinasyon tetikleyicileri

- Hero/vitrin değişimi → BannerPlanner export uyumu
- Opus SDK / push değişimi → `OPUS_LCW_INTEGRATION.md`

## Test odağı

Sepet, hero, Opus popup, BannerPlanner banner (yakında), push abonelik.
