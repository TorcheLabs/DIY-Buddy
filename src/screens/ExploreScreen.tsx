import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPill } from '../components/CategoryPill';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { SearchBar } from '../components/SearchBar';
import { useAppState } from '../context/AppStateContext';
import { CATEGORIES, DIFFICULTIES, projects } from '../data/projects';
import { ExploreStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/theme';
import { Category, Difficulty } from '../types/project';

interface ExploreScreenProps {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'Explore'>;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<ExploreStackParamList, 'Explore'>>();
  const { toggleFavorite, isFavorite, getProjectProgress } = useAppState();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
    }
  }, [route.params?.category]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (category && p.category !== category) return false;
      if (difficulty && p.difficulty !== difficulty) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.summary.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [category, difficulty, search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Projects</Text>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <FlatList
              data={CATEGORIES as unknown as string[]}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRow}
              renderItem={({ item }) => (
                <CategoryPill
                  label={item}
                  selected={category === item}
                  onPress={() => setCategory(category === item ? null : (item as Category))}
                />
              )}
            />
            <FlatList
              data={DIFFICULTIES as unknown as string[]}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillRowSecondary}
              renderItem={({ item }) => (
                <CategoryPill
                  label={item}
                  selected={difficulty === item}
                  onPress={() => setDifficulty(difficulty === item ? null : (item as Difficulty))}
                />
              )}
            />
            <Text style={styles.resultCount}>
              {filtered.length} project{filtered.length === 1 ? '' : 's'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            progressPercent={getProjectProgress(item.id, item.steps.length)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No projects found"
            subtitle="Try adjusting your filters or search terms."
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
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  pillRow: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  pillRowSecondary: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  resultCount: {
    ...typography.caption,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
