import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../atoms/Typography';
import ImagePlaceholder from '../atoms/ImagePlaceholder';
import { COLORS } from '../../utils/theme';

const MenuCard = ({ menu }) => {
  return (
    <View style={styles.card}>
      
      <ImagePlaceholder size={88} style={styles.image} />
      
      <View style={styles.content}>
        <Typography style={styles.title}>{menu.title}</Typography>
        <Typography variant="body" numberOfLines={3} style={styles.description}>
          {menu.description}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  image: {
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: COLORS.surfaceVariant,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default MenuCard;