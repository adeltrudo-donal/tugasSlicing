import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle, StyleProp } from 'react-native';
import { COLORS } from '../../utils/theme';

interface TypographyProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ children, variant = 'body', style, ...props }) => {
  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  body: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default Typography;
