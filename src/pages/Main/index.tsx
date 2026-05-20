import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import CafeCard from '../../components/organisms/CafeCard';
import Typography from '../../components/atoms/Typography';
import Images from '../../assets/images';
import { COLORS } from '../../utils/theme';
import { RootState } from '../../store/store';
import { fetchCafes, fetchMoreCafes, loadFavorites } from '../../action/cafe_action';

type Props = {
  navigation: any;
};

const ListHeader = ({ filter, setFilter }: { filter: 'nearest' | 'popular', setFilter: (val: 'nearest' | 'popular') => void }) => (
  <View style={styles.container}>
    <ImageBackground source={Images.placeholder} style={styles.hero} imageStyle={{ borderRadius: 28, resizeMode: 'cover' }}>
      <Typography style={styles.heroTitle}>Cafes List</Typography>
      <Typography style={styles.heroSubtitle}>Subtitle</Typography>
      <View style={styles.chipRow}>
         <View style={styles.chip}>
           <Icon name="calendar-o" size={14} color={COLORS.onPrimaryContainer} style={{ marginRight: 6 }} />
           <Typography style={styles.chipText}>Label 1</Typography>
         </View>
         <View style={styles.chip}>
           <Icon name="user" size={14} color={COLORS.onPrimaryContainer} style={{ marginRight: 6 }} />
           <Typography style={styles.chipText}>Label 2</Typography>
         </View>
      </View>
    </ImageBackground>

    <View style={styles.segmentContainer}>
      <TouchableOpacity 
        style={[styles.segment, filter === 'nearest' && styles.activeSegment]} 
        onPress={() => setFilter('nearest')}
      >
        {filter === 'nearest' && <Icon name="check" size={16} color={COLORS.primary} />}
        <Typography style={filter === 'nearest' ? styles.activeText : styles.inactiveText}>Nearest</Typography>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.segment, filter === 'popular' && styles.activeSegment]} 
        onPress={() => setFilter('popular')}
      >
        {filter === 'popular' && <Icon name="check" size={16} color={COLORS.primary} />}
        <Typography style={filter === 'popular' ? styles.activeText : styles.inactiveText}>Popular</Typography>
      </TouchableOpacity>
    </View>
  </View>
);

const ListFooter = ({ isLoadingMore }: { isLoadingMore: boolean }) => {
  if (isLoadingMore) {
    return <ActivityIndicator size="small" color={COLORS.primary} style={{ paddingVertical: 16 }} />;
  }

  // return (
  //   <TouchableOpacity style={styles.footerBtn}>
  //     <Typography style={styles.footerText}>View 231 Restaurants</Typography>
  //   </TouchableOpacity>
  // );
};

const MainPage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<any>();
  const cafes = useSelector((state: RootState) => state.cafes.cafes);
  const { page, hasMore, loadingMore } = useSelector((state: RootState) => ({
    page: state.cafes.page,
    hasMore: state.cafes.hasMore,
    loadingMore: state.cafes.loadingMore,
  }));
  const [filter, setFilter] = useState<'nearest' | 'popular'>('nearest');
  const lastPageRef = useRef<number>(1);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchCafes());
    lastPageRef.current = 1;
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && page > lastPageRef.current) {
      lastPageRef.current = page;
      dispatch(fetchMoreCafes(page));
    }
  };

  const sortedCafes = [...cafes].sort((a: any, b: any) => {
    if (filter === 'nearest') {
      const distA = parseFloat(a.distance || '0');
      const distB = parseFloat(b.distance || '0');
      return distA - distB;
    }

    return (parseInt(b.rating, 10) || 0) - (parseInt(a.rating, 10) || 0);
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <FlatList
        data={sortedCafes}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <CafeCard cafe={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />}
        ListHeaderComponent={<ListHeader filter={filter} setFilter={setFilter} />}
        ListFooterComponent={<ListFooter isLoadingMore={loadingMore} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {},
  hero: { height: 280, backgroundColor: '#BDBDBD', borderRadius: 28, marginTop: 10, padding: 24, justifyContent: 'flex-end', overflow: 'hidden' },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: 'white' },
  heroSubtitle: { color: 'white', marginBottom: 12 },
  chipRow: { flexDirection: 'row' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryContainer, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  chipText: { color: COLORS.onPrimaryContainer, fontSize: 12 },
  segmentContainer: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.outline, borderRadius: 25, marginVertical: 20, overflow: 'hidden' },
  segment: { flex: 1, paddingVertical: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  activeSegment: { backgroundColor: COLORS.primaryContainer },
  activeText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 4 },
  inactiveText: { color: COLORS.textPrimary, marginLeft: 4 },
  footerBtn: { borderWidth: 1, borderColor: COLORS.outline, borderRadius: 25, padding: 12, alignItems: 'center', marginTop: 20 },
  footerText: { color: COLORS.primary, fontWeight: '500' },
  circleDecor: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: '#E0E0E0', right: -20, top: 20 },
  squareDecor: { position: 'absolute', width: 100, height: 100, backgroundColor: '#9E9E9E', left: 40, top: -20, transform: [{ rotate: '45deg' }] },
});

export default MainPage;
