# Proje Kartı: Opus

| Alan | Değer |
|------|--------|
| Yol | `C:\web\Opus` |
| Tip | Node.js monorepo (npm workspaces) |
| Rol | Pazarlama, segmentasyon, kampanya, anket, push |
| Ana çıktı | `@opus/sdk` — web sitelerine gömülebilir JS |

## Modüller

- `apps/api` — REST API (Express), port varsayılan **3102**
- `apps/admin` — Operasyon paneli, port **3101**
- `packages/sdk` — Web SDK (`track`, bootstrap, push modülü)
- `packages/shared` — Ortak sabitler

## Başlatma

```powershell
cd C:\web\Opus
npm run dev:api
npm run dev:admin
npm run build:sdk
```

## Downstream (bu projeyi kim kullanır?)

| Hedef | Amaç |
|-------|------|
| **LCW mockup** | Entegrasyon ve UI testi (P0) |
| Gelecekteki gerçek siteler | Üretim SDK embed |

## Koordinasyon tetikleyicileri

SDK veya API route değişince → LCW test matrisi (`OPUS_LCW_INTEGRATION.md`)  
Consent / çerez UI değişince → **MD-012** (`COOKIE_CONSENT_COMPLIANCE.md`) — tüm vitrinler  
Admin'de yeni kampanya tipi → BannerPlanner eşleme notu (MD-002)  
**Omni Postcheckout** → [`OPUS_OMNI_POSTCHECKOUT.md`](../OPUS_OMNI_POSTCHECKOUT.md) (MD-014)

## Son tarama notu

2026-05-27: MD-014 planlama dokümanı; Faz 0–1 sprint backlog hazır.
