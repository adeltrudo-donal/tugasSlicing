# Technical Documentation - Cafe App (HMS Training API Integration)

Dokumen ini berisi penjelasan teknis lengkap, fitur, arsitektur, dan langkah-langkah pembuatan aplikasi Cafe App dalam rangkaian _Corporate Training (HMS)_.

## 1. Gambaran Umum (Overview)

Aplikasi Cafe App adalah aplikasi _mobile_ berbasis React Native yang memungkinkan pengguna untuk:

- Melihat daftar cafe di sekitarnya.
- Mencari cafe berdasarkan kata kunci.
- Melihat detail cafe (deskripsi, daftar menu, dan lokasi pada peta).
- Menambahkan cafe ke daftar favorit (disimpan secara lokal).

## 2. Teknologi yang Digunakan (Tech Stack)

- **Framework**: React Native (CLI)
- **Bahasa**: TypeScript dan TSX sejak awal project untuk menjaga _strict typing_ dan konsistensi komponen UI
- **Navigasi**: React Navigation (`@react-navigation/native-stack`, `@react-navigation/bottom-tabs`)
- **State Management**: React Context API (`CafesContext`)
- **HTTP Client**: Axios
- **Penyimpanan Lokal**: AsyncStorage (`@react-native-async-storage/async-storage`)
- **Peta (Maps)**: React Native Maps (`react-native-maps`)
- **Ikon & Grafis**: `react-native-vector-icons/FontAwesome`, `react-native-svg`

## 3. Fitur-Fitur Aplikasi

1. **Home / Main Page**: Menampilkan daftar cafe teratas dengan filter _Nearest_ dan _Popular_, serta _Hero Section_.
2. **List Page (All Cafes)**: Menampilkan seluruh daftar cafe beserta fitur **Pencarian (Search)**.
3. **Detail Page**: Menampilkan deskripsi lengkap cafe, daftar menu (didapatkan dari endpoint API yang dinamis), tombol aksi favorit, dan Peta (Google Maps) yang menunjuk pada koordinat spesifik.
4. **Favorite Page**: Menampilkan daftar cafe yang disukai pengguna. Data bersifat persisten karena disimpan di perangkat (AsyncStorage).
5. **Bottom Navigation**: Tab bar navigasi yang dinamis menggunakan komponen SVG kustom.

## 4. Struktur Direktori (Atomic Design)

Proyek ini mengadopsi struktur _Atomic Design_ untuk pemisahan komponen UI yang terorganisir:

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

## 5. Persiapan Project

Sebelum masuk ke implementasi fitur, project ini disiapkan dengan alur kerja yang rapi agar struktur kode, konfigurasi build, dan kebutuhan native sudah siap dipakai sejak awal:

1. Menyiapkan project React Native CLI dengan TypeScript dan TSX agar seluruh komponen dan screen langsung menggunakan typing.
2. Mengatur dependency utama seperti React Navigation, AsyncStorage, Axios, React Native Maps, dan ikon SVG/vector.
3. Menyiapkan konfigurasi dasar project seperti `babel.config.js`, `metro.config.js`, `tsconfig.json`, `jest.config.js`, dan `app.json` supaya build, bundling, dan testing berjalan stabil.
4. Menentukan struktur folder `src/` sejak awal agar pemisahan antara model, context, navigation, pages, components, dan utils tetap konsisten.
5. Menyiapkan konfigurasi native Android/iOS untuk kebutuhan maps, asset, dan integrasi dependency native lain.

## 6. Fungsi Folder dan File

Bagian ini menjelaskan peran masing-masing folder dan file utama di project:

### File Root Project

- `App.tsx`: titik masuk utama aplikasi React Native; biasanya membungkus navigator dan provider global.
- `index.js`: entry point pendaftaran aplikasi ke React Native runtime.
- `package.json`: daftar dependency, script, dan metadata project.
- `app.json`: konfigurasi identitas aplikasi dan metadata dasar untuk React Native.
- `babel.config.js`: konfigurasi transpile JavaScript/TypeScript saat build.
- `metro.config.js`: konfigurasi bundler Metro untuk asset dan module resolution.
- `tsconfig.json`: aturan TypeScript, termasuk strict typing dan path/type checking.
- `jest.config.js`: konfigurasi testing unit dengan Jest.
- `README.md`: panduan penggunaan project secara umum.
- `TECHNICAL_DOCS.md`: dokumentasi teknis, arsitektur, dan penjelasan implementasi.

### Folder `src/models`

- `src/models/Cafe.ts`: berisi definisi `interface` dan tipe data inti seperti `Cafe`, `Menu`, serta bentuk respons API. File ini dipakai agar seluruh data yang dipakai di UI punya struktur yang jelas dan aman.

### Folder `src/context`

- `src/context/CafesContext.tsx`: pusat pengelolaan state global cafe, termasuk fetch data dari API, pencarian, status favorit, dan sinkronisasi ke AsyncStorage.

### Folder `src/navigation`

- `src/navigation/AppNavigator.tsx`: pengatur alur navigasi aplikasi, termasuk bottom tab dan stack untuk berpindah antar halaman.

### Folder `src/pages`

- `src/pages/Main/index.tsx`: halaman beranda untuk menampilkan highlight cafe, filter cepat, dan ringkasan data.
- `src/pages/List/index.tsx`: halaman daftar seluruh cafe, biasanya fokus ke pencarian dan list lengkap.
- `src/pages/Detail/index.tsx`: halaman detail cafe, berisi informasi lengkap, menu, tombol favorit, dan peta lokasi.
- `src/pages/Favorite/index.tsx`: halaman daftar cafe yang disimpan sebagai favorit pengguna.

### Folder `src/components`

- `src/components/atoms/`: komponen paling kecil dan paling reusable, misalnya `Typography` dan `ImagePlaceholder`.
- `src/components/molecules/`: gabungan beberapa atom yang punya fungsi lebih spesifik, misalnya `RatingStars`.
- `src/components/organisms/`: komponen yang lebih besar dan menyusun tampilan utama, misalnya `CafeCard` dan `MenuCard`.

### Folder `src/utils`

- `src/utils/theme.ts`: menyimpan konstanta warna, spacing, font, atau style dasar agar tampilan konsisten.
- `src/utils/mockData.ts`: data dummy yang dipakai untuk pengembangan awal atau fallback sebelum data API sepenuhnya digunakan.

### Folder `src/assets`

- `src/assets/`: menampung asset statis seperti icon, gambar, dan ilustrasi yang dipakai di UI.

## 7. Langkah-Langkah Pengembangan (Step-by-Step)

### Step 1: UI Slicing & Atomic Design

Proses dimulai dengan memecah UI (User Interface) menjadi bagian-bagian kecil sesuai dengan desain:

- Membuat komponen atom seperti `Typography` untuk standarisasi teks.
- Membuat `CafeCard` dan `MenuCard` di folder organisms agar dapat di-_reuse_ pada halaman Main, List, dan Favorite.

### Step 2: Implementasi Mock Data (Sebelum API)

Sebelum menyambungkan ke API server, aplikasi menggunakan data statis (`mockData.ts`) untuk memastikan UI bekerja dengan baik:

- Membuat daftar `CAFES_DATA` yang berisi info nama cafe, kategori, harga, jarak, dan status favorit awal.
- Membuat `MENU_DATA` statis.
- Mengubah properti UI pada `CafeCard` agar bisa mengonsumsi data _mock_ tersebut dan menampilkannya dengan benar ke layar.

### Step 3: Setup Navigasi

Menambahkan `react-navigation` untuk membuat alur antar layar:

- `BottomTabs` untuk (Home, All Cafes, Favorite) menggunakan ikon SVG kustom.
- `Stack Navigator` membungkus tab tersebut dan menyematkan layar `Detail` sehingga detail dapat diakses dari tab mana saja.

### Step 4: TypeScript/TSX dari Awal

Project ini memang dirancang langsung menggunakan `.ts` dan `.tsx`, sehingga struktur tipe sudah terbentuk sejak implementasi pertama:

- Membuat _file_ `src/models/Cafe.ts` untuk mendefinisikan _interface_ (kontrak tipe) seperti `Cafe`, `Menu`, dan spesifikasi respons.
- Menambahkan tipe (tipe Props) pada seluruh komponen dan navigasi agar VSCode membantu saat memasukkan properti dan mencegah _runtime bug_ sejak awal.

### Step 5: State Management & Local Storage (Favorites)

- Membuat `CafesContext.tsx` untuk membungkus seluruh hierarki aplikasi.
- Menggunakan `AsyncStorage` dengan _key_ `@favorite_cafes` untuk menyimpan daftar cafe favorit.
- Mengimplementasikan fungsi `toggleFavorite` dan `isFavorite` yang mengecek eksistensi berdasarkan ID, agar tombol _heart_ menjadi dinamis dan data favorit tidak hilang ketika aplikasi ditutup atau di-restart.

### Step 6: Integrasi API Dinamis (Axios)

Menggantikan implementasi _mock data_ sebelumnya dengan memanggil API sungguhan dari server (_mock-api.ahmadfaisal.space_):

- **List & Search**: Menggunakan `axios.get('/cafes')` untuk memuat data di awal, dan parameter `search` ketika memanggil dari kolom pencarian. Memetakan struktur JSON API (yang menggunakan kunci spesifik seperti `shortDescription`, `latlong`) langsung ke _state_ `cafes` di React.
- **Detail & Menus**: Saat masuk ke halaman Detail, aplikasi membaca _field_ `menuId` dari API cafe (misal string `"15;13;10"`), memecahnya menggunakan operasi `split(';')`, dan lalu menembak endpoint `/menus?id=15&id=13&id=10` secara dinamis lewat Axios.

### Step 7: Integrasi Peta (React Native Maps)

- Memasang _library_ `react-native-maps` dan mendefinisikan `API_KEY` layanan Google Maps di `AndroidManifest.xml`.
- Memisahkan data `latlong` (contoh string: `"-7.680;112.251"`) yang diberikan API menggunakan operasi `split(';')`, me-_parse_-nya menjadi desimal (`parseFloat`), dan kemudian memasukkannya ke dalam properti `<MapView>` serta `<Marker>` sehingga peta me-render titik pusat yang akurat sesuai lokasi cafe.

## 8. Spesifikasi Integrasi API

- **Base URL**: `https://mock-api.ahmadfaisal.space`

### 1. Get All Cafes & Search

- **Endpoint List Biasa**: `GET /cafes?page=1&limit=10`
- **Endpoint Pencarian**: `GET /cafes?search={keyword}&page=1&limit=10`
- **Response Handling**: Karena API merespon menggunakan _array_ JSON, Axios secara otomatis mem-parsing respons tersebut, dan fungsi `fetchCafes` di dalam `CafesContext` memindahkannya dengan aman ke dalam _state_. Terdapat pencegahan eror jika _node data_ tidak sesuai ekspektasi standar JSON server.

### 2. Get Menus (Dynamic Map)

- **Endpoint**: `GET /menus?id={id_1}&id={id_2}...`
- **Response Handling**: Terjadi khusus pada saat merender `DetailScreen`. ID Menu diekstraksi dari metadata masing-masing cafe (`cafe.menuId`), dipetakan menjadi URL _Query Parameters_, dan me-render `<MenuCard />` secara dinamis sesuai jumlah ID yang kembali.

## 9. Cara Menjalankan Project

1. Buka terminal pada root direktori proyek.
2. Lakukan instalasi seluruh _dependency_ Node:
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
   _(Catatan Penting: Pastikan `GOOGLE_MAPS_API_KEY` pada file `android/app/src/main/AndroidManifest.xml` sudah valid agar peta Maps API tidak crash dan dapat merender lokasi cafe dengan sempurna.)_
