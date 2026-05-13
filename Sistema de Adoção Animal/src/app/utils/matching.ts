import type { Pet } from '../types';

interface AdopterPreferences {
  preferredSpecies: 'dog' | 'cat' | 'any';
  preferredSize: 'small' | 'medium' | 'large' | 'any';
  preferredTemperament: string[];
  maxAge?: number;
}

export function calculateMatchScore(pet: Pet, preferences: AdopterPreferences): number {
  let score = 0;
  let totalFactors = 0;

  // Species match (30 points)
  totalFactors += 30;
  if (preferences.preferredSpecies === 'any' || pet.species === preferences.preferredSpecies) {
    score += 30;
  }

  // Size match (20 points)
  totalFactors += 20;
  if (preferences.preferredSize === 'any' || pet.size === preferences.preferredSize) {
    score += 20;
  }

  // Age match (15 points)
  if (preferences.maxAge !== undefined) {
    totalFactors += 15;
    if (pet.age <= preferences.maxAge) {
      score += 15;
    }
  }

  // Temperament match (35 points)
  totalFactors += 35;
  if (preferences.preferredTemperament.length > 0) {
    const matchingTraits = pet.temperament.filter(trait =>
      preferences.preferredTemperament.includes(trait)
    ).length;
    const temperamentScore = (matchingTraits / preferences.preferredTemperament.length) * 35;
    score += Math.round(temperamentScore);
  } else {
    // If no temperament preference, give full points
    score += 35;
  }

  // Normalize to percentage
  return Math.round((score / totalFactors) * 100);
}

export function findBestMatches(
  pets: Pet[],
  preferences: AdopterPreferences,
  minScore: number = 70
): Array<{ pet: Pet; score: number }> {
  return pets
    .map(pet => ({
      pet,
      score: calculateMatchScore(pet, preferences)
    }))
    .filter(match => match.score >= minScore)
    .sort((a, b) => b.score - a.score);
}
