import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '../atoms/Typography';
import RatingStars from '../molecules/RatingStars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Cafe } from '../../models/Cafe';
import { COLORS } from '../../utils/theme';
import { RootState } from '../../store/store';
import { toggleFavoriteCafe } from '../../action/cafe_action';

interface CafeCardProps {
  cafe: Cafe;
  onPress: () => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onPress }) => {
  const dispatch = useDispatch<any>();
  const isFav = useSelector((state: RootState) => state.cafes.favorites.some((fav) => fav.id === cafe.id));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: cafe.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Typography style={styles.title} numberOfLines={1}>{cafe.name}</Typography>
          <RatingStars rating={parseInt(cafe.rating, 10) || 0} />
          <TouchableOpacity onPress={() => dispatch(toggleFavoriteCafe(cafe))} style={styles.favoriteBtn}>
            <Icon name={isFav ? 'heart' : 'heart-o'} size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <Typography variant="caption" style={styles.subtitle}>
          {cafe.category} • {cafe.priceRange} • {cafe.distance || '1.0 km away'}
        </Typography>
        <Typography variant="body" style={styles.description} numberOfLines={2}>
          {cafe.shortDescription}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceVariant,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: COLORS.surfaceVariant,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  favoriteBtn: {
    marginLeft: 12,
  },
  subtitle: {
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  description: {
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});

export default CafeCard;
