# Stargram App - Simple Social Media App

Stargram adalah aplikasi media sosial sederhana yang memungkinkan pengguna untuk mengunggah foto, mengelola komentar, dan berbagi tautan media sosial dll.

## ✨ Fitur Utama

- **🔐 User Authentication:** Register, Login, Logout, Get Current User
- **👤 User Profile Management:** View, Update, Edit, Delete Profile
- **🖼 Photo Management:** Upload, Edit, Delete, View Photos
- **💬 Comment System:** Post, Edit, Delete, View Comments
- **🌐 Social Media Links:** Add, Edit, Delete, View Links
- **🏠 Home Feed:** Menampilkan daftar foto dan komentar dari pengguna

## 📄 Halaman yang Tersedia

### 🏠 Home Page

- Menampilkan semua foto yang diunggah pengguna lain
- Bisa memberikan komentar pada foto tertentu
- Menampilkan daftar komentar di setiap foto

### 🔐 Authentication Pages

- **Register Page:** Form pendaftaran user
- **Login Page:** Form login user
- **Logout:** Tombol untuk keluar

### 👤 User Profile Page

- Menampilkan informasi user (email, full name, username, profile picture, age, phone number)
- Form untuk mengedit data user
- Tombol untuk menghapus akun

### 🖼 Photo Management

- **Upload Photo Page:** Form untuk mengunggah foto
- **Edit Photo Page:** Form untuk mengedit foto
- **Delete Photo Button:** Tombol hapus foto

### 💬 Comment Section

- Form untuk menambahkan komentar pada foto tertentu
- Daftar komentar pada setiap foto
- Tombol edit & hapus komentar

### 🌐 Social Media Management

- **Add Social Media:** Form menambahkan link sosial media
- **Edit Social Media:** Form mengubah link sosial media
- **Delete Social Media** Hapus link sosial media
- **List Social Media:** Menampilkan daftar link sosial media pengguna

---

## 🛠 Teknologi yang Digunakan

- **Vue.js 3** - Framework JavaScript untuk membangun antarmuka pengguna
- **PrimeVue** - Library komponen UI untuk Vue.js (Tabs, Dialog, Button, Toast, ConfirmDialog, dll.)
- **Tailwind CSS** - Framework CSS untuk styling
- **Pinia** - State management untuk Vue.js
- **Vue Router** - Untuk navigasi antar halaman
- **Axios** - Untuk komunikasi dengan API backend

## 🔧 Prasyarat

Pastikan Anda memiliki hal-hal berikut sebelum menjalankan proyek ini:

- **Node.js** (versi 16 atau lebih tinggi) dan **npm**
- **Git** untuk meng-clone repositori
- **Backend API** yang kompatibel

## 🚀 Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah berikut untuk meng-clone dan menjalankan proyek ini di mesin lokal Anda:

### 1️⃣ Clone Repositori

```sh
git clone https://github.com/<username-anda>/<nama-repositori>.git
cd <nama-repositori>
```

### 2️⃣ Instal Dependensi

```sh
npm install
```

### 3️⃣ Konfigurasi Environment

Buat file `.env` di root direktori proyek dan tambahkan konfigurasi berikut:

```sh
VITE_API_URL=http://localhost:1555
```

Pastikan backend API berjalan di URL yang sesuai.

### 4️⃣ Jalankan Aplikasi

```sh
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### 5️⃣ (Opsional) Build untuk Produksi

```sh
npm run build
```

Hasil build akan disimpan di folder `dist`.

---

## 📂 Struktur Direktori

```
├── public/                 # File statis (favicon, dll.)
├── src/                    # Kode sumber aplikasi
│   ├── assets/             # Aset seperti gambar dan font
│   ├── components/         # Komponen Vue
│   ├── layout/             # Mengatur Layout
│   ├── router/             # Konfigurasi Vue Router
│   ├── stores/             # State management dengan Pinia
│   ├── utils/              # Utilitas (misalnya, API helper)
│   ├── views/              # Halaman utama (misalnya, Profile.vue)
│   ├── App.vue             # Komponen root aplikasi
│   └── main.js             # Entry point aplikasi
├── .env                    # File konfigurasi environment
├── package.json            # Dependensi dan script proyek
└── README.md               # Dokumentasi proyek
```

## ⚠️ Troubleshooting

**1. Aplikasi tidak terhubung ke API?**

- Pastikan backend berjalan dan URL di `.env` benar.
- Periksa error di konsol browser.

**2. Dependensi gagal terinstal?**

- Hapus folder `node_modules` dan file `package-lock.json`, lalu jalankan `npm install` lagi.

**3. Port 5173 sudah digunakan?**

- Periksa terminal untuk port yang digunakan atau ubah di `vite.config.js`.

## 📩 Kontak

Jika Anda memiliki pertanyaan atau butuh bantuan, hubungi saya di:

📧 Email: fadhil.alifp@gmail.com  
🐙 GitHub: [FadhilAlif](https://github.com/FadhilAlif)
