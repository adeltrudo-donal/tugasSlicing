import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { Cafe, Menu } from '../../models/Cafe';
import MenuCard from '../../components/organisms/MenuCard';
import Typography from '../../components/atoms/Typography';
import { COLORS } from '../../utils/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootState } from '../../store/store';
import { toggleFavoriteCafe } from '../../action/cafe_action';

// IMPORTANT: To make react-native-maps work on Android, you must add your Google Maps API Key
// inside android/app/src/main/AndroidManifest.xml inside the <application> tag.

type Props = {
  route: any;
  navigation: any;
};

const BASE_URL = 'https://mock-api.ahmadfaisal.space';

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const dispatch = useDispatch<any>();
  const cafes = useSelector((state: RootState) => state.cafes.cafes);
  const favorites = useSelector((state: RootState) => state.cafes.favorites);
  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);

  useEffect(() => {
    const foundCafe = cafes.find((c) => String(c.id) === String(id));
    if (foundCafe) {
      setCafe(foundCafe);
      fetchMenus(foundCafe.menuId);
    }
  }, [id, cafes]);

  const fetchMenus = async (menuIdsStr: string) => {
    if (!menuIdsStr) return;
    setLoadingMenus(true);
    try {
      const ids = menuIdsStr.split(';').map(mid => `id=${mid}`).join('&');
      const response = await axios.get(`${BASE_URL}/menus?${ids}`);
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        setMenus(data);
      } else if (data) {
        setMenus([data]);
      }
    } catch (e) {
      console.error('Failed to fetch menus', e);
    } finally {
      setLoadingMenus(false);
    }
  };

  if (!cafe) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isFav = favorites.some((fav) => fav.id === cafe.id);

  let latitude = 0;
  let longitude = 0;
  if (cafe.latlong) {
    const parts = cafe.latlong.split(';');
    if (parts.length === 2) {
      latitude = parseFloat(parts[0]);
      longitude = parseFloat(parts[1]);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: cafe.image }} style={styles.image} />
      
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.header}>
          <Typography style={styles.title}>{cafe.name}</Typography>
          <TouchableOpacity 
            style={styles.favoriteBtn} 
            onPress={() => dispatch(toggleFavoriteCafe(cafe))}
          >
            <Icon name={isFav ? 'heart' : 'heart-o'} size={24} color={isFav ? COLORS.primary : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <Typography style={styles.categoryInfo}>
          {cafe.category} • {cafe.priceRange} • {cafe.distance || '1.0 km away'}
        </Typography>

        <Typography style={styles.description}>
          {cafe.description1}
        </Typography>
        {!!cafe.description2 && (
          <Typography style={styles.description}>
            {cafe.description2}
          </Typography>
        )}

        {menus.length > 0 && <Typography style={styles.sectionTitle}>Menus</Typography>}
        {loadingMenus ? (
          <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 16 }} />
        ) : (
          menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))
        )}

        {latitude !== 0 && longitude !== 0 && (
          <View style={styles.mapContainer}>
            <Typography style={styles.sectionTitle}>Location</Typography>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker 
                coordinate={{ latitude, longitude }} 
                title={cafe.name} 
              />
            </MapView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#e0e0e0',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  content: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },
  favoriteBtn: {
    padding: 8,
  },
  categoryInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 8,
    marginBottom: 16,
  },
  mapContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});

export default DetailScreen;
