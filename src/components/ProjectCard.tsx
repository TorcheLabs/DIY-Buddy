import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Project } from '../types/project';
import { colors, difficultyColors, radii, shadow, spacing, typography } from '../theme/theme';
import { formatCurrencyRange, formatHours } from '../utils/format';
import { Badge } from './Badge';

interface ProjectCardProps {
  project: Project;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  progressPercent?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  isFavorite,
  onToggleFavorite,
  progressPercent,
}) => {
  const diffColor = difficultyColors[project.difficulty];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${project.title} project details`}
    >
      <LinearGradient colors={project.gradient} style={styles.iconWrap}>
        <Ionicons name={project.icon as any} size={30} color="#fff" />
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {project.title}
          </Text>
          {onToggleFavorite && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              hitSlop={10}
              accessibilityLabel={isFavorite ? 'Remove from saved' : 'Save project'}
            >
              <Ionicons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isFavorite ? colors.accent : colors.textMuted}
              />
            </Pressable>
          )}
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {project.summary}
        </Text>

        <View style={styles.metaRow}>
          <Badge label={project.difficulty} bg={diffColor.bg} fg={diffColor.fg} />
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatCurrencyRange(project.estimatedCostLow, project.estimatedCostHigh)}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.metaText}>{formatHours(project.estimatedHours)}</Text>
          </View>
        </View>

        <View style={styles.roiRow}>
          <Ionicons name="trending-up-outline" size={14} color={colors.primary} />
          <Text style={styles.roiText}>{project.roiPercent}% average ROI</Text>
        </View>

        {typeof progressPercent === 'number' && progressPercent > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progressPercent * 100)}%` }]} />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  body: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  summary: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  roiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  roiText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
});
