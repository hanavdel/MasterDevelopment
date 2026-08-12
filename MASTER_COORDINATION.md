# Master Development Coordination

`C:\web\MasterDevelopment` — `C:\web` altındaki tüm projelerin **ortak koordinasyon merkezi** (teknik / entegrasyon).

**İş ve strateji:** [`../MasterBusiness/MASTER_COORDINATION.md`](../MasterBusiness/MASTER_COORDINATION.md) — ortak öncelik [`PRIORITIZATION_MATRIX.md`](../MasterBusiness/PRIORITIZATION_MATRIX.md), aktarım [`CROSS_AGENT_COORDINATION.md`](../MasterBusiness/CROSS_AGENT_COORDINATION.md).

## Ana görev

Projelerdeki değişiklikleri periyodik olarak taramak, projeler arası bağımlılıkları takip etmek ve entegrasyon test ihtiyaçlarını erken görmek. Agent bu klasördeki belgelere göre **yazılım faaliyetleri şefi** gibi hareket eder.

## Hızlı başlangıç

1. [`AGENT_CHARTER.md`](AGENT_CHARTER.md) — rol, tarama protokolü, kapanış kuralları  
2. [`CHANGE_RADAR.md`](CHANGE_RADAR.md) — hangi dosyalar izlenir  
3. [`WORK_QUEUE.md`](WORK_QUEUE.md) — şu an ne yapılıyor  
4. [`SCAN_LOG.md`](SCAN_LOG.md) — son tarama ne buldu  

## DokÃ¼man seti

| Dosya | Ä°Ã§erik |
|-------|--------|
| `MASTER_COORDINATION.md` | Bu dosya â€” giriÅŸ |
| `AGENT_CHARTER.md` | Åžef agent gÃ¶rev tanÄ±mÄ± |
| `PROJECT_INVENTORY.md` | Proje envanteri |
| `projects/*.md` | Proje kartlarÄ± (detay) |
| `INTEGRATION_MAP.md` | Entegrasyon hatlarÄ± |
| `OPUS_LCW_INTEGRATION.md` | P0: Opus â†’ LCW |
| `BANNER_LCW_INTEGRATION.md` | P1: BannerPlanner â†’ LCW vitrin |
| `CMS_HOME_LAYOUT_UNIFICATION.md` | P1: CMS Homepage domain (MD-004) |
| `LCW_NEXTJS_HEADLESS.md` | P1: LCW Next.js + CMS API (MD-011) |
| `LOCALIZATION_CMS_UNIFICATION.md` | P1: Mobile/Web lokalizasyon â†’ CMS (MD-010) |
| `CONTENT_PUBLISH_CONTRACT.md` | P1: CPC â€” BannerPlanner â†’ CMS |
| `IDENTITY_LINKING.md` | Kimlik / unified_profiles |
| `CHANGE_RADAR.md` | Ä°zlenecek yollar |
| `WORK_QUEUE.md` | Aktif koordinasyon iÅŸleri |
| `SCAN_LOG.md` | Tarama geÃ§miÅŸi |
| `Dashboard/` | Koordinasyon web arayÃ¼zÃ¼ (port **3282**) |

## Ã–ncelikli senaryo

**Opus** â†’ LCW (MD-001) ve **BannerPlanner** â†’ LCW vitrin (MD-003) birinci Ã¶ncelikli koordinasyon hatlarÄ±dÄ±r.

## Tarama ritmi (Ã¶neri)

- HÄ±zlÄ±: 30â€“60 dakika  
- Standart: 2â€“4 saat  
- GÃ¼n sonu: 1 kez konsolidasyon  

## Aktif projeler (Ã¶zet)

| Proje | Yol |
|-------|-----|
| Opus | `C:\web\Opus` |
| LCW mockup | `C:\web\lcw` |
| Projector | `C:\web\Projector` |
| BannerPlanner | `C:\web\BannerPlanner` |
| CMS Editor | `C:\web\CMS` |
| EPIM | `C:\web\EPIM` |

**Yedek klasÃ¶rler:** AdÄ±nda `Copy` geÃ§en klasÃ¶rler (Ã¶r. `Projector - Copy`) koordinasyon kapsamÄ± dÄ±ÅŸÄ±ndadÄ±r.
