import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Typography from '../atoms/Typography';
import ImagePlaceholder from '../atoms/ImagePlaceholder';
import RatingStars from '../molecules/RatingStars';
import { COLORS } from '../../utils/theme';
import { CafesContext } from '../../context/CafesContext';

const CafeCard = ({ cafe, onPress, hideActions = false }) => {
  const { toggleFavorite } = useContext(CafesContext);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <ImagePlaceholder size={88} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Typography style={styles.title} numberOfLines={1}>{cafe.title}</Typography>
          {!hideActions && (
            <View style={styles.headerRight}>
              <RatingStars rating={cafe.rating} />
              <TouchableOpacity onPress={() => toggleFavorite(cafe.id)}>
                <Icon 
                  name={cafe.isFavorite ? "heart" : "heart-o"} 
                  size={22} 
                  color={COLORS.textPrimary} 
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.infoRow}>
          <Typography variant="caption">{cafe.category} • {cafe.priceRange} • {cafe.distance}</Typography>
        </View>
        <Typography variant="body" numberOfLines={1} style={styles.desc}>
          {cafe.caption}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    alignItems: 'center',
  },
  image: { borderRadius: 12, marginRight: 16, backgroundColor: COLORS.surfaceVariant },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  infoRow: { marginTop: 2 },
  desc: { marginTop: 4, color: COLORS.textSecondary },
});

export default CafeCard;