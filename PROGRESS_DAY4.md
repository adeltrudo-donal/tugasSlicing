# PROGRESS_DAY4: Analisis Teknis App Restoran dengan Redux

## 1. Overview Aplikasi

Aplikasi ini adalah **mobile app untuk browsing dan menyimpan restoran favorit**, dibangun dengan React Native, Redux, dan React Navigation. Arsitektur menggunakan **Redux sebagai single source of truth** untuk state cafe, dan **AsyncStorage untuk persistence** data favorit.

---

## 2. Entry Point: App.tsx

### Flow Awal Aplikasi Ketika Dibuka

```
App.tsx (Root Component)
    ↓
SafeAreaProvider (wrapper untuk status bar dan notch safety)
    ↓
Provider (Redux Provider - menyediakan store ke seluruh app)
    ↓
AppNavigator (Navigation Container)
    ↓
BottomTabs (Bottom Tab Navigator)
    ↓
Home / All Cafes / Favorite (screen pilihan pertama)
```

**Alur pertama kali buka app:**
1. React Native merender `App.tsx`
2. `SafeAreaProvider` membungkus untuk menangani safe area di berbagai device
3. Redux `Provider` dengan `store` yang sudah dikonfigurasi diberikan ke seluruh component tree
4. `AppNavigator` di-render, yang me-setup navigation structure
5. User pertama kali melihat halaman **"Home"** (MainPage) karena itu adalah tab pertama di `BottomTabs`

---

## 3. Redux Store Setup

### Store Configuration (src/store/store.ts)

```typescript
const rootReducer = combineReducers({
  counter: counterReducer,      // Legacy counter demo
  cafes: cafeReducer,           // Cafe state (yang aktif)
});

const store = createStore(rootReducer, applyMiddleware(thunk));
```

**Alasan structure:**
- `combineReducers` menggabungkan reducer cafe dan counter menjadi satu store
- `thunk` middleware memungkinkan action creators mengembalikan function (untuk async operations)
- `RootState` type di-export untuk TypeScript typing di seluruh app

### Cafe Reducer State Shape (src/reducer/cafe_reducer.ts)

```typescript
type CafeState = {
  cafes: Cafe[];                // Semua cafe yang sudah di-fetch
  favorites: Cafe[];            // Cafe yang di-like
  loading: boolean;             // Loading state fetch pertama
  loadingMore: boolean;         // Loading state fetch page berikutnya (infinite scroll)
  error: string | null;         // Error message
  page: number;                 // Current page untuk pagination (dimulai dari 1)
  hasMore: boolean;             // Flag apakah masih ada page berikutnya
  searchKeyword: string;        // Keyword untuk local search
};

const initialState: CafeState = {
  cafes: [],
  favorites: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  searchKeyword: '',
};
```

---

## 4. Navigation Structure

### BottomTabs + Stack Navigation (src/navigation/AppNavigator.tsx)

```
AppNavigator (Stack)
├─ MainTabs (BottomTabs)
│  ├─ Home (MainPage)
│  ├─ All Cafes (ListPage)
│  └─ Favorite (FavoritePage)
└─ Detail (DetailPage - modal/modal stack)
```

**Penjelasan:**
- **Stack Navigator**: Root navigator yang menghandle full screen transitions
- **Bottom Tabs Navigator**: Nested di dalam stack untuk 3 tab utama
  - Home, All Cafes, Favorite adalah tab yang bisa di-switch
- **Detail Screen**: Tidak di-tab, tapi di-stack atas MainTabs, jadi user bisa kembali ke tab

---

## 5. Halaman "Home" (MainPage) - Halaman Pertama Dibuka

### Layout & UI

```
┌─────────────────────────────────┐
│ Hero Image                      │  (Header bagian dengan gambar background)
│ "Cafes List"                    │
│ Chip labels (Label 1, Label 2)  │
└─────────────────────────────────┘
│ Nearest | Popular               │  (Filter segment buttons)
├─────────────────────────────────┤
│ CafeCard 1 [♥]                  │  (Cafe item dengan heart like button)
│ CafeCard 2 [♡]                  │
│ CafeCard 3 [♥]                  │
│ ... (infinite scroll)            │
│ [ActivityIndicator] (loading)    │  (Footer loading saat fetch next page)
└─────────────────────────────────┘
```

### Logic Flow MainPage

#### Initialization (useEffect)
```typescript
useEffect(() => {
  dispatch(loadFavorites());      // 1. Load favorit dari AsyncStorage ke Redux
  dispatch(fetchCafes());          // 2. Fetch page 1 cafe dari API
  lastPageRef.current = 1;         // 3. Set ref untuk track page fetch
}, [dispatch]);
```

**Step 1: loadFavorites() - Load Favorites dari AsyncStorage**
```
dispatch(loadFavorites())
  ↓
thunk action di cafe_action.ts
  ↓
AsyncStorage.getItem('@favorite_cafes')
  ↓
Kalau ada data stored:
  dispatch({ type: LOAD_FAVORITES, payload: parsedFavorites })
  ↓
cafe_reducer update state.favorites
  ↓
Sekarang Redux tahu cafe mana yang user sudah like sebelumnya
```

**Step 2: fetchCafes() - Fetch Page 1 dari API**
```
dispatch(fetchCafes())
  ↓
thunk action di cafe_action.ts
  ↓
dispatch({ type: FETCH_CAFE_REQUEST })       // loading: true
  ↓
axios.get('https://mock-api.ahmadfaisal.space/cafes?page=1&limit=10')
  ↓
Kalau success:
  dispatch({ type: FETCH_CAFE_SUCCESS, payload: data })
  ↓
cafe_reducer:
  - state.cafes = data (10 item page 1)
  - state.page = 2 (siap untuk next page)
  - state.hasMore = (data.length === 10)  // True jika ada page berikutnya
  - state.loading = false
  
Kalau error:
  dispatch({ type: FETCH_CAFE_FAILURE, payload: error })
  ↓
state.error = error message, loading = false
```

#### Sorting & Filtering
```typescript
const sortedCafes = [...cafes].sort((a, b) => {
  if (filter === 'nearest') {
    // Sort by distance ascending
    return distA - distB;
  } else {
    // Sort by rating descending
    return ratingB - ratingA;
  }
});
```

#### Infinite Scroll
```typescript
const handleLoadMore = () => {
  // Guard: hanya fetch kalau:
  // 1. loadingMore false (tidak sedang fetch)
  // 2. hasMore true (masih ada data berikutnya)
  // 3. page > lastPageRef.current (belum fetch page ini)
  if (!loadingMore && hasMore && page > lastPageRef.current) {
    lastPageRef.current = page;  // Update ref agar tidak fetch 2x
    dispatch(fetchMoreCafes(page));
  }
};

// Di FlatList:
<FlatList
  onEndReached={handleLoadMore}           // Trigger saat scroll 70% ke bawah
  onEndReachedThreshold={0.7}
  ListFooterComponent={
    loadingMore ? <ActivityIndicator /> : null
  }
/>
```

**Kenapa ada lastPageRef?**
- `onEndReachedThreshold` bisa trigger multiple times saat scroll position berfluktuasi
- Tanpa ref, `fetchMoreCafes(page)` bisa dipanggil 3-4 kali dengan page yang sama
- Hasilnya data duplikat di-append ke state.cafes
- Ref ini memastikan setiap page hanya di-fetch sekali

#### Rendering CafeCard
```typescript
<FlatList
  data={sortedCafes}
  keyExtractor={(item, index) => `${item.id}-${index}`}  // Unique key
  renderItem={({ item }) => (
    <CafeCard 
      cafe={item}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    />
  )}
/>
```

---

## 6. CafeCard Component - Interaksi Like/Favorite

### UI CafeCard
```
┌──────────┬────────────────────────────┐
│          │ Cafe Name      [★][♡]     │  (name, rating, like button)
│ Image    │ Category • Price • Distance │
│ 88x88    │ Short Description...        │
└──────────┴────────────────────────────┘
```

### Like/Favorite Logic
```typescript
const CafeCard = ({ cafe, onPress }) => {
  const dispatch = useDispatch();
  // Check apakah cafe ini di favorites redux
  const isFav = useSelector((state: RootState) => 
    state.cafes.favorites.some((fav) => fav.id === cafe.id)
  );

  return (
    <TouchableOpacity onPress={() => dispatch(toggleFavoriteCafe(cafe))}>
      <Icon name={isFav ? 'heart' : 'heart-o'} />
    </TouchableOpacity>
  );
};
```

### toggleFavoriteCafe Thunk Action
```typescript
const toggleFavoriteCafe = (cafe: Cafe) => {
  return async (dispatch: any, getState: any) => {
    // 1. Get current favorites dari Redux state
    const currentFavorites = getState().cafes.favorites;
    
    // 2. Check apakah cafe sudah ada di favorites
    const isExist = currentFavorites.some((fav) => fav.id === cafe.id);
    
    let newFavorites;
    if (isExist) {
      // 3. Kalau sudah ada, remove dari favorites
      newFavorites = currentFavorites.filter((fav) => fav.id !== cafe.id);
    } else {
      // 4. Kalau belum ada, add ke favorites
      newFavorites = [...currentFavorites, cafe];
    }
    
    // 5. Persist ke AsyncStorage
    await AsyncStorage.setItem('@favorite_cafes', JSON.stringify(newFavorites));
    
    // 6. Update Redux state
    dispatch({ type: TOGGLE_FAVORITE_CAFE, payload: cafe });
  };
};
```

**State Update Logic di Reducer:**
```typescript
case TOGGLE_FAVORITE_CAFE: {
  const cafe = action.payload;
  const isExist = state.favorites.some((fav) => fav.id === cafe.id);
  
  return {
    ...state,
    favorites: isExist
      ? state.favorites.filter((fav) => fav.id !== cafe.id)  // Remove
      : [...state.favorites, cafe],                           // Add
  };
}
```

**Alur Lengkap Like:**
1. User tap heart icon
2. `toggleFavoriteCafe(cafe)` dispatch ke Redux
3. Thunk cek Redux state, tentukan add atau remove
4. Persist ke AsyncStorage immediately (async)
5. Dispatch action ke reducer
6. Reducer update state.favorites
7. CafeCard re-render karena favorites state berubah
8. Heart icon berubah dari hollow ke filled (atau sebaliknya)

---

## 7. Halaman "All Cafes" (ListPage) - Search Lokal + Infinite Scroll

### Layout
```
┌──────────────────────────────────┐
│ [Search Input]                   │  (TextInput untuk keyword)
├──────────────────────────────────┤
│ CafeCard 1 [♥]                   │  (Filtered & sorted by search)
│ CafeCard 2 [♡]                   │
│ ... (infinite scroll)             │
│ [ActivityIndicator] (loading)     │
└──────────────────────────────────┘
```

### Search Logic
```typescript
const [searchKeyword, setSearchKeyword] = useState('');

// Real-time filter dari Redux store
const filteredCafes = cafes.filter((cafe) => {
  const keyword = searchKeyword.trim().toLowerCase();
  if (!keyword) return true;  // No filter jika search empty
  
  // Search di name, category, shortDescription
  return (
    cafe.name.toLowerCase().includes(keyword) ||
    cafe.category.toLowerCase().includes(keyword) ||
    cafe.shortDescription.toLowerCase().includes(keyword)
  );
});
```

**Penting:**
- Search **BUKAN** hit API lagi
- Search adalah **local filter** dari data yang sudah ada di Redux
- Jika user load 20 cafe (page 1 + page 2) lalu search, hasil hanya dari 20 item itu
- Jika data belum di-load, search juga tidak bisa cari data yang belum di-app

### Search State Management
```typescript
// Saat user ketik di TextInput
<TextInput
  value={searchKeyword}
  onChangeText={(text) => dispatch(setSearchKeyword(text))}
/>

// setSearchKeyword action
const setSearchKeyword = (keyword: string) => ({
  type: SET_SEARCH_KEYWORD,
  payload: keyword,
});

// Reducer
case SET_SEARCH_KEYWORD:
  return { ...state, searchKeyword: action.payload };
```

### Infinite Scroll List Page
Sama seperti MainPage, gunakan `onEndReached` + `lastPageRef` untuk prevent duplicate fetch.

```typescript
const handleLoadMore = () => {
  if (!loading && !loadingMore && hasMore && page > lastPageRef.current) {
    lastPageRef.current = page;
    dispatch(fetchMoreCafes(page));
  }
};
```

---

## 8. Halaman "Favorite" (FavoritePage)

### Logic
```typescript
const FavoriteScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.cafes.favorites);
  
  useEffect(() => {
    dispatch(loadFavorites());  // Load dari AsyncStorage saat page mount
  }, [dispatch]);
  
  if (favorites.length === 0) {
    return <Text>No favorite cafes yet.</Text>;
  }
  
  return (
    <FlatList data={favorites} renderItem={renderCafeCard} />
  );
};
```

**Karakteristik Favorite:**
- Data source: Redux state.cafes.favorites
- Tidak ada infinite scroll (favorites cuma dari AsyncStorage yang user like)
- Tidak ada search (favorites list sudah filtered by design)
- Update real-time: saat user like cafe di Home/ListPage, favorite screen update otomatis

---

## 9. Halaman Detail (DetailPage)

### Navigation Params
```typescript
navigation.navigate('Detail', { id: item.id })

// Di DetailPage:
const { id } = route.params;
```

### Logic
```typescript
const DetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const cafes = useSelector((state) => state.cafes.cafes);
  const favorites = useSelector((state) => state.cafes.favorites);
  
  // Find cafe dari Redux store berdasarkan id
  useEffect(() => {
    const foundCafe = cafes.find((c) => String(c.id) === String(id));
    if (foundCafe) {
      setCafe(foundCafe);
      fetchMenus(foundCafe.menuId);  // Fetch menu items dari API
    }
  }, [id, cafes]);
  
  // Check apakah cafe ini favorite
  const isFav = favorites.some((fav) => fav.id === cafe.id);
};
```

**API Call untuk Menus:**
```typescript
const fetchMenus = async (menuIdsStr: string) => {
  // menuIdsStr format: "1;2;3" (semicolon separated)
  const ids = menuIdsStr.split(';').map(id => `id=${id}`).join('&');
  // Result: "id=1&id=2&id=3"
  
  const response = await axios.get(
    `https://mock-api.ahmadfaisal.space/menus?${ids}`
  );
  setMenus(response.data?.data || response.data);
};
```

---

## 10. API Integration & Thunk Actions

### fetchCafes() - Initial Load
```
GET /cafes?page=1&limit=10
Response:
{
  data: [
    { id: 1, name: "...", category: "...", ... },
    ...
  ]
}
```

### fetchMoreCafes(page) - Pagination
```
GET /cafes?page=2&limit=10
GET /cafes?page=3&limit=10
...
```

**Append Logic di Reducer:**
```typescript
case FETCH_CAFE_MORE_SUCCESS:
  return {
    ...state,
    loadingMore: false,
    cafes: [...state.cafes, ...(action.payload as Cafe[])],  // APPEND
    page: state.page + 1,
    hasMore: (action.payload as Cafe[]).length === 10,
  };
```

### Error Handling
```typescript
const fetchCafes = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CAFE_REQUEST });
    
    try {
      const response = await axios.get('...');
      dispatch({ type: FETCH_CAFE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_CAFE_FAILURE, payload: errorMessage });
    }
  };
};

// User lihat error message jika fetch gagal
{error ? <Text style={styles.errorText}>{error}</Text> : null}
```

---

## 11. State Management Summary

### Redux State Flow Diagram
```
┌─────────────────────────────────────────┐
│           Redux Store (Single Source)    │
│                                          │
│  state.cafes = {                        │
│    cafes: [],          ← Dari API fetch │
│    favorites: [],      ← Dari AsyncStorage
│    loading: false,                      │
│    loadingMore: false,                  │
│    error: null,                         │
│    page: 1,                             │
│    hasMore: true,                       │
│    searchKeyword: ''                    │
│  }                                       │
└─────────────────────────────────────────┘
         ↑                    ↓
    Components             Components
    subscribe               dispatch
    via                     actions
    useSelector()           via
                           useDispatch()
```

### Data Flow
1. **User Action** (scroll, tap like, type search)
2. **Component dispatch Action** (thunk atau sync)
3. **Action hits API** (async thunk) atau **update local state** (sync)
4. **Reducer update Redux store**
5. **Component re-render** (via useSelector subscription)
6. **UI update** (reflect latest state)

---

## 12. Persistence Layer (AsyncStorage)

### Favorites Persistence
```
localStorage key: '@favorite_cafes'

Storage format:
[
  { id: 1, name: "...", category: "...", ... },
  { id: 5, name: "...", category: "...", ... },
  ...
]
```

### Load on App Start
```
App.tsx (via MainPage useEffect)
  ↓
dispatch(loadFavorites())
  ↓
AsyncStorage.getItem('@favorite_cafes')
  ↓
dispatch({ type: LOAD_FAVORITES, payload: data })
  ↓
Redux state.cafes.favorites = persisted favorites
  ↓
All pages dapat akses favorites dari Redux
```

### Save on Like/Unlike
```
User tap heart icon
  ↓
dispatch(toggleFavoriteCafe(cafe))
  ↓
Thunk:
  1. Calculate newFavorites
  2. AsyncStorage.setItem('@favorite_cafes', JSON.stringify(newFavorites))
  3. dispatch reducer action
  ↓
Persist ke device storage
Redux state update
UI update
```

---

## 13. Complete User Journey Example

### Scenario: User Membuka App dan Mencari Restoran

```
1. App Startup
   └─ App.tsx render
      ├─ SafeAreaProvider wrap
      ├─ Redux Provider wrap
      └─ AppNavigator render
         └─ BottomTabs render
            └─ MainPage (Home tab) render

2. MainPage Mount
   └─ useEffect dipanggil
      ├─ dispatch(loadFavorites())
      │  └─ Load '@favorite_cafes' dari AsyncStorage ke Redux
      └─ dispatch(fetchCafes())
         └─ GET /cafes?page=1&limit=10
            └─ setState loading: true
            └─ After response:
               ├─ setState cafes: [10 items page 1]
               ├─ setState page: 2
               ├─ setState hasMore: true
               └─ setState loading: false

3. User Lihat Home Screen
   ├─ Hero banner + filter buttons ditampilkan
   ├─ 10 cafe cards ditampilkan (sorted by nearest or popular)
   └─ Cafe icons menunjukkan mana yang sudah di-like

4. User Tap "All Cafes" Tab
   └─ ListPage render
      ├─ useEffect dipanggil
      │  ├─ dispatch(loadFavorites())  // Ensure favorites loaded
      │  └─ dispatch(fetchCafes())      // Re-fetch atau use cache
      └─ Search bar visible

5. User Type "kopi" di Search
   ├─ onChangeText trigger
   └─ dispatch(setSearchKeyword('kopi'))
      └─ Redux state.searchKeyword = 'kopi'
         └─ ListPage filter: cafes.filter(c => c.name.includes('kopi'))
            └─ List update menampilkan hanya cafe yang match 'kopi'

6. User Scroll ke Bawah
   ├─ onEndReached trigger (70% threshold)
   └─ handleLoadMore()
      ├─ Check: !loadingMore && hasMore && page > lastPageRef.current
      ├─ lastPageRef.current = 2
      └─ dispatch(fetchMoreCafes(2))
         └─ GET /cafes?page=2&limit=10
            ├─ setState loadingMore: true
            └─ After response:
               ├─ setState cafes: [...previous 10, ...10 new]  // APPEND
               ├─ setState page: 3
               ├─ setState hasMore: (receivedCount === 10)
               └─ setState loadingMore: false

7. User Lihat Cafe "Kopi Tani" dan Tap Heart
   ├─ dispatch(toggleFavoriteCafe(cafeTani))
   └─ Thunk dijalankan:
      ├─ Get currentFavorites dari Redux
      ├─ newFavorites = [...currentFavorites, cafeTani]
      ├─ AsyncStorage.setItem('@favorite_cafes', JSON.stringify(newFavorites))
      ├─ dispatch({ type: TOGGLE_FAVORITE_CAFE, payload: cafeTani })
      └─ Redux reducer update:
         └─ state.favorites = [...oldFavorites, cafeTani]

8. User Tap Cafe Card
   ├─ navigation.navigate('Detail', { id: cafeId })
   └─ DetailPage render
      ├─ useEffect find cafe dari Redux store by id
      ├─ fetchMenus(foundCafe.menuId)
      │  └─ GET /menus?id=1&id=2&id=3
      │     └─ setState menus: [menu items]
      └─ Display cafe details + menus + map

9. User Tap Heart di Detail
   ├─ dispatch(toggleFavoriteCafe(foundCafe))
   └─ Jika sudah like, unlike (remove dari favorites)
      Jika belum like, like (add ke favorites)

10. User Tap Back
    └─ Pop Detail screen dari stack
       └─ Kembali ke BottomTabs (last tab yang aktif)

11. User Tap "Favorite" Tab
    ├─ FavoritePage render
    ├─ useEffect dipanggil
    └─ Menampilkan semua cafe di state.cafes.favorites
       └─ Cafe yang user like di step 7 + 9 visible di sini
```

---

## 14. Key Technical Insights

### 1. Single Source of Truth (Redux)
- Semua data cafe tersimpan di Redux, bukan di component local state
- Semua component baca data dari Redux via useSelector
- Konsistensi dijamin: Heart icon di Home/List/Detail/Favorite selalu sama

### 2. Async Thunk Pattern
```typescript
const thunkAction = (param) => async (dispatch, getState) => {
  // Access Redux state
  const state = getState();
  
  // Dispatch actions
  dispatch({ type: REQUEST });
  
  try {
    // Async operations (API call, AsyncStorage, etc)
    const result = await asyncOperation();
    dispatch({ type: SUCCESS, payload: result });
  } catch (error) {
    dispatch({ type: FAILURE, payload: error });
  }
};
```

### 3. Pagination + Infinite Scroll Guard
- `lastPageRef` prevent duplicate API calls
- `onEndReachedThreshold` vs `onEndReached` timing issue solved
- `loadingMore` state separate dari `loading` untuk UX clarity

### 4. Local Search Strategy
- Search tidak hit API lagi (design trade-off)
- Search hanya filter data yang sudah di-store
- Pro: instant, offline-capable
- Con: tidak bisa search seluruh server dataset

### 5. Like/Favorite Dual Layer
- **Redux state**: UI source of truth, instant update
- **AsyncStorage**: persistence, survive app restart
- Thunk action handle keduanya atomically

### 6. Error Handling
- Network error: user lihat error message di UI
- AsyncStorage error: logged, UI tidak crash
- Invalid response: fallback parsing (response.data?.data || response.data)

---

## 15. File Structure & Responsibilities

```
src/
├── action/
│   └── cafe_action.ts          // Thunk actions untuk cafe
├── reducer/
│   └── cafe_reducer.ts         // Reducer logic untuk cafe state
├── types/
│   └── cafe_action.ts          // Action type enums
├── store/
│   └── store.ts                // Redux store config
├── components/
│   ├── organisms/
│   │   └── CafeCard.tsx        // Card component dengan like button
│   └── molecules/
│       └── RatingStars.tsx     // Rating display
├── pages/
│   ├── Main/
│   │   └── index.tsx           // Home screen (first load)
│   ├── List/
│   │   └── index.tsx           // All Cafes dengan search
│   ├── Favorite/
│   │   └── index.tsx           // Liked cafes
│   └── Detail/
│       └── index.tsx           // Cafe detail + menus
├── navigation/
│   └── AppNavigator.tsx        // Navigation structure
├── models/
│   └── Cafe.ts                 // TypeScript interfaces
└── utils/
    └── theme.ts                // Theme colors
```

---

## 16. Performance Optimization Done

1. **Pagination (limit=10)**: Tidak load semua cafe sekaligus
2. **Local Search**: No API hit saat search, instant filtering
3. **FlatList keyExtractor**: Unique keys prevent re-render issues
4. **useRef for lastPageRef**: Prevent multiple fetch same page
5. **Selector memoization**: useSelector memoize results
6. **Sorted in component**: Sort dilakukan di memory, bukan API

---

## 17. Potential Improvements (Future)

1. **Search Pagination**: Limit search ke loaded items vs fetch all
2. **Caching Strategy**: Cache API response dengan expiry
3. **Optimistic Updates**: Update UI before AsyncStorage persist
4. **Error Retry**: Automatic retry untuk failed API calls
5. **Offline Support**: Show cached data when offline
6. **Search Server-side**: Hit API untuk full-text search
7. **State Normalization**: Cafe object di-normalize untuk mencegah duplicate

---

## 18. Testing Strategy (Tidak Implemented, Rekomendasi)

```typescript
// Action test
test('fetchCafes should load data and update page to 2', () => {
  // Mock axios
  // Dispatch action
  // Assert state changes
});

// Reducer test
test('FETCH_CAFE_MORE_SUCCESS should append cafes', () => {
  const state = { cafes: [...initial] };
  const action = { type: FETCH_CAFE_MORE_SUCCESS, payload: newCafes };
  const result = cafeReducer(state, action);
  expect(result.cafes.length).toBe(20);
});

// Component test
test('CafeCard should dispatch toggleFavoriteCafe on heart tap', () => {
  // Render component
  // Mock dispatch
  // Simulate tap
  // Assert dispatch called
});
```

---

## Kesimpulan

Aplikasi ini menggunakan **Redux + Async Thunk** sebagai state management pattern yang robust, dengan **AsyncStorage** untuk persistence. Flow-nya clean: **one action → one reducer → one state update → component re-render**. Search lokal, infinite scroll, dan like functionality semua ter-coordinate melalui Redux, menghasilkan **single source of truth** dan UI yang selalu konsisten.
