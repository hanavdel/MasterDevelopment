# Lokalizasyon Ortaklaştırma — Backoffice Mobile → CMS

**İş kodu:** MD-010 (P1)  
**Karar tarihi:** 2026-05 — haftalık koordinasyon toplantısı  
**Durum:** Planlama

---

## Karar özeti

Backoffice ortamındaki **mobile uygulama lokalizasyon yapısı CMS'e taşınacak**; Web uygulamasında **tamamen bağımsız yürüyen** lokalizasyon/parametre süreci **ortaklaştırılacak**.

## Gerekçe

| Konu | Backoffice (mevcut) | CMS (hedef) |
|------|---------------------|-------------|
| Veritabanı | Ülke başına **ayrı DB** | **Ortak** veritabanı |
| Mobile lokalizasyon | Backoffice içinde yönetiliyor | CMS omurgasına taşınacak |
| Web lokalizasyon | Web tarafında **ayrı kaynak / süreç** | Mobile ile **ortak parametre havuzu** |
| Operasyonel yük | Kolay ortaklaştırılabilir parametreler için çift kaynak; uzun süredir ek iş ve karmaşa | Tek kaynak, ülke/dil override modeli (MD-004 ile uyumlu) |

## Kapsam (ilk aşama)

1. **Envanter** — Backoffice mobile lokalizasyon parametreleri (ülke DB kırılımı ile)
2. **Envanter** — Web bağımsız lokalizasyon / config kaynakları
3. **Sınıflandırma** — Ortak (mobile+web), platform-özel, ülke override gerektiren
4. **CMS model taslağı** — culture key, country/lang, global default + override (BR-CONTENT-002 ile hizalı)
5. **Simülasyon** — CMS editörde lokalizasyon modülü taslağı (locale filtreleri mevcut — `cms-context.js`)
6. **Geçiş planı** — Read path: CMS → mobile API / web runtime; Backoffice write path kapanışı

## İlişkili işler

| Kod | İlişki |
|-----|--------|
| MD-004 | Global operasyon UX, locale filtreleri, toplu uygulama |
| MD-007 | CPC `cultureKey` / `localizedData` — içerik lokalizasyonu ile parametre lokalizasyonu ayrımı netleştirilmeli |
| BR-CONTENT-002 | Global varsayılan + ülke override meta |

## Paralellik

**MD-003, MD-007 bloklanmaz** — lokalizasyon hattı içerik planlama/export ile paralel ilerleyebilir; CPC şemasında `cultureKey` alanları referans alınır.

## Çıkış kriteri

- Envanter + sınıflandırma tablosu tamam
- CMS hedef model taslağı üretim ekibi geri bildirimi aldı
- Simülasyonda en az 1 ortak parametre seti (mobile+web) locale override ile gösterildi
- `SCAN_LOG` kaydı

## Referans

- [`WORK_QUEUE.md`](WORK_QUEUE.md) — MD-010 alt görevler
- [`CMS_HOME_LAYOUT_UNIFICATION.md`](CMS_HOME_LAYOUT_UNIFICATION.md) — locale / global UX
- [`CMS/docs/domain-model.md`](../CMS/docs/domain-model.md)
