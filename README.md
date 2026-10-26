# KEJARAN PAK WAHID! 🏃‍♂️💨👨‍🏫
### *"Nongkrong Boleh, Ketahuan Jangan!"*

Game web 3D Endless Runner semi-realistis bertema sekolah Indonesia di **SMA Negeri 1 Pasir Sakti, Lampung, Indonesia**.

Dibuat menggunakan **Three.js, WebGL, HTML5, CSS3, dan JavaScript ES Modules**, dioptimalkan khusus untuk desktop dan smartphone Android dengan kontrol layar sentuh responsif serta siap dideploy gratis ke **GitHub Pages**.

---

## 📸 Referensi Visual & Karakter

1. **Karakter Siswa (Pemain):**
   - Kemeja batik lengan pendek berwarna dasar merah marun dengan motif batik tradisional putih dan kuning keemasan (sesuai Foto Referensi 1).
   - Celana panjang seragam SMA abu-abu tua.
   - Sepatu sekolah hitam beraksen sol putih.
   - Tas ransel sekolah hitam di punggung.
   - Ekspresi wajah panik natural dan animasi lari yang dinamis.

2. **Pak Wahid (Guru Pengejar):**
   - Guru pria dewasa bertubuh agak berisi/gemuk khas Indonesia.
   - Wajah tegas berkumis hitam rapi dengan ekspresi fokus dan sedikit jenaka.
   - Kemeja putih polos lengan pendek berkerah dengan saku dada dan pin lencana (bukan batik).
   - Celana panjang hitam, ikat pinggang kulit hitam dengan gesper logam, dan sepatu formal hitam.
   - Animasi lari mengejar dan menjangkau saat mendekati siswa.

3. **Lingkungan 3D Sekolah Indonesia:**
   - **Lorong Belakang Kelas (Sesuai Foto Referensi 2):** Pilar dan tiang hijau tua, dinding terbagi (bawah keramik krem/gading dengan nat, atas cat hijau tua sekolah), lantai keramik putih mengilap dengan refleksi halus, pintu kelas putih dengan ventilasi, plang kelas XI A1 & XI A2, jendela kaca berjejer, dan taman luar yang asri.
   - **Area Kantin:** Paviliun kantin terbuka bertiang hijau, atap seng/spandek, etalase warung jajan ("Kantin Bu Siti"), banner makanan, meja dan bangku kayu panjang.
   - **Parkiran Sepeda Motor:** Kanopi beratap seng, lantai paving block abu-abu, garis marka parkir, serta deretan sepeda motor khas siswa Indonesia (matic/bebek) dengan plat nomor Lampung "BE 2026 PS".

---

## 🎮 Cara Bermain & Kontrol

### Desktop:
- **Pindah Jalur:** Tombol `A` / `D` atau `Panah Kiri` / `Panah Kanan`
- **Melompat:** `W`, `Spasi`, atau `Panah Atas` (lewati meja, kursi, tempat sampah, tas)
- **Meluncur (Slide):** `S` atau `Panah Bawah` (lewati palang parkir)
- **Pause Game:** Tombol `Escape` atau `P`

### Smartphone / HP Android:
- **Gestur Swipe:**
  - Swipe Kiri / Kanan: Pindah jalur
  - Swipe Atas: Melompat
  - Swipe Bawah: Meluncur (Slide)
- **Tombol Sentuh Virtual di Layar:**
  - Kluster Kiri: Tombol Kiri (◀) dan Kanan (▶)
  - Kluster Kanan: Tombol Lompat (▲) dan Meluncur (▼)
- Fitur anti-scroll dan anti-zoom otomatis aktif saat bermain.

---

## ⚡ Sistem Daya & Power-Up

- 👟 **Sepatu Kecepatan:** Lari turbo super cepat dan kebal terhadap tabrakan rintangan selama 6 detik.
- 📖 **Buku Perlindungan (Shield):** Melindungi pemain dari 1 kali benturan rintangan tanpa mengurangi kecepatan.
- 🪙 **Koin Kantin (Magnet):** Menarik seluruh koin emas di ketiga jalur ke arah pemain selama 7 detik.
- 🔔 **Bel Sekolah (2X Skor):** Menggandakan perolehan poin jarak lari selama 8 detik.
- 💨 **Mode Kabur:** Menjauhkan Pak Wahid secara drastis ke belakang (mundur hingga 7 meter).

---

## 🔊 Suara & Audio Interaktif

- **Synthesizer Web Audio API:** Musik latar (BGM) arcade berirama riang 132 BPM, SFX langkah kaki, lompatan, desisan slide di lantai keramik, benturan, dan jingle perolehan koin.
- **Synthesized Voice Pak Wahid:** Dialog suara guru khas Indonesia ("Hei! Kamu! Jangan lari!", "Ketangkap kamu! Ikut saya ke ruang guru!").
- Tombol Mute / Unmute instan pada HUD permainan.

---

## 🚀 Cara Menjalankan Secara Lokal

### Opsi 1: Menggunakan Vite (Direkomendasikan)
```bash
# 1. Masuk ke folder proyek
cd "game pak wahid"

# 2. Install dependensi Three.js dan Vite
npm install

# 3. Jalankan server lokal
npm run dev
```
Buka browser di alamat `http://localhost:3000`.

### Opsi 2: Menjalankan Langsung Tanpa Install (Live Server)
Game ini dilengkapi dengan *browser importmap* bawaan. Anda dapat langsung membuka folder ini menggunakan ekstensi **Live Server** di VS Code atau server HTTP statis apa pun:
```bash
npx serve .
```

---

## 📦 Build & Publikasi Gratis ke GitHub Pages

Proyek ini telah dikonfigurasi dengan `base: './'` pada `vite.config.js` dan telah menyertakan workflow otomatis **GitHub Actions** di `.github/workflows/deploy.yml`.

### Langkah Publikasi:
1. Buat repository baru di GitHub (misal: `game-pak-wahid`).
2. Push seluruh kode ini ke repository:
   ```bash
   git init
   git add .
   git commit -m "Initial release: Game Pak Wahid 3D Runner"
   git branch -M main
   git remote add origin https://github.com/USERNAME/game-pak-wahid.git
   git push -u origin main
   ```
3. Buka repository di GitHub, masuk ke tab **Settings** > **Pages**.
4. Pada bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
5. GitHub Actions akan secara otomatis membangun proyek (`npm run build`) dan menerbitkannya ke URL:
   `https://USERNAME.github.io/game-pak-wahid/`

---

## 📱 Fitur PWA (Progressive Web App)
- Dilengkapi `manifest.webmanifest` dan Service Worker (`public/sw.js`).
- Dapat diinstal langsung ke homescreen Android seperti aplikasi native.
- Orientasi layar responsif baik pada posisi horizontal maupun vertikal.

---

*Hak Cipta © 2026 Tim Pengembang Kejaran Pak Wahid. Dibuat dengan cinta untuk SMA Negeri 1 Pasir Sakti.*
