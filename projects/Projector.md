# Proje Kartı: Projector

| Alan | Değer |
|------|--------|
| Yol | `C:\web\Projector` |
| Tip | Node.js + Express + statik SPA |
| Paket adı | `lcw-projector` |
| Rol | LCW e-ticaret OKR / talep yönetimi, Jira modülü |

## Scriptler

| Komut | İşlev |
|-------|--------|
| `npm run extract-data` | Veri çıkarma |
| `npm run patch-app` | Uygulamaya veri yama |
| `npm run setup-data` | İkisini sırayla çalıştırır |
| `npm start` | `server.js` |

## Veri

- `data/data-2026-Q*.json` — dönemsel OKR verisi
- `data/jira-*.json` — Jira alan eşlemeleri

## İlişkili projeler

| Proje | İlişki |
|-------|--------|
| **LCW mockup** | Kavramsal (LCW markası); doğrudan kod bağı yok |
| **Opus** | Doğrudan entegrasyon yok; gelecekte raporlama köprüsü olabilir |

> `Projector - Copy` yedek klasörüdür; koordinasyona dahil değildir.

## Koordinasyon tetikleyicileri

`scripts/*.mjs` veya `data/*.json` değişimi → veri/uygulama tutarlılığı  
`jira-module.js` değişimi → harici Jira config uyumu

## Son tarama notu

2026-05-27: Git deposu mevcut; büyük `index.html` + `js/app.js` tabanlı SPA.
