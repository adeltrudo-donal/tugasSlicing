import React, { useContext } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Typography from '../../components/atoms/Typography';
import ImagePlaceholder from '../../components/atoms/ImagePlaceholder';
import MenuCard from '../../components/organisms/MenuCard';
import { MENU_DATA } from '../../utils/mockData';
import { COLORS } from '../../utils/theme';
import { CafesContext } from '../../context/CafesContext';

const DetailPage = ({ route, navigation }) => {
  const { cafes, toggleFavorite } = useContext(CafesContext);
  const initialCafe = route.params.cafe;
  
  const currentCafe = cafes.find(c => c.id === initialCafe.id) || initialCafe;

  const Header = () => (
    <View>
      <View style={styles.navBar}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Typography style={styles.navTitle}>Detail</Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <TouchableOpacity onPress={() => toggleFavorite(currentCafe.id)}>
             <Icon name={currentCafe.isFavorite ? "heart" : "heart-o"} size={24} color={COLORS.textPrimary} style={{ marginRight: 16 }} />
           </TouchableOpacity>
           <Icon name="ellipsis-v" size={24} color={COLORS.textPrimary} />
        </View>
      </View>

      <View style={styles.topInfo}>
        <ImagePlaceholder size={120} style={{ borderRadius: 16 }} />
        <View style={styles.topText}>
            <Typography style={styles.cafeTitle}>{currentCafe.title}</Typography>
            <Typography style={styles.cafeCat}>{currentCafe.category}</Typography>
            <TouchableOpacity style={styles.mapBtn}>
                <Typography style={styles.mapText}>Open Map</Typography>
            </TouchableOpacity>
        </View>
      </View>

      {currentCafe.caption && <Typography style={styles.caption}>{currentCafe.caption}</Typography>}
      <Typography style={styles.desc}>{currentCafe.description}</Typography>
      <View style={styles.menuTitleRow}>
        <Typography style={styles.menuTitle}>Menu</Typography>
        <Icon name="chevron-right" size={24} color={COLORS.textPrimary} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <FlatList
        data={MENU_DATA}
        ListHeaderComponent={Header}
        renderItem={({ item }) => <MenuCard menu={item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navBar: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, alignItems: 'center' },
  navTitle: { fontSize: 20, fontWeight: '500', marginLeft: 16 },
  topInfo: { flexDirection: 'row', marginVertical: 24 },
  topText: { marginLeft: 20, flex: 1, justifyContent: 'center' },
  cafeTitle: { fontSize: 24, fontWeight: 'bold' },
  cafeCat: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 12 },
  mapBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, alignSelf: 'flex-start' },
  mapText: { color: 'white', fontWeight: 'bold' },
  caption: { fontSize: 14, fontWeight: 'bold', color: COLORS.textSecondary, marginBottom: 8 },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: 24 },
  menuTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  menuTitle: { fontSize: 22, fontWeight: 'bold', marginRight: 8 }
});

export default DetailPage;