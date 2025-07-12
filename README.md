# Sohbet Uygulaması

Kullanıcıların odalara girerek gerçek zamanlı mesajlaşabildiği, basit bir web tabanlı sohbet uygulaması. Her oda kendi kullanıcı ve mesaj geçmişine sahiptir. Kullanıcılar oda adı ve takma ad (nickname) ile giriş yapar, anlık olarak mesajlaşabilir ve oda içindeki diğer çevrimiçi kullanıcıları görebilir.

---

## Özellikler

- Gerçek zamanlı mesajlaşma (Socket.io)
- Odaya göre izole sohbet ve kullanıcı listesi
- Mesaj geçmişi kaydı (oda bazlı)
- Kullanıcı adı ile katılım ve online kullanıcı listesi
- Modern, responsive istemci arayüzü

---

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

---

## Çalıştırma

### Geliştirme için:
```sh
node server.js
```
veya
```sh
npm start
```
Sunucu ardından [http://localhost:3000](http://localhost:3000) adresinde çalışır.

---

## Dosya Yapısı

```
/
├── server.js             # Express ve Socket.io sunucu kodu
├── messages_*.json       # Oda başına mesaj geçmişi (otomatik oluşur)
├── public/
│   ├── index.html        # İstemci arayüzü
│   ├── client.js         # İstemci tarafı socket kodları
│   └── style.css         # Stil dosyası
├── package.json
└── ...
```

---

## Mimari Genel Bakış

- **Sunucu (Node.js/Express):**
  - Socket.io ile gerçek zamanlı mesajlaşma sağlar.
  - Her oda için kullanıcıları ve mesaj geçmişini yönetir; mesaj geçmişi dosyada tutulur.
  - SPA (Single Page Application) mantığıyla oda URL’sini yakalar ve istemciye index.html’i döner.

- **İstemci (HTML/JS/CSS):**
  - Kullanıcıdan oda adı ve takma ad alır.
  - Mesaj gönderme/alma, kullanıcı listesini görüntüleme.
  - Mesajlar ve kullanıcı hareketleri anlık gösterilir.

---

## Ortam Değişkenleri

Varsayılan olarak `.env` dosyası gerekmiyor. Ancak port değiştirmek isterseniz:

```env
PORT=3000
```

Örnek dosya için bkz: [.env.example](./.env.example)

---

## Deployment

Projeyi Vercel, Render, Netlify, Heroku veya benzeri bir platformda deploy edebilirsiniz.

### Manuel Deployment (ör. Render):

1. Yeni bir Node.js web servis projesi oluşturun.
2. Repoyu bağlayın veya manuel olarak yükleyin.
3. Gerekirse ortam değişkenlerini ayarlayın (örn. PORT).
4. `npm install` ve ardından `node server.js` komutlarıyla başlatın.

> **Canlı Demo:** [https://sohbet-uygulamasi.onrender.com](https://sohbet-uygulamasi.onrender.com) <!-- Kendi canlı linkinizi ekleyin! -->

---

## Sıkça Sorulan Sorular

**S: Oda sayfasına doğrudan gidersem neden çalışıyor?**  
C: Sunucu, `/public/index.html` dosyasını dinamik olarak tüm oda URL’leri için döner. SPA mantığı ile istemci route işlemini kendisi yönetir.

**S: Mesajlar kayboluyor mu?**  
C: Her oda için mesajlar sunucuda `messages_{oda_adi}.json` dosyasında saklanır. Sunucu yeniden başlatılırsa bu dosyalar silinmedikçe mesajlar korunur.

---

## Katkı

Katkı yapmak için fork’layıp PR (Pull Request) açabilirsiniz.

---

## Lisans

MIT