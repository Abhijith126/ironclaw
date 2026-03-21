export function getDifficultyVariant(difficulty: string) {
  if (difficulty === 'beginner' || difficulty?.includes('Beginner')) return 'success' as const;
  if (difficulty === 'intermediate' || difficulty?.includes('Intermediate')) return 'primary' as const;
  return 'danger' as const;
}
