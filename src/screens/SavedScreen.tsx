import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { useAppState } from '../context/AppStateContext';
import { projects } from '../data/projects';
import { SavedStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/theme';

interface SavedScreenProps {
  navigation: NativeStackNavigationProp<SavedStackParamList, 'Saved'>;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({ navigation }) => {
  const { favoriteIds, toggleFavorite, isFavorite, getProjectProgress } = useAppState();

  const savedProjects = useMemo(
    () => projects.filter((p) => favoriteIds.includes(p.id)),
    [favoriteIds]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Projects</Text>
        <Text style={styles.subtitle}>
          {savedProjects.length} project{savedProjects.length === 1 ? '' : 's'} bookmarked for later
        </Text>
      </View>

      <FlatList
        data={savedProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
            icon="bookmark-outline"
            title="No saved projects yet"
            subtitle="Tap the bookmark icon on any project to save it here for quick access."
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
