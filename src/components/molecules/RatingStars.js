import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../../utils/theme';

const RatingStars = ({ rating }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon
        key={i}
        // Jika index saat ini lebih kecil/sama dengan rating, bintang terisi. Jika tidak, kosong.
        name={i <= rating ? 'star' : 'star-o'} 
        size={14}
        color={COLORS.star}
        style={styles.star}
      />
    );
  }

  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  star: {
    marginRight: 4,
  },
});

export default RatingStars;