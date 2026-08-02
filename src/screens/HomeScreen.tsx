import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../components/CategoryPill';
import { ProjectCard } from '../components/ProjectCard';
import { StatCard } from '../components/StatCard';
import { useAppState } from '../context/AppStateContext';
import { CATEGORIES, projects } from '../data/projects';
import { colors, radii, spacing, typography } from '../theme/theme';
import { formatCurrencyRange } from '../utils/format';
import type { HomeStackParamList } from '../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { toggleFavorite, isFavorite, getProjectProgress, completedIds } = useAppState();

  const topRoiProjects = useMemo(
    () => [...projects].sort((a, b) => b.roiPercent - a.roiPercent).slice(0, 5),
    []
  );

  const quickWins = useMemo(
    () => projects.filter((p) => p.difficulty === 'Easy' && p.estimatedHours <= 4).slice(0, 5),
    []
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.hero}>
          <Text style={styles.heroKicker}>HomeValue DIY</Text>
          <Text style={styles.heroTitle}>Grow your home's value,{`\n`}one weekend at a time.</Text>
          <Text style={styles.heroSubtitle}>
            {projects.length} guided projects with real cost estimates, tools, and step-by-step instructions.
          </Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <StatCard icon="checkmark-done-outline" label="Completed" value={`${completedIds.length}`} />
          <View style={{ width: spacing.md }} />
          <StatCard
            icon="construct-outline"
            label="Total projects"
            value={`${projects.length}`}
            tint={colors.accent}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by category</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              selected={false}
              onPress={() => navigation.navigate('Explore', { category: cat })}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Ionicons name="trending-up-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>Best return on investment</Text>
        </View>
        {topRoiProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            isFavorite={isFavorite(project.id)}
            onToggleFavorite={() => toggleFavorite(project.id)}
            progressPercent={getProjectProgress(project.id, project.steps.length)}
          />
        ))}

        <View style={styles.sectionHeader}>
          <Ionicons name="flash-outline" size={18} color={colors.accent} />
          <Text style={styles.sectionTitle}>Quick weekend wins</Text>
        </View>
        {quickWins.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}
            isFavorite={isFavorite(project.id)}
            onToggleFavorite={() => toggleFavorite(project.id)}
            progressPercent={getProjectProgress(project.id, project.steps.length)}
          />
        ))}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Value estimates like {formatCurrencyRange(200, 900)} are illustrative averages based on common
            renovation cost/value data and vary by market.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hero: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroKicker: {
    ...typography.small,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.primaryLight,
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  categoryRow: {
    paddingBottom: spacing.md,
  },
  footerNote: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  footerText: {
    ...typography.small,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
