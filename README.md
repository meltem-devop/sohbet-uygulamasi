# Sohbet Uygulaması

Basit, gerçek zamanlı bir sohbet uygulaması. Kullanıcılar isimleriyle katılıp mesajlaşabilir, online kullanıcı listesini görebilir.

## Kurulum

1. **Projeyi klonla:**
   ```sh
   git clone https://github.com/kullanici_adi/proje_adi.git
   cd proje_adi
   ```
2. **Bağımlılıkları yükle:**
   ```sh
   npm install
   ```

## Çalıştırma

### Geliştirme için:

```sh
node server.js
```

Sunucu ardından `http://localhost:3000` adresinde çalışır.

## Dosya Yapısı

- `server.js`: Express ve Socket.io sunucu kodu.
- `public/`
  - `index.html`: İstemci arayüzü
  - `client.js`: İstemci tarafı socket kodları
  - `style.css`: Stil dosyası

## Mimari Genel Bakış

- **Sunucu (Node.js/Express)**:
  - Socket.io ile gerçek zamanlı mesajlaşma sağlar.
  - Kullanıcılar ve mesaj geçmişini yönetir.
- **İstemci (HTML/JS/CSS)**:
  - Mesaj gönderme/alma, kullanıcı listesini görüntüleme.
  - Kullanıcı adı ile giriş yapılır, mesajlar ve kullanıcı hareketleri anlık gösterilir.

## Ortam Değişkenleri

Varsayılan olarak `.env` dosyası gerekmiyor. Ancak port değiştirmek isterseniz:

```env
PORT=3000
```

Örnek dosya için bkz: [.env.example](./.env.example)

## Deployment

Projeyi [Vercel/Render/Netlify/Heroku] gibi bir platformda deploy edebilirsiniz.

### Manuel Deployment (ör. Render):

1. Yeni bir Node.js web servis projesi oluştur.
2. Repoyu bağla veya manuel olarak yükle.
3. Gerekirse ortam değişkenlerini ayarla (örn. PORT).
4. `npm install` ve `node server.js` komutlarıyla çalıştır.

> **Canlı Demo:** [https://sohbet-uygulamasi.onrender.com](https://sohbet-uygulamasi.onrender.com) <!-- buraya kendi canlı linkini ekle! -->

## Otomasyon (CI/CD)

Eğer platform otomatik deploy destekliyorsa, ana branch’e push ile otomatik yayına alınır. Manuel adımlar yukarıda açıklanmıştır.
