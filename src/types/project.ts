export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category =
  | 'Kitchen'
  | 'Bathroom'
  | 'Curb Appeal'
  | 'Energy Efficiency'
  | 'Outdoor'
  | 'Interior Paint'
  | 'Storage'
  | 'Flooring';

export interface ProjectStep {
  title: string;
  description: string;
  estimatedMinutes: number;
}

export interface Project {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  summary: string;
  icon: string;
  gradient: [string, string];
  estimatedCostLow: number;
  estimatedCostHigh: number;
  estimatedHours: number;
  roiPercent: number;
  valueAddLow: number;
  valueAddHigh: number;
  tools: string[];
  materials: string[];
  steps: ProjectStep[];
  safetyTips: string[];
  proTip: string;
}
