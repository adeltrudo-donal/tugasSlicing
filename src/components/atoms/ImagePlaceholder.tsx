import React from 'react';
import { Image, StyleSheet, StyleProp, ImageStyle } from 'react-native';
import Images from '../../assets/images';
import { COLORS } from '../../utils/theme';

interface ImagePlaceholderProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ size = 80, style }) => {
  return (
    <Image
      source={Images.placeholder}
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
