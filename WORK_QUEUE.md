# Work Queue

Projeler arası koordinasyon gerektiren aktif işler.

## Öncelik seviyeleri

- **P0** — Kritik entegrasyon / üretim engeli  
- **P1** — Yakın teslimat riski  
- **P2** — Planlı iyileştirme / teknik borç  

---

## MD-001 (P0) — Opus → LCW mockup entegrasyon ve test matrisi

| Alan | Değer |
|------|--------|
| Durum | **Açık** |
| Kaynak | Opus (`packages/sdk`, `apps/api`) |
| Hedef | LCW (`C:\web\lcw`) |
| Rehber | [`OPUS_LCW_INTEGRATION.md`](OPUS_LCW_INTEGRATION.md) |
| İş | MB-001 — [`../_MasterBusiness/WORK_QUEUE.md`](../_MasterBusiness/WORK_QUEUE.md), ST-001 |

### Alt görevler

- [ ] Opus API + admin çalışır durumda (port net: 3102) — yerelde doğrulanacak
- [x] LCW tüm şablon HTML'lere Opus yükleyici eklendi (`opus-config.js`, `opus-integration.js`)
- [x] `common.js`: `page_view` (SDK), `add_to_cart`, `remove_from_cart`, `category_click`, `consent_granted`
- [ ] Admin'den aktif kampanya → LCW'de popup görünür (T4)
- [ ] Test matrisi T1–T6 → `SCAN_LOG` sonuç satırları

**Çıkış kriteri:** SCAN_LOG'da başarılı test notu; bu maddede tüm alt görevler işaretli.

---

---

## MD-003 (P1) — BannerPlanner → LCW vitrin entegrasyonu

| Alan | Değer |
|------|--------|
| Durum | **Açık** (planlama) |
| Kaynak | BannerPlanner (`data/planning`, `exportData`) |
| Hedef | LCW mockup (hero / kategori banner) |
| Rehber | [`BANNER_LCW_INTEGRATION.md`](BANNER_LCW_INTEGRATION.md) |
| İş | MB-002 — ST-002, BR-CONTENT-001 |

### Alt görevler

- [ ] Export sözleşmesi netleştirildi (`BannerPlanner/docs/LCW_EXPORT.md`)
- [ ] LCW tüketim modülü (`lcw/docs/BANNER_FEED.md` → `js/banner-feed.js`)
- [ ] Homepage hero en az 1 BannerPlanner slide ile render
- [ ] Her iki projede `AGENT_SYNC.md` günlüğü güncel

**Çıkış kriteri:** LCW ana sayfada export edilen banner görünür; SCAN_LOG kaydı.

---

## MD-002 (P2) — BannerPlanner ↔ Opus campaign model eşlemesi

| Alan | Değer |
|------|--------|
| Durum | **Açık** |
| Kaynak | BannerPlanner `js/app.js` |
| Referans | Opus `schema.opus.json`, `data/tables/campaigns.json` |

### Alt görevler

- [ ] Banner alanları listelendi
- [ ] Opus campaign alanları ile eşleme tablosu
- [ ] Eksik/uyumsuz alanlar backlog notu

**Çıkış kriteri:** Eşleme tablosu (INTEGRATION_MAP veya proje kartına link).

---

## MD-004 (P1) — CMS Homepage domain hizalama + Global operasyon UX

| Alan | Değer |
|------|--------|
| Durum | **Açık** (planlama) |
| Öncelik | **P1** *(2026-06-03 — ST-004 iş gerekçesiyle P2→P1)* |
| Kaynak | CMS (`C:\web\CMS`) + **CMS üretim ekibi doğrulaması** |
| Rehber | [`CMS_HOME_LAYOUT_UNIFICATION.md`](CMS_HOME_LAYOUT_UNIFICATION.md) |
| İş | MB-004 — ST-004, BR-CONTENT-002, BR-NAV-001/002/003 |
| Handoff | [`../_MasterBusiness/Data/exports/cms-global-operations-20260603.md`](../_MasterBusiness/Data/exports/cms-global-operations-20260603.md), [`cms-menu-global-handoff-20260706.md`](../_MasterBusiness/Data/exports/cms-menu-global-handoff-20260706.md) |
| Playbook | [`../_MasterBusiness/Data/playbooks/cms-menu-global-complexity.md`](../_MasterBusiness/Data/playbooks/cms-menu-global-complexity.md) |
| Paralel hat | **MD-003 bloklanmaz** |

**Revizyon:** Homepage Layout'a birleştirilmez. Ülke × kategori × dil = 1 Homepage; Template `homePageId`; Component items = JSON. **Yeni:** Global yönetim modeline uygun filtre, toplu uygulama ve override UX (ST-004).

### Alt görevler

- [x] Domain doküman + seed (`homePageId`, country/lang/category) — CMS ekibi geri bildirimi
- [x] Homepage list filtreleri (ülke / dil — header bağlamı; kategori kolonu)
- [x] Template edit Home Pages → `homePageId` dropdown
- [x] Component items JSON editörü (entity değil)
- [ ] Global varsayılan + ülke override meta (BR-CONTENT-002)
- [ ] **Menü — Global Menu Master** + bağlam şeridi (BR-NAV-003)
- [ ] **Menü — toplu ülke/dil yayını** + etkilenen kayıt özeti (BR-NAV-001)
- [ ] **Menü — platform profili:** Web=Responsive varsayılan; App split gerekçeli (BR-NAV-002)
- [ ] **Menü — override filtresi / global diff listesi** (BR-NAV-003)
- [ ] BannerPlanner ViewAssignment ↔ Homepage alan eşlemesi

**Çıkış kriteri:** Homepage → Template → Component(items JSON) simülasyonda doğru; Global toplu senaryo ST-004 kabul kriterleri; SCAN_LOG kaydı.

---

## MD-007 (P1) — Content Publish Contract (BannerPlanner → CMS)

| Alan | Değer |
|------|--------|
| Durum | **Açık** (şema yazıldı) |
| Kaynak | BannerPlanner planlama export |
| Hedef | CMS üretim omurgası + LCW vitrin + Opus ölçüm |
| Rehber | [`CONTENT_PUBLISH_CONTRACT.md`](CONTENT_PUBLISH_CONTRACT.md) |
| Örnek | [`examples/cpc-v1-gr-kadin.json`](examples/cpc-v1-gr-kadin.json) |
| CMS önkoşul | MD-004 Faz 1 ✅ (Homepage, homePageId, componentPayload) |

### Alt görevler

- [x] CPC v1 şema + CMS güncel model doğrulaması
- [ ] BannerPlanner `exportCpc()` prototipi
- [ ] CMS import + `itemKey` zorunlu validasyon
- [ ] LCW render + `content_impression` / `content_click` (MD-003 ile)
- [ ] Opus content analytics raporu

**Çıkış kriteri:** Onaylı BP plan → CPC JSON → CMS seed/import → LCW’de görünür + Opus event’te `itemKey`.

---

## MD-005 (P2) — Opus site bazlı gezinti raporu (CMS + iç uygulamalar)

| Alan | Değer |
|------|--------|
| Durum | **Açık** (talep iletildi) |
| Kaynak | CMS + `shared/opus-client` (`cms_navigation` event’leri) |
| Hedef | Opus Admin Analytics / Navigation API |
| Agent günlüğü | [`Opus/AGENT_SYNC.md`](../Opus/AGENT_SYNC.md) |
| Site key | `cms_editor_dev_key` (CMS), `dev_site_key_change_me` (LCW) |

### Alt görevler

- [ ] Events ingest: `site_id` / siteKey her event’te çözümlensin
- [ ] `GET /api/v1/analytics/navigation` — site + userId filtreli kronoloji
- [ ] Admin UI: site seçici + kullanıcı gezinti raporu
- [ ] CMS preview oturumunda uçtan uca doğrulama

**Çıkış kriteri:** CMS editör navigasyonu Admin’de `cms_editor_dev_key` filtresiyle görünür.

---

## MD-006 (P2) — shared/opus-client + CMS preview Opus

| Alan | Değer |
|------|--------|
| Durum | **Tamamlandı** (2026-06-04) |
| Kaynak | `C:\web\shared\opus-client` |
| Hedef | CMS Layout editör preview |
| Rehber | [`shared/opus-client/README.md`](../shared/opus-client/README.md) |

### Alt görevler

- [x] Opus `sites.json`: `cms_editor_dev_key`
- [x] `shared/opus-client` loader + page context
- [x] CMS preview modu (`opus-preview.js`)
- [x] CMS dev server (monorepo kökü, port 3010)

---

## MD-008 (P2) — EPIM admin simülasyonu bootstrap + IIS port

| Alan | Değer |
|------|--------|
| Durum | **Açık** (bootstrap tamamlandı, port onayı bekleniyor) |
| Kaynak | `C:\web\EPIM` |
| Şablon | BannerPlanner admin kabuk |
| Agent günlüğü | [`EPIM/AGENT_SYNC.md`](../EPIM/AGENT_SYNC.md) |

### Alt görevler

- [x] Proje iskeleti (`index.html`, shell CSS, menü, routing)
- [x] Ürün Havuzu referans ekranı (filtre grid + boş sonuç)
- [x] `AGENT_SYNC.md` + proje kartı (`projects/EPIM.md`)
- [ ] **IIS site portu onayı** — önerilen: **3281** (BannerPlanner 3280, Pulse 3290)
- [ ] İlk entegrasyon hattı tanımı (CMS kategori / üretim EPIM API mock)

**Çıkış kriteri:** IIS'te `http://localhost:3281/` üzerinden simülasyon erişilebilir; port envanterde kesinleşmiş.

---

## MD-010 (P1) — Mobile lokalizasyon → CMS ortaklaştırma (Backoffice + Web)

| Alan | Değer |
|------|--------|
| Durum | **Açık** (planlama) |
| Karar | 2026-05 haftalık toplantı — Backoffice mobile lokalizasyon CMS'e; Web bağımsız süreç ortaklaştırılacak |
| Gerekçe | Backoffice ülke başına ayrı DB; CMS ortak DB — kolay ortaklaştırılabilir parametrelerde mobile/web çift kaynak ek iş yükü |
| Kaynak | Backoffice mobile lokalizasyon (ülke DB'leri) + Web bağımsız lokalizasyon kaynağı |
| Hedef | CMS ortak parametre havuzu → mobile + web tüketimi |
| Rehber | [`LOCALIZATION_CMS_UNIFICATION.md`](LOCALIZATION_CMS_UNIFICATION.md) |
| İlişki | MD-004 (global locale UX), MD-007 (`cultureKey` ayrımı), BR-CONTENT-002 |
| Paralel hat | **MD-003 / MD-007 bloklanmaz** |

### Alt görevler

- [ ] Backoffice mobile lokalizasyon envanteri (parametre listesi, ülke DB eşlemesi)
- [ ] Web bağımsız lokalizasyon / config kaynak envanteri
- [ ] Ortaklaştırılabilir vs platform-özel parametre sınıflandırması
- [ ] CMS hedef model taslağı (global default + ülke/dil override)
- [ ] CMS simülasyon modülü taslağı (`cms-context.js` locale filtreleri ile)
- [ ] Migrasyon / read path geçiş planı (Backoffice write kapanışı)
- [ ] Üretim CMS ekibi handoff + onay

**Çıkış kriteri:** Envanter + model taslağı + simülasyonda örnek ortak parametre seti; SCAN_LOG kaydı.

---

## MD-011 (P1) — LCW Next.js headless vitrin + CMS API tüketimi

| Alan | Değer |
|------|--------|
| Durum | **Açık** (Faz 1–2 API + LCW tüketim hazır; cutover / BP gözlem bekliyor) |
| Hedef | Web altyapısı MVC → Next.js geçişine hazırlık; LCW mockup yenileme |
| Strateji | Önce Next.js LCW → CMS API (menü → homepage) → BP→CMS→LCW gözlem hattı |
| Gerekçe | Deneyim + üretim mimarisine yakın simülasyon; BannerPlanner→CMS etkisini vitrinde gözlem |
| Rehber | [`LCW_NEXTJS_HEADLESS.md`](LCW_NEXTJS_HEADLESS.md) · [`CMS_READ_API.md`](CMS_READ_API.md) |
| İlişki | MD-001 (Opus), MD-003 (geçici export), MD-004/007 (CMS veri), MD-010 (locale), MD-015 (perso API) |
| Paralel hat | **MD-001 / MD-003 kısa vade bloklanmaz** — statik mockup geçiş süresince kalabilir |

### Alt görevler

- [x] Next.js App Router iskelet + mevcut sayfa parity (header/footer/ana sayfa)
- [ ] Opus SDK Next.js layout entegrasyonu (MD-001 kuralları)
- [x] CMS Read API — **menü** endpoint (BR-NAV-001, `menu-trees/`)
- [x] LCW Next.js menü tüketimi (locale: country + lang) + yerel fallback
- [x] Homepage + Template + Component + page bundle API (CPC/MD-007 uyumlu)
- [x] LCW `page-content.js` opsiyonel CMS tüketimi
- [ ] BannerPlanner → CMS publish → LCW vitrin gözlem senaryosu (MD-007 Faz 4)
- [ ] Statik mockup cutover / port envanteri kararı

**Çıkış kriteri:** Next.js LCW menü+homepage CMS API’den render; BP→CMS→LCW uçtan uca en az 1 planlama senaryosu gözlemlendi; SCAN_LOG kaydı.

---

## MD-014 (P1) — Opus Omni Postcheckout

| Alan | Değer |
|------|--------|
| Durum | **Planlama** — Faz 0 başlangıç |
| Kaynak | [`Documents/Opus/Opus Omni Postcheckout.txt`](Documents/Opus/Opus%20Omni%20Postcheckout.txt) |
| Rehber | [`OPUS_OMNI_POSTCHECKOUT.md`](OPUS_OMNI_POSTCHECKOUT.md) |
| Sahip | Customer Engagement — UI Ersel, Backend Emre |
| Paralel ekipler | Fulfilment (omni order, fatura, QR), Customer (CRM/üyelik), CE-AI (kombin) |
| İlişki | MD-001 (Opus events), MD-012 (consent), MD-005 (site raporu) |

### Kapsam özeti

SMS/Push link → Opus domain OTP → modüler postcheckout (sipariş özeti, anket, fatura, iade QR, kombin, iletişim, üyelik CTA).

### Alt görevler — Faz 0 (2–3 hafta)

- [ ] Omni order OpenAPI v0.1 (Fulfilment)
- [ ] OTP akış + güvenlik spec (CE Backend)
- [ ] Anket kararı: Opus survey inline (CE + ürün)
- [ ] Wireframe + modül feature flags (CE UI)
- [ ] Faz 0 workshop çıktısı → SCAN_LOG

### Alt görevler — Faz 1 MVP TR e-ticaret (8–10 hafta)

- [ ] Postcheckout SPA iskeleti (`Opus/apps/postcheckout`)
- [ ] OTP API + session (CE Backend)
- [ ] Sipariş özeti UI + BFF → Fulfilment omni order
- [ ] Anket inline (Opus survey SDK/API)
- [ ] Trigger: order/delivery → SMS link
- [ ] E2E test T1–T6 → SCAN_LOG

### Alt görevler — Faz 2–4 (planlı)

- [ ] e-Arşiv + iade QR (Fulfilment + CE UI)
- [ ] Kombin (EComAI), iletişim/üyelik (Customer)
- [ ] Mağaza kanalı + çoklu ülke
- [ ] Üretim deploy + admin trigger şablonları

**Çıkış kriteri (MVP):** TR e-ticaret siparişi → SMS → OTP → sipariş özeti + anket → Opus admin raporu; UAT T1–T6 geçti.

**Tahmini efor:** CE UI 85–95 PD · CE Backend 75–90 PD · Fulfilment 90–110 PD (detay: `OPUS_OMNI_POSTCHECKOUT.md`).

---

## MD-009 (P2) — Pulse çoklu domain site sağlık izleme

| Alan | Değer |
|------|--------|
| Durum | **Açık** (UI + crawler API canlı; Opus alert opsiyonel) |
| Yol | `C:\web\Pulse` |
| Port | UI **3290** · API **3291** |
| İlişki | CMS menü tree doğrulama · MD-006 Opus alert değerlendirmesi |

### Alt görevler

- [x] BannerPlanner kabuğu + MBA site envanteri (21 ülke)
- [x] Node crawler API + canlı progress / raporlar
- [x] Ülke detay: dil bazlı tarama, menü/banner link, CMS menü tree client
- [ ] Opus alert hattı değerlendirmesi (MD-006)
- [ ] Periyodik tarama zamanlayıcı / üretim runbook

**Çıkış kriteri:** Periyodik tarama + en az 1 kritik alert yolu; SCAN_LOG.

---

## MD-015 (P1) — Ürün kişiselleştirme (CMS editör → LCW vitrin)

| Alan | Değer |
|------|--------|
| Durum | **Açık** (editör + katalog + player + Read API + LCW listing/modal hazır) |
| Gerekçe | Zone/mm enrichment ve müşteri önizleme CMS’de; vitrin LCW’de; master veri uzun vadede EPIM |
| Rehber | `CMS/docs/personalization-*.md` · `lcw/docs/cms-personalization.md` |
| İlişki | MD-011 (content API), MD-008 / MD-016 (EPIM sınır) |

### Alt görevler

- [x] CMS Ürün Kişiselleştirme editörü (zone canvas, px↔mm, çoklu görsel)
- [x] Kişiselleştirme Kataloğu (font/ikon/renk + printMetrics)
- [x] Personalization Player (müşteri önizleme iskeleti)
- [x] Content API `GET /api/v1/content/personalization*`
- [x] LCW listing + PDP modal CMS tüketimi + local fallback
- [ ] EPIM master veri / sync sözleşmesi (MD-016 ile)
- [ ] Üretim CMS ↔ stüdyo/print pipeline hizası
- [ ] UAT: TR listing → modal → preview ölçü doğrulama

**Çıkış kriteri:** CMS kapalıyken LCW fallback; CMS açıkken listing+modal canlı; EPIM sınır notu onaylı.

---

## MD-016 (P1) — EPIM ↔ CMS kategori / menü sınır netleştirme

| Alan | Değer |
|------|--------|
| Durum | **Açık** (doküman yazıldı — ekip onayı bekleniyor) |
| Gerekçe | Kategori ağacı EPIM’de, menü CMS’de; çift elle kurulum operasyon yükü |
| Rehber | [`EPIM_CMS_BOUNDARY.md`](EPIM_CMS_BOUNDARY.md) · `CMS/docs/category-tree-epim.md` |
| İlişki | MD-008 (EPIM), MD-004 (global menu), MD-015 (perso sahiplik) |

### Alt görevler

- [x] Sınır dokümanı + RACI taslağı
- [ ] Kategori + içerik ekibi onayı
- [ ] EPIM export → CMS Category Tree import demo
- [ ] Menu Matching salt okunur doğrulama notu / UI
- [ ] SCAN_LOG kapanış kaydı

**Çıkış kriteri:** Onaylı RACI; parent-child tek kaynak EPIM; menü CMS’de kalır, `CategoryId`/`t-{id}` ile bağlı.

---

## İptal edilen işler

### ~~MD-002 (eski)~~ — Projector ↔ Projector - Copy drift

**İptal:** `Copy` adlı klasörler yedek kabul edilir; koordinasyon kapsamı dışı.

---

## Tamamlanan işler

_(Henüz yok)_
