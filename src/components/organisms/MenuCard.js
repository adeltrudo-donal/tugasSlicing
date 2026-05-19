import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typography from '../atoms/Typography';
import ImagePlaceholder from '../atoms/ImagePlaceholder';
import { COLORS } from '../../utils/theme';

const MenuCard = ({ menu }) => {
  return (
    <View style={styles.card}>
      {/* Gambar Menu */}
      <ImagePlaceholder size={88} style={styles.image} />
      
      {/* Info Menu */}
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
    marginBottom: 24, // Memberikan jarak yang lega antar menu seperti di Figma
    alignItems: 'flex-start',
  },
  image: {
    borderRadius: 16, // Mengikuti radius gambar yang cukup membulat
    marginRight: 16,
    backgroundColor: COLORS.surfaceVariant,
  },
  content: {
    flex: 1, // Agar teks deskripsi membungkus rapi ke bawah
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 6, // Jarak antara judul dan deskripsi
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22, // Line height dinaikkan sedikit agar teks tidak terlalu berdempetan
  },
});

export default MenuCard;