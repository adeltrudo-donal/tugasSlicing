import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TextInput } from 'react-native';
import { useCafes } from '../../context/CafesContext';
import CafeCard from '../../components/organisms/CafeCard';

type Props = {
  navigation: any;
};

const ListScreen: React.FC<Props> = ({ navigation }) => {
  const { cafes, loading, error, fetchCafes, searchCafes } = useCafes();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchCafes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    searchCafes(keyword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafes..."
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
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
          data={cafes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CafeCard
              cafe={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: 20,
  },
});

export default ListScreen;
