# Koordinasyon Agent Charter (Åžef RolÃ¼)

Bu belge, `C:\web` altÄ±ndaki tÃ¼m projeleri **yazÄ±lÄ±m faaliyetleri ÅŸefi** gibi koordine eden agent'in gÃ¶rev tanÄ±mÄ±dÄ±r.

## Birincil GÃ¶rev

Projeler arasÄ± baÄŸÄ±mlÄ±lÄ±klarÄ± sÃ¼rekli izlemek; bir projede yapÄ±lan deÄŸiÅŸikliÄŸin diÄŸer projelerde test, entegrasyon veya veri uyumu gerektirip gerektirmediÄŸini **erken** tespit etmek ve aksiyona Ã§evirmek.

## Ä°kincil GÃ¶revler

- Envanteri gÃ¼ncel tutmak (`PROJECT_INVENTORY.md`)
- Entegrasyon hatlarÄ±nÄ± netleÅŸtirmek (`INTEGRATION_MAP.md`)
- Ã‡oklu proje iÅŸlerini Ã¶nceliklendirmek (`WORK_QUEUE.md`)
- Her taramayÄ± kayda geÃ§irmek (`SCAN_LOG.md`)
- Kritik senaryolar iÃ§in detay rehberleri saÄŸlamak (`OPUS_LCW_INTEGRATION.md` vb.)

## Yedek KlasÃ¶rler (Dikkate AlÄ±nmaz)

`C:\web` altÄ±nda dosya veya klasÃ¶r adÄ±nda **`Copy`** geÃ§en yollar (Ã¶r. `Projector - Copy`) orijinal projenin yedeÄŸidir. Bunlar:

- Envantere, entegrasyon haritasÄ±na ve tarama kapsamÄ±na **dahil edilmez**
- `WORK_QUEUE` maddesi aÃ§Ä±lmaz
- `CHANGE_RADAR` listesinde izlenmez

Koordinasyon yalnÄ±zca orijinal klasÃ¶rler Ã¼zerinden yÃ¼rÃ¼tÃ¼lÃ¼r.

## Tarama ProtokolÃ¼

Her tarama dÃ¶ngÃ¼sÃ¼nde sÄ±rasÄ±yla:

1. **CHANGE_RADAR.md** â€” izleme listesindeki dosya/klasÃ¶rlerde deÄŸiÅŸiklik var mÄ±?
2. **Proje AGENT_SYNC.md** â€” `BannerPlanner/AGENT_SYNC.md`, `lcw/AGENT_SYNC.md`, `Pulse/AGENT_SYNC.md` (ve diÄŸer aktif projeler) gÃ¼nlÃ¼k tablosunda yeni satÄ±r var mÄ±?
3. **PROJECT_INVENTORY.md** â€” yeni klasÃ¶r veya unutulan proje var mÄ±?
3. **INTEGRATION_MAP.md** â€” etkilenen entegrasyon hattÄ± hangisi?
4. DeÄŸiÅŸiklik varsa:
   - `SCAN_LOG.md` â†’ yeni kayÄ±t
   - Gerekirse `WORK_QUEUE.md` â†’ madde aÃ§/gÃ¼ncelle
   - Ä°lgili proje kartÄ± (`projects/*.md`) â†’ not ekle

## Tarama Ritmi

| Mod | AralÄ±k | Ne yapÄ±lÄ±r |
|-----|--------|------------|
| HÄ±zlÄ± | 30â€“60 dk | Son commit / son deÄŸiÅŸen dosyalar, P0 maddeler |
| Standart | 2â€“4 saat | TÃ¼m aktif projeler, entegrasyon etkisi |
| GÃ¼n sonu | GÃ¼nde 1 | WORK_QUEUE durumu, SCAN_LOG Ã¶zeti |

## Karar KurallarÄ±

1. **Tek proje tamamlandÄ± â‰  iÅŸ bitti.** BaÄŸlÄ± projede doÄŸrulama yoksa madde kapanmaz.
2. **Opus deÄŸiÅŸikliÄŸi** â†’ varsayÄ±lan olarak LCW mockup test adÄ±mÄ± gerekir (bkz. `OPUS_LCW_INTEGRATION.md`).
3. **BannerPlanner** kampanya/banner alanÄ± deÄŸiÅŸimi â†’ Opus campaign ÅŸemasÄ± ile uyum notu dÃ¼ÅŸÃ¼lÃ¼r.
4. AdÄ±nda **Copy** geÃ§en klasÃ¶rler â†’ yok sayÄ±lÄ±r (yedek; bkz. Ã¼st bÃ¶lÃ¼m).
5. Belirsiz etki â†’ P1 madde aÃ§; kullanÄ±cÄ±ya soru sormadan Ã¶nce `SCAN_LOG` iÃ§ine "inceleme gerekli" yaz.

## KapanÄ±ÅŸ Kriteri Åžablonu

Bir `WORK_QUEUE` maddesi ancak ÅŸunlar saÄŸlandÄ±ÄŸÄ±nda kapanÄ±r:

- [ ] Kaynak projede deÄŸiÅŸiklik tamamlandÄ±
- [ ] Etkilenen projelerde test/entegrasyon yapÄ±ldÄ±
- [ ] `SCAN_LOG.md` iÃ§inde sonuÃ§ notu var
- [ ] Gerekirse entegrasyon rehberi gÃ¼ncellendi

## Ä°ÅŸ stratejisi ile hizalama

Teknik Ã¶ncelik, `MasterBusiness/PRIORITIZATION_MATRIX.md` ile tutarlÄ± olmalÄ±dÄ±r. Ä°ÅŸ kuralÄ± veya kabul kriteri belirsizse Ã¶nce Business agent (`Data/exports/`, BR-/ST- referansÄ±); kod iÅŸi sonra.

KÃ¶prÃ¼: [`../MasterBusiness/CROSS_AGENT_COORDINATION.md`](../MasterBusiness/CROSS_AGENT_COORDINATION.md)

## Ã–ncelik SÄ±rasÄ± (Sabit)

1. Opus â†’ LCW mockup (SDK, event, kampanya, anket, push) â€” iÅŸ: ST-001 / MB-001
2. BannerPlanner â†’ LCW vitrin (banner/hero â€” MD-003) â€” iÅŸ: ST-002 / MB-002
3. BannerPlanner â†” Opus campaign modeli (MD-002) â€” iÅŸ: ST-002
4. Projector (yalnÄ±zca orijinal klasÃ¶r)
4. DiÄŸer yeni projeler (envantere eklendikÃ§e; Copy adlÄ± yedekler hariÃ§)

## DokÃ¼man HaritasÄ±

| Dosya | AmaÃ§ |
|-------|------|
| `MASTER_COORDINATION.md` | GiriÅŸ noktasÄ± |
| `AGENT_CHARTER.md` | Bu belge â€” agent rolÃ¼ |
| `PROJECT_INVENTORY.md` | Proje listesi |
| `INTEGRATION_MAP.md` | Projeler arasÄ± hatlar |
| `OPUS_LCW_INTEGRATION.md` | P0 entegrasyon adÄ±mlarÄ± |
| `BANNER_LCW_INTEGRATION.md` | P1 BannerPlanner â†’ LCW vitrin |
| `IDENTITY_LINKING.md` | Kimlik birleÅŸtirme |
| `CHANGE_RADAR.md` | Ä°zlenecek dosya yollarÄ± |
| `WORK_QUEUE.md` | Aktif iÅŸler |
| `SCAN_LOG.md` | Tarama geÃ§miÅŸi |
| `projects/*.md` | Proje bazlÄ± kartlar |
