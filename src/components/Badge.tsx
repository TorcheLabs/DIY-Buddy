import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radii, spacing, typography } from '../theme/theme';

interface BadgeProps {
  label: string;
  bg: string;
  fg: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, bg, fg }) => (
  <View style={[styles.badge, { backgroundColor: bg }]}>
    <Text style={[styles.text, { color: fg }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
