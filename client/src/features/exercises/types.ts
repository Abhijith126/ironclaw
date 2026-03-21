export interface ExerciseDetail {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  imageUrl?: string;
  description?: string;
  howTo?: {
    steps: string[];
    tips: string[];
  };
  muscles?: string[];
  musclesSecondary?: string[];
  equipmentList?: string[];
  demoUrl?: string;
  explainUrl?: string;
}
