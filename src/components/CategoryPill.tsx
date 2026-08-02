import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface CategoryPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.pill, selected && styles.pillSelected]}
    accessibilityRole="button"
    accessibilityState={{ selected }}
  >
    <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.white,
    fontWeight: '700',
  },
});
