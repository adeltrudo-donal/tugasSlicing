# Technical Documentation - Cafe App (HMS Training API Integration)

Dokumen ini berisi penjelasan teknis lengkap, fitur, arsitektur, dan langkah-langkah pembuatan aplikasi Cafe App dalam rangkaian *Corporate Training (HMS)*.

## 1. Gambaran Umum (Overview)
Aplikasi Cafe App adalah aplikasi *mobile* berbasis React Native yang memungkinkan pengguna untuk:
- Melihat daftar cafe di sekitarnya.
- Mencari cafe berdasarkan kata kunci.
- Melihat detail cafe (deskripsi, daftar menu, dan lokasi pada peta).
- Menambahkan cafe ke daftar favorit (disimpan secara lokal).

## 2. Teknologi yang Digunakan (Tech Stack)
- **Framework**: React Native (CLI)
- **Bahasa**: TypeScript (sebelumnya JavaScript, dimigrasi penuh untuk *strict typing*)
- **Navigasi**: React Navigation (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **State Management**: React Context API (`CafesContext`)
- **HTTP Client**: Axios
- **Penyimpanan Lokal**: AsyncStorage (`@react-native-async-storage/async-storage`)
- **Peta (Maps)**: React Native Maps (`react-native-maps`)
- **Ikon & Grafis**: `react-native-vector-icons/FontAwesome`, `react-native-svg`

## 3. Fitur-Fitur Aplikasi
1. **Home / Main Page**: Menampilkan daftar cafe teratas dengan filter *Nearest* dan *Popular*, serta *Hero Section*.
2. **List Page (All Cafes)**: Menampilkan seluruh daftar cafe beserta fitur **Pencarian (Search)**.
3. **Detail Page**: Menampilkan deskripsi lengkap cafe, daftar menu (didapatkan dari endpoint API yang dinamis), tombol aksi favorit, dan Peta (Google Maps) yang menunjuk pada koordinat spesifik.
4. **Favorite Page**: Menampilkan daftar cafe yang disukai pengguna. Data bersifat persisten karena disimpan di perangkat (AsyncStorage).
5. **Bottom Navigation**: Tab bar navigasi yang dinamis menggunakan komponen SVG kustom.

## 4. Struktur Direktori (Atomic Design)
Proyek ini mengadopsi struktur *Atomic Design* untuk pemisahan komponen UI yang terorganisir:
```text
src/
├── assets/          # Berisi aset statis (gambar, SVG)
├── components/      # Komponen UI
│   ├── atoms/       # Komponen terkecil (Typography, ImagePlaceholder)
│   ├── molecules/   # Gabungan atom (RatingStars)
│   └── organisms/   # Kumpulan molekul (CafeCard, MenuCard)
├── context/         # React Context untuk global state (CafesContext.tsx)
├── models/          # TypeScript Interfaces (Cafe.ts)
├── navigation/      # Konfigurasi routing (AppNavigator.tsx)
├── pages/           # Layar utama (Main, List, Favorite, Detail)
└── utils/           # Konstanta utilitas (theme.ts, mockData.ts)
```

## 5. Langkah-Langkah Pengembangan (Step-by-Step)

### Step 1: UI Slicing & Atomic Design
Proses dimulai dengan memecah UI (User Interface) menjadi bagian-bagian kecil sesuai dengan desain:
- Membuat komponen atom seperti `Typography` untuk standarisasi teks.
- Membuat `CafeCard` dan `MenuCard` di folder organisms agar dapat di-*reuse* pada halaman Main, List, dan Favorite.

### Step 2: Implementasi Mock Data (Sebelum API)
Sebelum menyambungkan ke API server, aplikasi menggunakan data statis (`mockData.ts`) untuk memastikan UI bekerja dengan baik:
- Membuat daftar `CAFES_DATA` yang berisi info nama cafe, kategori, harga, jarak, dan status favorit awal.
- Membuat `MENU_DATA` statis.
- Mengubah properti UI pada `CafeCard` agar bisa mengonsumsi data *mock* tersebut dan menampilkannya dengan benar ke layar.

### Step 3: Setup Navigasi
Menambahkan `react-navigation` untuk membuat alur antar layar:
- `BottomTabs` untuk (Home, All Cafes, Favorite) menggunakan ikon SVG kustom.
- `Stack Navigator` membungkus tab tersebut dan menyematkan layar `Detail` sehingga detail dapat diakses dari tab mana saja.

### Step 4: Migrasi ke TypeScript
Mengonversi seluruh *file* `.js` ke `.ts`/`.tsx` untuk menghindari *bug* *runtime* (misalnya masalah tipe *array* `never` pada state):
- Membuat *file* `src/models/Cafe.ts` untuk mendefinisikan *interface* (kontrak tipe) seperti `Cafe`, `Menu`, dan spesifikasi respons.
- Menambahkan tipe (tipe Props) pada seluruh komponen dan navigasi untuk memastikan developer dibantu oleh VSCode saat memasukkan properti.

### Step 5: State Management & Local Storage (Favorites)
- Membuat `CafesContext.tsx` untuk membungkus seluruh hierarki aplikasi.
- Menggunakan `AsyncStorage` dengan *key* `@favorite_cafes` untuk menyimpan daftar cafe favorit.
- Mengimplementasikan fungsi `toggleFavorite` dan `isFavorite` yang mengecek eksistensi berdasarkan ID, agar tombol *heart* menjadi dinamis dan data favorit tidak hilang ketika aplikasi ditutup atau di-restart.

### Step 6: Integrasi API Dinamis (Axios)
Menggantikan implementasi *mock data* sebelumnya dengan memanggil API sungguhan dari server (*mock-api.ahmadfaisal.space*):
- **List & Search**: Menggunakan `axios.get('/cafes')` untuk memuat data di awal, dan parameter `search` ketika memanggil dari kolom pencarian. Memetakan struktur JSON API (yang menggunakan kunci spesifik seperti `shortDescription`, `latlong`) langsung ke *state* `cafes` di React.
- **Detail & Menus**: Saat masuk ke halaman Detail, aplikasi membaca *field* `menuId` dari API cafe (misal string `"15;13;10"`), memecahnya menggunakan operasi `split(';')`, dan lalu menembak endpoint `/menus?id=15&id=13&id=10` secara dinamis lewat Axios.

### Step 7: Integrasi Peta (React Native Maps)
- Memasang *library* `react-native-maps` dan mendefinisikan `API_KEY` layanan Google Maps di `AndroidManifest.xml`.
- Memisahkan data `latlong` (contoh string: `"-7.680;112.251"`) yang diberikan API menggunakan operasi `split(';')`, me-*parse*-nya menjadi desimal (`parseFloat`), dan kemudian memasukkannya ke dalam properti `<MapView>` serta `<Marker>` sehingga peta me-render titik pusat yang akurat sesuai lokasi cafe.

## 6. Spesifikasi Integrasi API

- **Base URL**: `https://mock-api.ahmadfaisal.space`

### 1. Get All Cafes & Search
- **Endpoint List Biasa**: `GET /cafes?page=1&limit=10` 
- **Endpoint Pencarian**: `GET /cafes?search={keyword}&page=1&limit=10`
- **Response Handling**: Karena API merespon menggunakan *array* JSON, Axios secara otomatis mem-parsing respons tersebut, dan fungsi `fetchCafes` di dalam `CafesContext` memindahkannya dengan aman ke dalam *state*. Terdapat pencegahan eror jika *node data* tidak sesuai ekspektasi standar JSON server.

### 2. Get Menus (Dynamic Map)
- **Endpoint**: `GET /menus?id={id_1}&id={id_2}...`
- **Response Handling**: Terjadi khusus pada saat merender `DetailScreen`. ID Menu diekstraksi dari metadata masing-masing cafe (`cafe.menuId`), dipetakan menjadi URL *Query Parameters*, dan me-render `<MenuCard />` secara dinamis sesuai jumlah ID yang kembali.

## 7. Cara Menjalankan Project
1. Buka terminal pada root direktori proyek.
2. Lakukan instalasi seluruh *dependency* Node:
   ```bash
   npm install
   ```
3. Mulai Metro Bundler (JavaScript Server):
   ```bash
   npm start
   ```
4. Jalankan aplikasi ke emulator atau perangkat Android yang terhubung:
   ```bash
   npm run android
   ```
*(Catatan Penting: Pastikan `GOOGLE_MAPS_API_KEY` pada file `android/app/src/main/AndroidManifest.xml` sudah valid agar peta Maps API tidak crash dan dapat merender lokasi cafe dengan sempurna.)*
