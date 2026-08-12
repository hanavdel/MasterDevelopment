# EPIM ↔ CMS Sınır Dokümanı

**İş kodu:** MD-016 (P1)  
**Karar bağlamı:** 2026-07-31 — kategori ekibi “menüyü neden CMS’de yönetiyoruz?” sorusu  
**İlgili:** [`CMS/docs/category-tree-epim.md`](../CMS/docs/category-tree-epim.md) · MD-008 · MD-004 · MD-015

---

## Tek cümle

| Sistem | Soru |
|--------|------|
| **EPIM** | Hangi kategoriler var ve ürünler nereye bağlı? |
| **CMS** | Bu kategoriler vitrinde nasıl görünür (dil, platform, URL, menü sırası, içerik)? |

---

## RACI özeti

| Konu | EPIM | CMS Category Tree | CMS Menu |
|------|------|-------------------|----------|
| Parent-child taksonomi (`CategoryId`) | **R/A** | C (import) | C (eşleme) |
| Ürün–kategori ilişkisi | **R/A** | — | — |
| Ülke×dil SEO slug / yayın | C | **R/A** | I |
| Navigasyon sırası / platform (Web/App) | — | C | **R/A** |
| Kategori dışı link (kampanya, statik) | — | — | **R/A** |
| Homepage `categoryKey` eşlemesi | — | C | **R/A** (+ Homepage) |
| Ürün kişiselleştirme master (zone/mm) | Hedef A (ileride) | — | CMS editör + Read API (MD-015) |

---

## Hedef akış (çift kaynak yasak)

```
EPIM (tek kaynak CategoryId)
  ↓ Excel / API export
CMS Category Tree import (t-{id})
  ↓ salt okunur matching
CMS Menu + Homepage (categoryKey)
```

**Yapılmaz:** Parent-child yapısını CMS veya menüde yeniden kurmak.

---

## Menü ≠ kategori

Menü CMS’de kalır çünkü:
- Taksonomi dışı öğeler (kampanya, outlet, statik sayfa)
- Sıra sezon/kampanyaya göre değişir
- Platform ayrımı (Web / App / Super App) — ST-004 / BR-NAV
- Her öğe Homepage `categoryKey` ile hizalanmalı (BR-NAV-001)

---

## Çıkış kriteri (MD-016)

- [x] Sınır dokümanı yazıldı (bu dosya)
- [ ] Kategori + içerik ekibi onayı (RACI)
- [ ] EPIM export → CMS Category Tree import demo (MD-008 hattı)
- [ ] Menu Matching salt okunur doğrulama UI notu
- [ ] SCAN_LOG kaydı
