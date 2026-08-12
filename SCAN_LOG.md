# Scan Log

Bu dosya periyodik koordinasyon taramalarinin kaydidir.

## Kayit Formati

### [TARIH SAAT] Scan Cycle

- Kapsam: Taranan projeler
- Gozlem: Ozet degisiklik/riske dair notlar
- Etki: Hangi projeler etkileniyor
- Aksiyon:
  - `WORK_QUEUE.md` maddesi ac/guncelle
  - Gerekliyse entegrasyon testi baslat
- Sonraki kontrol: Tahmini zaman

---

### [2026-05-27 12:01] Baslangic Tarama

- Kapsam:
  - `C:\web\Opus`
  - `C:\web\lcw`
  - `C:\web\Projector`
  - `C:\web\Projector - Copy`
  - `C:\web\BannerPlanner`
- Gozlem:
  - Opus, coklu paketli bir yapi ve SDK odakli entegrasyon noktasi sunuyor.
  - LCW mockup, Opus ozelliklerinin sahaya cikmadan once hizli validasyonu icin uygun.
  - Projector tarafinda veri/patch scriptleri aktif gelistirme akisini isaret ediyor.
  - Projector - Copy klasoru ayri bir deneme/guvenli degisim alani olarak ele alinmali.
- Etki:
  - En yuksek bagimlilik Opus -> LCW test akisi.
  - Ikincil bagimlilik Projector <-> Projector - Copy senkronu.
- Aksiyon:
  - `MD-001`, `MD-002`, `MD-003` backlog maddeleri acildi.
  - Bir sonraki taramada Opus-LCW entegrasyon checklist'inin somut adimlara bolunmesi planlandi.
- Sonraki kontrol: 2-4 saat icinde standart tarama

---

### [2026-05-27 — Koordinasyon merkezi genişletme]

- **Kapsam:** Tüm `C:\web` kök projeleri + `_MasterDevelopment` yapılandırması
- **Gözlem:**
  - 5 aktif proje: Opus, lcw, Projector, Projector - Copy, BannerPlanner
  - LCW'de Opus SDK / `track` referansı **yok** — MD-001 entegrasyonu bekliyor
  - Opus API varsayılan portu `config.js` içinde **3102**; README ile tutarsızlık not edildi
  - Opus monorepo: SDK (`packages/sdk`), API event/campaign route'ları, admin şema güncel
  - Projector: git repo, Jira modülü, çeyreklik `data/*.json`
  - BannerPlanner: bağımsız banner UI; Opus API bağlantısı yok
- **Etki:**
  - P0: Opus → LCW hatı acil
  - P1: Projector / Copy drift
  - P2: BannerPlanner campaign eşlemesi
- **Aksiyon:**
  - `AGENT_CHARTER.md`, `OPUS_LCW_INTEGRATION.md`, `CHANGE_RADAR.md` oluşturuldu
  - `projects/*.md` proje kartları eklendi
  - Mevcut MASTER / INVENTORY / INTEGRATION / WORK_QUEUE güncellendi
- **Sonraki kontrol:** Standart tarama (2–4 saat) — CHANGE_RADAR yolları + MD-001 alt görev ilerlemesi

---

### [2026-05-27 — Copy klasörleri kapsam dışı]

- **Karar:** Adında `Copy` geçen klasörler (ör. `Projector - Copy`) orijinal proje yedeği; koordinasyon, envanter ve tarama dışı.
- **Aksiyon:**
  - `projects/Projector-Copy.md` kaldırıldı
  - Eski MD-002 (Projector drift) iptal; BannerPlanner eşlemesi **MD-002** olarak güncellendi
  - AGENT_CHARTER, INVENTORY, INTEGRATION_MAP, CHANGE_RADAR güncellendi
- **Aktif proje sayısı:** 4 (Opus, lcw, Projector, BannerPlanner)

---

### [2026-05-27 — MD-001 kod entegrasyonu]

- **Kapsam:** LCW mockup ↔ Opus SDK
- **Yapılan:**
  - `lcw/js/opus-config.js`, `lcw/js/opus-integration.js` eklendi
  - 9 HTML sayfasına script referansları
  - `common.js`: add_to_cart, remove_from_cart, category_click, consent_granted
  - `lcw/README.md` Opus çalıştırma notları
- **Bekleyen:** T1–T6 tarayıcı testi (Opus API `npm run dev:api` + LCW `python -m http.server 8080`)
- **Test komutu:** Konsolda `localStorage.getItem('opus_anon')`; Network'te `/api/v1/events` POST

---

### [2026-06-01 — BannerPlanner ↔ LCW koordinasyon iskeleti]

- **Kapsam:** BannerPlanner vitrin çıktılarının LCW'de gösterilmesi (MD-003)
- **Yapılan:**
  - `BANNER_LCW_INTEGRATION.md` (master)
  - `BannerPlanner/AGENT_SYNC.md`, `lcw/AGENT_SYNC.md` — agent bildirim günlükleri
  - `BannerPlanner/docs/LCW_EXPORT.md`, `lcw/docs/BANNER_FEED.md`
  - WORK_QUEUE MD-003, CHANGE_RADAR, proje kartları güncellendi
- **Kural:** Entegrasyon geliştirmesinde proje `AGENT_SYNC.md` tablosuna satır eklenir
- **Sonraki adım:** LCW hero için `banner-feed.js` + örnek `banner-export.json`

---

### [2026-06-04 — CMS HomePage → Layout strateji sinyali]

- **Kapsam:** CMS Editor simülasyonu (`C:\web\CMS`)
- **Gözlem:**
  - Homepage List/Edit UI simüle edildi (`js/homepage.js`, `homepage-records.json`)
  - Domain modelde Layout zaten `pageKey` / `viewKey` / `members[]` ile tanımlı; `layouts.json` içinde `lyt_home_default` mevcut
  - Ayrı Homepage entity'si Layout ile örtüşüyor — birleşim mümkün
  - BannerPlanner `ViewAssignment` (pageType: homepage) aynı hedefe işaret ediyor
- **Etki:**
  - CMS: MD-004 (P2) — Homepage modülünün Layout'a taşınması
  - BannerPlanner: **blokaj yok** — MD-003 ve planlama güncellemeleri öncelikli ilerleyebilir
- **Aksiyon:**
  - `CMS_HOME_LAYOUT_UNIFICATION.md` oluşturuldu
  - `CMS/AGENT_SYNC.md` günlük satırı eklendi
  - WORK_QUEUE MD-004 açıldı
  - PROJECT_INVENTORY + `projects/CMS.md` güncellendi
- **Sonraki adım:** CMS seed migrasyon taslağı; BannerPlanner MD-003 bağımsız devam

---

### [2026-06-06 — EPIM admin simülasyonu bootstrap]

- **Kapsam:** `C:\web\EPIM` — yeni proje
- **Yapılan:**
  - BannerPlanner admin kabuğu referans alınarak EPIM simülasyon iskeleti
  - Ürün Havuzu ekranı (filtre grid, sidebar menü, boş sonuç)
  - `AGENT_SYNC.md`, `projects/EPIM.md`, PROJECT_INVENTORY güncellendi
  - WORK_QUEUE **MD-008** — IIS port önerisi **3281**
- **Port envanteri:** BannerPlanner 3280, EPIM 3281, **Master Dev Dashboard 3282**, Pulse 3290, CMS dev 3010
- **Sonraki adım:** Master Development port onayı; IIS site tanımı

---

### [2026-06-06 — Master Development Dashboard]

- **Kapsam:** `_MasterDevelopment/Dashboard` — koordinasyon web arayüzü
- **Yapılan:**
  - BannerPlanner admin shell (header/sidebar/grid) master layout olarak kullanıldı
  - `/api/dashboard/snapshot` — her yenilemede WORK_QUEUE, AGENT_SYNC, SCAN_LOG parse
  - Proje kartları, öncelikli işler, gündem, fırsat hatırlatmaları, entegrasyon hatları
  - Dev server port **3282** *(3020 çakışması — IIS admin bandına alındı)*
- **Sonraki adım:** Periyodik tarama sonuçlarını SCAN_LOG'a yazdıkça dashboard otomatik yansır

---

### [2026-05-27 — MD-010 Lokalizasyon CMS ortaklaştırma]

- **Karar kaynağı:** Haftalık koordinasyon toplantısı (geçen hafta)
- **Konu:** Backoffice mobile lokalizasyon → CMS; Web bağımsız lokalizasyon süreci ortaklaştırma
- **Gerekçe:** Backoffice ülke başına ayrı DB; CMS ortak DB; mobile/web çift kaynak operasyon yükü
- **Aksiyon:**
  - WORK_QUEUE **MD-010** (P1) açıldı
  - `LOCALIZATION_CMS_UNIFICATION.md` oluşturuldu
  - MD-004 / MD-007 ile hizalama notu
- **Sonraki adım:** Backoffice + Web lokalizasyon envanteri

---

### [2026-05-27 — MD-011 LCW Next.js headless stratejisi]

- **Konu:** Web MVC → Next.js kurumsal hedef; LCW mockup Next.js ile yenileme
- **Hedef zincir:** CMS API (menü → homepage) ← LCW Next.js ← BannerPlanner→CMS publish gözlemi
- **Aksiyon:**
  - WORK_QUEUE **MD-011** (P1) açıldı
  - `LCW_NEXTJS_HEADLESS.md` faz planı
  - MD-001/003/007/010 ile hizalama
- **Sonraki adım:** Next.js LCW iskelet + CMS menü API taslağı

---

### [2026-06-03 — Pulse proje kaydı & favicon]

- **Kapsam:** `C:\web\Pulse` — site sağlık crawler
- **Yapılan:**
  - `AGENT_SYNC.md` açıldı; proje kartı `projects/Pulse.md`
  - PROJECT_INVENTORY, Dashboard registry, CHANGE_RADAR güncellendi
  - İş kodu **MD-009** — çoklu domain sağlık izleme
  - Favicon: header pulse logosu → `favicon.svg` (console 404 giderildi)
- **Port envanteri:** UI **3290**, Crawler API **3291**
- **Sonraki adım:** Opus alert entegrasyonu değerlendirmesi (MD-006)

---

### [2026-05-27 — MD-014 Opus Omni Postcheckout planlama]

- **Kapsam:** SMS/Push postcheckout — OTP, sipariş özeti, anket, fatura, iade QR, kombin
- **Yapılan:**
  - `OPUS_OMNI_POSTCHECKOUT.md` — faz planı, efor tablosu, Sprint 1–4 backlog (Jira-ready)
  - `WORK_QUEUE.md` MD-014 alt görevleri (Faz 0–4)
  - Dashboard registry + INTEGRATION_MAP §11
- **Sahipler:** CE UI Ersel · CE Backend Emre · Fulfilment omni order (kritik yol)
- **Sonraki adım:** Faz 0 workshop + Fulfilment omni order OpenAPI v0.1

---

### [2026-07-31 — Tam agent tarama & Dashboard senkron]

- **Kapsam:** Opus, LCW, CMS, BannerPlanner, Pulse, EPIM, Backoffice + Dashboard UI
- **AGENT_SYNC özeti (son dönem):**
  - **CMS / LCW (26–28 Tem):** Ürün kişiselleştirme editörü, katalog, player, Content API + LCW listing/modal → **MD-015**
  - **CMS / LCW (MD-011):** Menü + Homepage/Template/Component Read API + LCW tüketim (Faz 1–2) — WORK_QUEUE işaretlendi
  - **Opus:** MD-014 plan + KVKK/OTP kapsam + Proje takip (Excel/Jira)
  - **Pulse:** CMS menü tree client (10 Haz)
  - **Dashboard:** Backoffice kartı, ikon senkronu, `repo/` link düzeltmesi, `shell.js` INTEGRATIONS sözdizimi
- **Yeni iş / doküman:**
  - `EPIM_CMS_BOUNDARY.md` + **MD-016** (kategori EPIM / menü CMS)
  - WORK_QUEUE: **MD-009**, **MD-015**, **MD-016** eklendi; MD-011 alt görevler güncellendi
- **Dashboard:** `projects-registry.js` workIds/agenda/docs + `build-snapshot.js` yeniden üretim
- **Sonraki adım:** MD-015 UAT · MD-016 ekip onayı · MD-011 BP→CMS→LCW gözlem

---

### [2026-08-12 — Klasör yeniden adlandırma: MasterDevelopment]

- **Değişiklik:** `C:\web\_MasterDevelopment` → `C:\web\MasterDevelopment`
- **Kod:** Dashboard `server.js` / `build-snapshot.js` `MD_ROOT`; registry `card` yolları; CMS import scriptleri; Opus Documents path
- **Doküman:** `MASTER_COORDINATION.md`, AGENT_SYNC merkez linkleri, IIS `web.config` yorumu
- **Not:** IIS site fiziksel yolu `C:\web\MasterDevelopment\Dashboard` olmalı
- **Aksiyon:** `node scripts/build-snapshot.js` (Dashboard)
