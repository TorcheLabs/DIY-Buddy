import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder }) => (
  <View style={styles.container}>
    <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.icon} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? 'Search projects...'}
      placeholderTextColor={colors.textMuted}
      style={styles.input}
      returnKeyType="search"
      autoCorrect={false}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
  },
});
