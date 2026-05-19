import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Images from '../../assets/images';
import { COLORS } from '../../utils/theme';

const ImagePlaceholder = ({ size = 80, style }) => {
  return (
    <Image
      source={Images.placeholder} // Memanggil dari setup Tahap 1
      style={[
        styles.image,
        { width: size, height: size, borderRadius: size * 0.15 },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.surfaceVariant,
    resizeMode: 'cover',
  },
});

export default ImagePlaceholder;