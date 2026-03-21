export interface Equipment {
  id: string;
  machineName: string;
  category: string;
  difficultyLevel?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  movementPattern?: string;
  notes?: string;
  videoUrl?: string;
}
