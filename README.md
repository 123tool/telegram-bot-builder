## ⚙️ Telegram Bot Builder Platform

A premium quality, clean-architecture, enterprise-grade, and lightweight self-hosted **Telegram Bot Builder** platform written in **Node.js**. Built explicitly with optimization patterns required to run flawlessly on Android local environments via **Termux**. 

Developed with a sophisticated, unified single-dashboard system that handles automated database management, dynamic manual commands, granular event handling, mass broadcasting, and robust continuous integration with cutting-edge AI engines like OpenAI and Google Gemini.

---

## 🌟 FITUR UTAMA

* **Termux Persistent Native Optimization:** Menggunakan basis database NoSQL berbasis file lokal RAM-buffered (`LokiJS`) yang tidak memerlukan memory-overhead besar seperti PostgreSQL, MongoDB atau MySQL, menjamin kestabilan performa 100% di Termux tanpa lag.
* **Dynamic Command Manual Builder:** Membantu pembuatan / command telegram khusus (seperti `/menu`, `/harga`, dll) dengan respon teks langsung secara realtime.
* **Auto-Response Trigger System:** Kemampuan mendeteksi pesan tekstual biasa dari pelanggan dan membalasnya secara instan sesuai skenario yang Anda tentukan di panel.
* **Interactive Inline Button Generator:** Menempelkan tombol navigasi eksternal (Link URL) maupun internal Callback data ke dalam pesan respon secara fleksibel.
* **Smart AI Autopilot Integration:** Dilengkapi modul jembatan penghubung AI untuk OpenAI (GPT-4o-Mini), Google Gemini Pro, atau Custom Webhook URL pihak ketiga, sehingga bot dapat menjawab pertanyaan rumit secara otomatis saat Command manual tidak ada yang cocok.
* **Integrated CRM Subscriber Storage:** Menyimpan data metadata profile akun Telegram pengguna secara otomatis tepat pada saat mereka menekan tombol `/start`.
* **Mass Push Broadcast Marketing Engine:** Modul pengiriman pesan blast pengumuman massal ke seluruh baris database pengguna yang tersimpan dengan mekanisme anti-rate-limit delay injection (50ms).
* **Interactive Automation Management Shell:** Menyediakan file eksekusi instan `start.sh` untuk menyalakan/mematikan background process server secara aman menggunakan perintah menu interaktif yang inter-operable.

---

## 🚀 INSTALASI
​Silahkan buka aplikasi Termux Anda, pastikan koneksi internet stabil (Data paket / Wi-Fi), lalu jalankan rentetan baris perintah perintah environment setup berikut satu per satu :

1. Update repo dan paket core linux termux
```
pkg update -y && pkg upgrade -y
```
2. Install dependensi program dasar yang dibutuhkan (Node.js & Git)
```
pkg install nodejs -y
pkg install git -y
```
3. Buat folder proyek atau clone dari repositori github anda
```
mkdir telegram-builder && cd telegram-builder
```
4. Taruh semua source code file proyek ke dalam folder ini sesuai strukturnya. (Set permission file automasi shell script agar dapat dieksekusi secara native)
```
chmod +x start.sh
```
5. Install modul package manager dependencies npm
```
npm install
```

## ⚙️ MENJALANKAN (RUN / CONTROL)
​Aplikasi telah dilengkapi bash script management control panel interaktif yang mempermudah mengelola siklus hidup background server secara mandiri.

​Jalankan perintah ini di root direktori proyek Anda :
```
./start.sh
```

## Pilihan Menu :
1. ​Pilih Angka 1 (ON): Untuk menghidupkan server di background menggunakan utility nohup. Anda bisa menutup Termux atau mematikan layar HP Anda tanpa khawatir proses mati selama Wi-Fi/Paket Data hidup terus dan optimasi baterai Android untuk Termux di-disable.
2. ​Pilih Angka 2 (OFF): Menghentikan paksa seluruh service background process node.js dengan aman guna menghindari database corrupt.
3. ​Pilih Angka 3 (EXIT): Keluar dari interaksi menu start script.

## ​Setelah dinyalakan, buka browser di HP Anda (Chrome / Kiwi Browser / Mozilla) dan akses URL Dashboard berikut :
- ​Akses dari HP internal yang sama :
  ```
  http://localhost:3000
- ​Akses via IP Jaringan Lokal (Satu Wifi):
  ```
  http://IP_TERMUX_ANDA:3000

## ​🛠️ TROUBLESHOOTING & PENANGANAN MASALAH

- ​Masalah 1: Bot Tiba-tiba Mati di Latar Belakang saat Layar HP Terkunci
- ​Solusi : Sistem Android menerapkan manajemen baterai agresif. Tarik bar notifikasi Termux Anda ke bawah, klik "Acquire Wakelock" agar CPU Android tetap diizinkan berjalan tinggi saat kondisi layar padam. Dan pastikan aplikasi Termux Anda diatur ke mode "Don't Optimize" di pengaturan Baterai Android.

- ​Masalah 2 : Error Token Invalid setelah Menyimpan Token Baru
- ​Solusi : Pastikan token yang Anda salin dari @BotFather bersih dari spasi di awal atau akhir kata. Cukup simpan ulang konfigurasi dari web dashboard dan matikan lalu hidupkan kembali engine bot melalui tombol kontrol di Dashboard.

- ​Masalah 3 : Log Server Mengalami Kendala
- ​Solusi : Jika terjadi error sintaks atau runtime tak terduga, jalankan pengecekan dump log secara berkala pada file otomatis server.log dengan perintah bash: cat server.log.
