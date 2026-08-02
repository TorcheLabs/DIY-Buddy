import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { StatCard } from '../components/StatCard';
import { useAppState } from '../context/AppStateContext';
import { projects } from '../data/projects';
import { ProgressStackParamList } from '../navigation/types';
import { colors, radii, shadow, spacing, typography } from '../theme/theme';
import { formatCurrencyRange } from '../utils/format';

interface ProgressScreenProps {
  navigation: NativeStackNavigationProp<ProgressStackParamList, 'Progress'>;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ navigation }) => {
  const { completedIds, totalValueAdded, progress, isFavorite, toggleFavorite, getProjectProgress } =
    useAppState();

  const completedProjects = useMemo(
    () => projects.filter((p) => completedIds.includes(p.id)),
    [completedIds]
  );

  const inProgressProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (completedIds.includes(p.id)) return false;
        const done = (progress[p.id] ?? []).length;
        return done > 0;
      }),
    [progress, completedIds]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={completedProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>My Progress</Text>
              <Text style={styles.subtitle}>Track your completed home improvement journey</Text>
            </View>

            <View style={styles.statsRow}>
              <StatCard icon="checkmark-done-outline" label="Completed" value={`${completedProjects.length}`} />
              <View style={{ width: spacing.md }} />
              <StatCard icon="hammer-outline" label="In progress" value={`${inProgressProjects.length}`} tint={colors.accent} />
            </View>

            <View style={styles.valueCard}>
              <View style={styles.valueIconWrap}>
                <Ionicons name="trending-up" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.valueLabel}>Estimated home value added</Text>
                <Text style={styles.valueAmount}>
                  {totalValueAdded.high > 0
                    ? formatCurrencyRange(totalValueAdded.low, totalValueAdded.high)
                    : '$0'}
                </Text>
              </View>
            </View>

            {inProgressProjects.length > 0 && (
              <View>
                <Text style={styles.sectionTitle}>In progress</Text>
                {inProgressProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
                    isFavorite={isFavorite(project.id)}
                    onToggleFavorite={() => toggleFavorite(project.id)}
                    progressPercent={getProjectProgress(project.id, project.steps.length)}
                  />
                ))}
              </View>
            )}

            <Text style={styles.sectionTitle}>Completed</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            progressPercent={1}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="trophy-outline"
            title="No completed projects yet"
            subtitle="Open a project, check off its steps, and mark it complete to see it here."
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  valueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  valueLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  valueAmount: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
