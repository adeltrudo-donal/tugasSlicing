import React, { useEffect, useRef } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CafeCard from '../../components/organisms/CafeCard';
import { fetchCafes, fetchMoreCafes, loadFavorites, setSearchKeyword } from '../../action/cafe_action';
import { RootState } from '../../store/store';

type Props = {
  navigation: any;
};

const ListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<any>();
  const { cafes, loading, loadingMore, error, page, hasMore, searchKeyword } = useSelector((state: RootState) => state.cafes);
  const lastPageRef = useRef<number>(1);
  
  const filteredCafes = cafes.filter((cafe) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return true;
    }

    return (
      cafe.name.toLowerCase().includes(keyword) ||
      cafe.category.toLowerCase().includes(keyword) ||
      cafe.shortDescription.toLowerCase().includes(keyword)
    );
  });

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchCafes());
    lastPageRef.current = 1;
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && page > lastPageRef.current) {
      lastPageRef.current = page;
      dispatch(fetchMoreCafes(page));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafes..."
          value={searchKeyword}
          onChangeText={(text) => dispatch(setSearchKeyword(text))}
          returnKeyType="search"
          placeholderTextColor="#999"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.centered} />
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCafes}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <CafeCard
              cafe={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#0000ff" style={styles.footerLoader} /> : null}
          ListEmptyComponent={(
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No cafes found.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    height: 44,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa',
    color: '#333333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#d32f2f',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  footerLoader: {
    paddingVertical: 16,
  },
});

export default ListScreen;
