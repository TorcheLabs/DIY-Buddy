import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../components/Badge';
import { useAppState } from '../context/AppStateContext';
import { projects } from '../data/projects';
import { ExploreStackParamList } from '../navigation/types';
import { categoryColors, colors, difficultyColors, radii, shadow, spacing, typography } from '../theme/theme';
import { formatCurrencyRange, formatHours, formatMinutes } from '../utils/format';

type DetailRoute = RouteProp<ExploreStackParamList, 'ProjectDetail'>;

type TabKey = 'overview' | 'steps' | 'materials';

export const ProjectDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation();
  const { projectId } = route.params;
  const project = useMemo(() => projects.find((p) => p.id === projectId), [projectId]);

  const {
    isFavorite,
    toggleFavorite,
    isStepComplete,
    toggleStepComplete,
    getProjectProgress,
    completedIds,
    markProjectComplete,
  } = useAppState();

  const [tab, setTab] = useState<TabKey>('overview');

  if (!project) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Project not found.</Text>
      </SafeAreaView>
    );
  }

  const diffColor = difficultyColors[project.difficulty];
  const catColor = categoryColors[project.category];
  const progressPercent = getProjectProgress(project.id, project.steps.length);
  const isMarkedComplete = completedIds.includes(project.id);
  const favorite = isFavorite(project.id);

  const handleMarkComplete = () => {
    if (!isMarkedComplete && progressPercent < 1) {
      Alert.alert(
        'Mark as complete?',
        'Not all steps are checked off yet. Mark this project complete anyway?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Mark Complete', onPress: () => markProjectComplete(project.id) },
        ]
      );
    } else {
      markProjectComplete(project.id);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={project.gradient} style={styles.hero}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(project.id)}
            style={styles.favoriteButton}
            hitSlop={12}
          >
            <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={22} color="#fff" />
          </Pressable>
          <View style={styles.heroIconWrap}>
            <Ionicons name={project.icon as any} size={40} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{project.title}</Text>
          <View style={styles.heroBadges}>
            <Badge label={project.category} bg="rgba(255,255,255,0.25)" fg="#fff" />
            <Badge label={project.difficulty} bg="rgba(255,255,255,0.25)" fg="#fff" />
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <StatBlock icon="cash-outline" label="Est. cost" value={formatCurrencyRange(project.estimatedCostLow, project.estimatedCostHigh)} />
          <StatBlock icon="time-outline" label="Time" value={formatHours(project.estimatedHours)} />
          <StatBlock icon="trending-up-outline" label="Avg. ROI" value={`${project.roiPercent}%`} />
          <StatBlock
            icon="home-outline"
            label="Value add"
            value={formatCurrencyRange(project.valueAddLow, project.valueAddHigh)}
          />
        </View>

        <View style={styles.tabRow}>
          <TabButton label="Overview" active={tab === 'overview'} onPress={() => setTab('overview')} />
          <TabButton label={`Steps (${project.steps.length})`} active={tab === 'steps'} onPress={() => setTab('steps')} />
          <TabButton label="Materials" active={tab === 'materials'} onPress={() => setTab('materials')} />
        </View>

        <View style={styles.tabContent}>
          {tab === 'overview' && (
            <View>
              <Text style={styles.summary}>{project.summary}</Text>

              <SectionTitle icon="bulb-outline" title="Pro tip" color={colors.gold} />
              <Text style={styles.paragraph}>{project.proTip}</Text>

              <SectionTitle icon="warning-outline" title="Safety tips" color={colors.danger} />
              {project.safetyTips.map((tip, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{tip}</Text>
                </View>
              ))}

              <View style={[styles.categoryTag, { backgroundColor: catColor.bg }]}>
                <Text style={[styles.categoryTagText, { color: catColor.fg }]}>
                  Category · {project.category}
                </Text>
              </View>
            </View>
          )}

          {tab === 'steps' && (
            <View>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressHeaderText}>
                  {Math.round(progressPercent * 100)}% complete
                </Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(progressPercent * 100)}%` }]} />
                </View>
              </View>
              {project.steps.map((step, idx) => {
                const done = isStepComplete(project.id, idx);
                return (
                  <Pressable
                    key={idx}
                    style={[styles.stepCard, done && styles.stepCardDone]}
                    onPress={() => toggleStepComplete(project.id, idx)}
                  >
                    <View style={[styles.stepCheckbox, done && styles.stepCheckboxDone]}>
                      {done && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                    <View style={styles.stepBody}>
                      <Text style={[styles.stepTitle, done && styles.stepTitleDone]}>
                        {idx + 1}. {step.title}
                      </Text>
                      <Text style={styles.stepDescription}>{step.description}</Text>
                      <View style={styles.stepMetaRow}>
                        <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                        <Text style={styles.stepMetaText}>{formatMinutes(step.estimatedMinutes)}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}

              <Pressable
                style={[styles.completeButton, isMarkedComplete && styles.completeButtonDone]}
                onPress={handleMarkComplete}
              >
                <Ionicons
                  name={isMarkedComplete ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.completeButtonText}>
                  {isMarkedComplete ? 'Marked as complete' : 'Mark project complete'}
                </Text>
              </Pressable>
            </View>
          )}

          {tab === 'materials' && (
            <View>
              <SectionTitle icon="construct-outline" title="Tools needed" color={colors.primary} />
              {project.tools.map((tool, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Ionicons name="build-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.bulletText}>{tool}</Text>
                </View>
              ))}

              <SectionTitle icon="bag-outline" title="Materials" color={colors.accent} />
              {project.materials.map((material, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.bulletText}>{material}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatBlock: React.FC<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.statBlock}>
    <Ionicons name={icon} size={16} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const TabButton: React.FC<{ label: string; active: boolean; onPress: () => void }> = ({
  label,
  active,
  onPress,
}) => (
  <Pressable style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
  </Pressable>
);

const SectionTitle: React.FC<{ icon: keyof typeof Ionicons.glyphMap; title: string; color: string }> = ({
  icon,
  title,
  color,
}) => (
  <View style={styles.sectionTitleRow}>
    <Ionicons name={icon} size={16} color={color} />
    <Text style={styles.sectionTitleText}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  notFound: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  hero: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    ...typography.h1,
    color: '#fff',
    marginBottom: spacing.sm,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    gap: spacing.sm,
  },
  statBlock: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadow.card,
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  tabButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tabButtonTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  tabContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summary: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitleText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  paragraph: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
    marginTop: 7,
  },
  bulletText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    marginTop: spacing.lg,
  },
  categoryTagText: {
    ...typography.caption,
    fontWeight: '700',
  },
  progressHeaderRow: {
    marginBottom: spacing.lg,
  },
  progressHeaderText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  stepCardDone: {
    opacity: 0.6,
  },
  stepCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepCheckboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepBody: {
    flex: 1,
  },
  stepTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  stepTitleDone: {
    textDecorationLine: 'line-through',
  },
  stepDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  stepMetaText: {
    ...typography.small,
    color: colors.textMuted,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  completeButtonDone: {
    backgroundColor: colors.primaryDark,
  },
  completeButtonText: {
    ...typography.bodyBold,
    color: '#fff',
  },
});
