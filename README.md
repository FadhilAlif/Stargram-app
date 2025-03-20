


# Stargram - Simple Social Media App

Stargram adalah aplikasi media sosial sederhana yang memungkinkan pengguna untuk mengunggah foto, mengelola komentar, dan berbagi tautan media sosial.

## ✨ Fitur Utama

- **🔐 User Authentication:** Register, Login, Logout, Get Current User
- **👤 User Profile Management:** View, Update, Edit, Delete Profile
- **🖼 Photo Management:** Upload, Edit, Delete, View Photos
- **💬 Comment System:** Post, Edit, Delete, View Comments
- **🌐 Social Media Links:** Add, Edit, Delete, View Links
- **🏠 Home Feed:** Menampilkan daftar foto dan komentar dari pengguna

---

## 📄 Halaman yang Tersedia

- **🏠 Home Page**: Menampilkan semua foto dan komentar
- **🔐 Auth Pages**: Register, Login, Logout
- **👤 Profile Page**: Lihat, edit, hapus profil
- **🖼 Photo Management**: Unggah, edit, hapus foto
- **💬 Comment System**: Tambah, edit, hapus komentar
- **🌐 Social Media Management**: Tambah, edit, hapus tautan sosial media

---

## 🛠 Teknologi yang Digunakan

### **Frontend**
- **Vue.js 3**, **PrimeVue**, **Tailwind CSS**, **Pinia**, **Vue Router**, **Axios**

### **Backend**
- **Node.js**, **Express.js**, **Sequelize ORM**, **MySQL**
- **JWT Authentication**, **BCrypt**, **Multer**
- **Railway Deployment** → [API Link](https://mygram-finalproject2-hacktiv8.up.railway.app)

---

## 🚀 Instalasi & Menjalankan Aplikasi

### 1️⃣ Clone Repositori

```sh
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

### 2️⃣ Instalasi & Konfigurasi

**Frontend**
```sh
cd frontend
npm install
cp .env.example .env # Sesuaikan VITE_API_URL
npm run dev
```
Aplikasi berjalan di `http://localhost:5173`

**Backend**
```sh
cd backend
npm install
cp .env.example .env # Sesuaikan konfigurasi database
npx sequelize db:create && npx sequelize db:migrate && npx sequelize db:seed:all
npm run dev
```
API berjalan di `http://localhost:3000`

---

## 📂 Struktur Direktori

```
├── frontend/                # Frontend Vue.js
│   ├── src/                 # Kode sumber frontend
│   ├── public/              # File statis
│   ├── .env                 # Konfigurasi frontend
│   ├── package.json         # Dependensi frontend
├── backend/                 # Backend Node.js + Express.js
│   ├── src/                 # Kode sumber backend
│   ├── migrations/          # File migrasi database
│   ├── seeders/             # Data dummy awal
│   ├── .env                 # Konfigurasi backend
│   ├── package.json         # Dependensi backend
├── README.md                # Dokumentasi proyek
└── .gitignore               # File yang tidak perlu di-track Git
```

---

## 🔗 API Endpoint (Backend)

### **User Authentication**
- **POST** `/users/register` – Register user
- **POST** `/users/login` – Login user
- **GET** `/users/me` – Get current user (requires token)
- **PUT** `/users/:userId` – Update user
- **DELETE** `/users/:userId` – Delete user

### **Photo Management**
- **POST** `/photos` – Upload photo
- **GET** `/photos` – Get user photos
- **PUT** `/photos/:photoId` – Update photo
- **DELETE** `/photos/:photoId` – Delete photo

### **Comment System**
- **POST** `/comments` – Add comment
- **GET** `/comments` – Get comments
- **PUT** `/comments/:commentId` – Update comment
- **DELETE** `/comments/:commentId` – Delete comment

### **Social Media Links**
- **POST** `/socialmedias` – Add social media link
- **GET** `/socialmedias` – Get social media links
- **PUT** `/socialmedias/:socialMediaId` – Update social media link
- **DELETE** `/socialmedias/:socialMediaId` – Delete social media link

---

## ⚠️ Troubleshooting

- **Aplikasi tidak terhubung ke API?**  
  → Cek `.env` pada frontend dan backend, pastikan backend berjalan.  
- **Database error?**  
  → Jalankan ulang:  
  ```sh
  npx sequelize db:migrate:undo:all && npx sequelize db:migrate && npx sequelize db:seed:all
  ```
- **Port konflik?**  
  → Ubah port di `.env` atau `vite.config.js`.

---

## 📩 Kontak

📧 Email: fadhil.alifp@gmail.com  
🐙 GitHub: [FadhilAlif](https://github.com/FadhilAlif)  

---

README ini sudah disederhanakan dan menggabungkan bagian frontend & backend secara ringkas. Semoga membantu! 🚀
