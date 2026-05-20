import React, { useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CafeCard from '../../components/organisms/CafeCard';
import { loadFavorites } from '../../action/cafe_action';
import { RootState } from '../../store/store';

type Props = {
  navigation: any;
};

const FavoriteScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<any>();
  const favorites = useSelector((state: RootState) => state.cafes.favorites);

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No favorite cafes yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <CafeCard
            cafe={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
});

export default FavoriteScreen;
