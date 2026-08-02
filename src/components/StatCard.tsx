import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadow, spacing, typography } from '../theme/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, tint = colors.primary }) => (
  <View style={styles.card}>
    <View style={[styles.iconWrap, { backgroundColor: `${tint}1A` }]}>
      <Ionicons name={icon} size={18} color={tint} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadow.card,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
