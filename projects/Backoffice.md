# Backoffice Simülasyonu

**Yol:** `C:\web\Backoffice`  
**Tip:** Statik admin arayüz simülasyonu (CMS shell türevi)  
**Koordinasyon:** [`AGENT_SYNC.md`](../Backoffice/AGENT_SYNC.md)

## Amaç

Üretim LCW Backoffice ortamının menü yapısını ve temel admin kabuğunu yerelde simüle etmek. CMS Editor (`C:\web\CMS`) Admin arayüzünden shell elementleri alınmış; sidebar menüsü üretim ekran görüntülerine göre değiştirilmiştir.

## Port

| Ortam | Port | Not |
|-------|------|-----|
| Dev server (`npm start`) | **3479** | `server.js` |
| IIS (önerilen) | **3479** | `web.config` — CMS (3458), Dashboard (3282) ile çakışmaz |

## Çalıştırma

```powershell
cd C:\web\Backoffice
npm start
# → http://127.0.0.1:3479/
```

IIS: Site fiziksel yolu `C:\web\Backoffice`, binding port **3479**.

## Menü envanteri (simülasyon)

Düz liste — üretim Backoffice ile aynı sıra:

1. Yetki Talep Yönetimi  
2. Kampanya Yönetimi  
3. Üye Bilgileri Yönetimi  
4. OTP Saatlik Limit Yönetimi  
5. Sipariş Yönetimi  
6. İade Yönetimi  
7. Ödeme Yönetimi  
8. Sevkiyat Yönetimi  
9. İçerik Yönetimi  
10. Zamanlanmış Görev Yönetimi  
11. Ürün Yönetimi  
12. Mobil Panel → Konfigürasyon, Uygulamalar, Çeviriler  
13. Omnichannel  
14. Yorum Moderasyon  
15. Fatura Yönetimi  
16. Log Yönetimi  

## İlişkili master işler

| ID | Konu |
|----|------|
| MD-010 | Mobile lokalizasyon Backoffice → CMS |
| MD-004 | CMS Homepage / Layout modeli |

## Agent sync

Geliştirme sonrası [`AGENT_SYNC.md`](../Backoffice/AGENT_SYNC.md) günlüğüne satır ekleyin.
