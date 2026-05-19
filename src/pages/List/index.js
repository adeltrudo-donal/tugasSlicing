import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import CafeCard from '../../components/organisms/CafeCard';
import Typography from '../../components/atoms/Typography';
import { COLORS } from '../../utils/theme';
import { CafesContext } from '../../context/CafesContext';

const ListPage = ({ navigation }) => {
  const { cafes } = useContext(CafesContext);

  const renderCafeItem = ({ item }) => (
    <CafeCard 
      cafe={item} 
      onPress={() => navigation.navigate('Detail', { cafe: item })} 
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="title">All Cafes</Typography>
      </View>

      <FlatList
        data={cafes}
        keyExtractor={(item) => item.id}
        renderItem={renderCafeItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default ListPage;