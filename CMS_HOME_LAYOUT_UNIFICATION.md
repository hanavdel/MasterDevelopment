# CMS Homepage Domain — Üretim Doğrulaması

**Tarih:** 2026-06-04 (güncelleme: CMS ekibi geri bildirimi)  
**Kaynak:** CMS Editor simülasyonu + **CMS üretim ekibi**  
**Hedef agent:** `MasterDevelopment`  
**İş kodu:** MD-004 (P2)

---

## Özet (revize)

~~Homepage → Layout birleştirme~~ **geri çekildi.**

CMS ekibi doğrulaması:

1. **Homepage** her **ülke × kategori ana sayfası × dil** için **1 adet** ayrı entity'dir.
2. **Template**'ler Homepage'e **`homePageId`** ile bağlanır; homepage başına 1 veya isteğe bağlı birden fazla template olabilir.
3. **Component Item**'lar ayrı entity değil; component altında **JSON** olarak tutulur.

**Layout** (simülasyon editörü) runtime önizleme / BannerPlanner hizası içindir; Homepage'in yerine geçmez.

**Paralellik:** BannerPlanner (MD-003) CMS model netleşmesini beklemeden ilerleyebilir.

---

## Üretim modeli

```
Ülke × Kategori × Dil
  └── Homepage (1)
        └── Template (1..n)     homePageId FK
              └── Component     entity
                    └── items[] JSON (entity DEĞİL)
```

### Homepage örneği (Greece / Greek)

| id | categoryKey | name |
|----|-------------|------|
| 107 | `kadin` | ΓΥΝΑΙΚΕΣ |
| 110 | `erkek` | ΑΝΔΡΕΣ |
| 106 | `cocuk` | ΠΑΙΔΙ |
| 108 | `home` | ΑΡΧΙΚΗ ΣΕΛΙΔΑ |

Aynı ülke+dil altında **farklı kategoriler** = farklı homepage kayıtları.

### Template ↔ Homepage

- Edit Template ekranı: "Home Pages" = `homePageId` seçimi (`LCW HOME` → id 108 gibi).
- Aynı `homePageId` altında birden fazla template (farklı dil/ülke/publish penceresi) mümkün.

### Component items

```
Component (tablo/entity)
  commonData: { layoutType, … }
  localizedData[culture].items[]: [ { imageUrl, linkUrl, … } ]   ← JSON
```

Item için ayrı CRUD / tablo yok.

---

## Simülasyon ↔ üretim eşlemesi

| Üretim | Simülasyon dosya/alan |
|--------|------------------------|
| Homepage | `homepage-records.json` — `countryCode`, `langCode`, `categoryKey` |
| Template.homePageId | `template-v5-records.json` — `homePageId` |
| componentJson | `template.members[]` |
| localizedData.items | `component.items[]` (JSON) |
| Layout (runtime) | `layouts.json` — önizleme only |

---

## MD-004 güncel alt görevler

- [x] CMS ekibi geri bildirimi domain dokümana işlendi
- [ ] `homepage-records.json` v2 — ülke/kategori/dil boyutları (seed güncellendi)
- [ ] `template-v5-records.json` — `homePageId` FK (seed güncellendi)
- [ ] Homepage list UI — filtre: ülke + dil (header seçicileri ile hizalı)
- [ ] Template edit — Home Pages dropdown `homePageId` ile homepage listesinden
- [ ] Component edit — items JSON editörü (entity listesi değil)
- [ ] BannerPlanner `ViewAssignment`: `viewKey` ≈ `categoryKey`, `pageType: homepage`
- [ ] Layout editör: Homepage modelinden **ayrı** tut; runtime preview rolü netleştir

**Çıkış kriteri:** Simülasyon üç katmanı doğru yansıtır: Homepage (entity) → Template (homePageId) → Component (items JSON).

---

## BannerPlanner ile ilişki

| BannerPlanner | CMS üretim |
|---------------|------------|
| `ViewAssignment.viewKey` | `homepage.categoryKey` |
| `ViewAssignment.pageType: homepage` | Homepage entity |
| `TemplatePlan` | Template + `homePageId` |
| `ComponentPlan.payloadDraft` | Component + items JSON |

---

## Referans

| Dosya | Yol |
|-------|-----|
| Domain (güncel) | `C:\web\CMS\docs\domain-model.md` |
| Homepage seed | `C:\web\CMS\data\config\homepage-records.json` |
| Template seed | `C:\web\CMS\data\config\template-v5-records.json` |
| AGENT_SYNC | `C:\web\CMS\AGENT_SYNC.md` |

---

## Onay

- [x] CMS ekibi model doğrulaması (2026-06-04)
- [x] MD-004 hedefi revize edildi — Homepage ayrı entity kalır
- [ ] UI/seed tam hizalama (filtre, dropdown, items JSON editörü)
