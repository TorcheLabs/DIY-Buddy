import { Category } from '../types/project';

export type HomeStackParamList = {
  Home: undefined;
  Explore: { category?: Category } | undefined;
  ProjectDetail: { projectId: string };
};

export type ExploreStackParamList = {
  Explore: { category?: Category } | undefined;
  ProjectDetail: { projectId: string };
};

export type SavedStackParamList = {
  Saved: undefined;
  ProjectDetail: { projectId: string };
};

export type ProgressStackParamList = {
  Progress: undefined;
  ProjectDetail: { projectId: string };
};

export type RootTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  SavedTab: undefined;
  ProgressTab: undefined;
};
