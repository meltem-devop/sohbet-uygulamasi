# Resmi Node.js 18 tabanlı bir imaj kullanılır
FROM node:18

# Uygulama dizinini oluştur ve çalışma dizini olarak ayarla
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --production

# Tüm uygulama dosyalarını kopyala
COPY . .

# Uygulamanın dinleyeceği portu belirt (Render/Vercel gibi servisler için)
EXPOSE 3000

# Uygulamayı başlat
CMD [ "node", "server.js" ]