# Makefile for family-expense-tracker
# Çeşitli kurulum ve çalıştırma işlemlerini kolaylaştırır.

# Varsayılan hedef (örn. "make" yazıldığında çalışır)
default: start

# Paketleri yükler (node_modules klasörünü oluşturur)
install:
	npm install

# Expo CLI'yi kullanarak uygulamayı başlatır (QR kodu ve web arayüzü sunar)
start: install
	npx expo start

# Android emülatörü veya cihazında çalıştırmak için
android: install
	npx expo start --android

# iOS simülatörü veya cihazında çalıştırmak için (macOS gerektirir)
ios: install
	npx expo start --ios

# Uygulamayı tarayıcıda çalıştırmak için
web: install
	npx expo start --web

# node_modules klasörünü siler ve önbelleği temizler
clean:
	rm -rf node_modules
	npm cache clean --force
