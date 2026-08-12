# Kimlik Bağlantısı: LCW mockup ↔ Opus unified_profiles

## Mevcut alanlar (tarayıcı)

| localStorage | Anlamı | Opus karşılığı |
|--------------|--------|----------------|
| `opus_anon` | SDK anonim UUID | `unified_profiles.opus_guid` (aynı değer) |
| `lcw-user` | LCW mockup giriş (`id`, `email`, …) | `unified_profiles.user_id` + `email` |

## Hedef model

```
[Ziyaretçi]
  opus_anon oluşur (SDK)
       ↓
  unified_profiles.opus_guid = opus_anon
       ↓
[İsteğe bağlı giriş]
  lcw-user.id → Opus.identify()
       ↓
  Aynı profil satırına user_id yazılır (merge)
```

## API tarafı (uygulandı)

`POST /api/v1/events` her kayıtta `resolveOrCreateProfile()` çalıştırır:

- Anonim: `opus_guid` = `anonymousId` (`opus_anon`)
- `identify` / giriş: `user_id` = LCW kullanıcı `id`; varsa anonim profil yükseltilir

Dosya: `Opus/apps/api/src/identity/resolveProfile.js`

## LCW tarafı (uygulandı)

- Sayfa yükü: `opus-integration.js` → giriş varsa `Opus.identify(lcwUser.id, …)`
- Giriş/kayıt: `auth.js` → `setCurrentUser` → `lcwOpusIdentify(user)`

## Giriş sonrası tek GUID (düzeltme)

**Sorun:** `identify` anonim profil oluşmadan çalışırsa ikinci bir `opus_guid` üretilir; `opus_anon` güncellenmez.

**Çözüm:**
- API: girişte `opus_guid` = `anonymousId` (birleştirme veya yeni kayıt)
- SDK + LCW: `identify` yanıtındaki `opus_guid` → `localStorage.opus_anon`
- LCW: `identify` tamamlanmadan `page_view` gönderilmez

Mevcut çift kayıt için: API yeniden başlatıp çıkış/giriş yapın veya Admin’den anonim satıra `user_id` taşıyıp diğer satırı silin.

## Merge sırasında events ve diğer tablolar

Profil birleşince (`merged_away` satır → canonical `opus_guid`) şunlar da taşınmalı:

| Tablo | Alan |
|-------|------|
| `events` | `opus_guid` (+ `opus_guid` null olanlar `anonymous_id` ile eşleşirse doldurulur) |
| `impressions` | `opus_guid` |
| `push_subscriptions` | `opus_guid` |
| `device_records`, `consent_records`, … | `opus_guid` |

Uygulama: `reassignOpusGuid(from, to)` — `mergeIntoAnonymous` içinde otomatik çağrılır.

## Admin’de doğrulama

1. LCW’yi açın, birkaç event tetikleyin (`page_view`, sepet).
2. Opus Admin → **Data** → `unified_profiles`: `opus_guid` = Application’daki `opus_anon`.
3. Giriş yapın → aynı satırda `user_id` = `lcw-user.id`, `email` dolu olmalı.
4. **events** tablosunda `opus_guid` artık null olmamalı.

## İleride (PostgreSQL / CDP)

- `device_records`: cihaz / push token
- `identity_links`: farklı GUID birleşimleri (manuel merge)
- `merged_into_guid`: tam birleşme sonrası eski profil
