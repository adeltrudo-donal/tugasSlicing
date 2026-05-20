import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useCafes } from '../../context/CafesContext';
import CafeCard from '../../components/organisms/CafeCard';

type Props = {
  navigation: any;
};

const FavoriteScreen: React.FC<Props> = ({ navigation }) => {
  const { favorites } = useCafes();

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
        keyExtractor={(item) => item.id.toString()}
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
    paddingVertical: 16,
  },
});

export default FavoriteScreen;
