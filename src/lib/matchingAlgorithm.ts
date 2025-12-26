// Passport Pals Matching Algorithm
// Deterministic scoring based on profile compatibility

import { UserProfile } from '@/data/seedData';

export interface MatchScore {
  compatibilityPercent: number;
  reasons: string[];
}

export interface MatchResult {
  user: UserProfile;
  score: MatchScore;
}

// Calculate interest overlap score (0-100)
const calculateInterestScore = (user1: UserProfile, user2: UserProfile): { score: number; matches: string[] } => {
  const commonInterests = user1.interests.filter(i => user2.interests.includes(i));
  const score = Math.min((commonInterests.length / 3) * 100, 100);
  return { score, matches: commonInterests.slice(0, 3) };
};

// Calculate personality slider similarity (0-100)
const calculatePersonalityScore = (user1: UserProfile, user2: UserProfile): { score: number; insight: string | null } => {
  const sliders = ['planningStyle', 'socialBattery', 'foodAdventure', 'dailyPace'] as const;
  
  let totalDiff = 0;
  let closestMatch: { key: string; diff: number } | null = null;
  
  for (const key of sliders) {
    const diff = Math.abs(user1.personalitySliders[key] - user2.personalitySliders[key]);
    totalDiff += diff;
    
    if (!closestMatch || diff < closestMatch.diff) {
      closestMatch = { key, diff };
    }
  }
  
  const avgDiff = totalDiff / sliders.length;
  const score = Math.max(0, 100 - avgDiff);
  
  let insight: string | null = null;
  if (closestMatch && closestMatch.diff < 20) {
    const insightMap: Record<string, string> = {
      planningStyle: 'Same travel planning style',
      socialBattery: 'Similar social energy',
      foodAdventure: 'Both love food adventures',
      dailyPace: 'Same daily pace',
    };
    insight = insightMap[closestMatch.key];
  }
  
  return { score, insight };
};

// Calculate language overlap score (0-100)
const calculateLanguageScore = (user1: UserProfile, user2: UserProfile): { score: number; overlap: string[] } => {
  const commonLanguages = user1.languages.filter(l => user2.languages.includes(l));
  
  if (commonLanguages.length === 0) {
    return { score: 30, overlap: [] }; // Base score - can still communicate via translation
  }
  
  const score = Math.min(50 + commonLanguages.length * 25, 100);
  return { score, overlap: commonLanguages };
};

// Calculate age preference compatibility (0-100)
const calculateAgeScore = (user1: UserProfile, user2: UserProfile): number => {
  const user1InRange = user2.age >= user1.agePreference.min && user2.age <= user1.agePreference.max;
  const user2InRange = user1.age >= user2.agePreference.min && user1.age <= user2.agePreference.max;
  
  if (user1InRange && user2InRange) return 100;
  if (user1InRange || user2InRange) return 60;
  
  // Calculate how far out of range
  const ageDiff = Math.abs(user1.age - user2.age);
  return Math.max(0, 80 - ageDiff * 3);
};

// Calculate travel style overlap (0-100)
const calculateTravelStyleScore = (user1: UserProfile, user2: UserProfile): { score: number; matches: string[] } => {
  const commonStyles = user1.travelStyle.filter(s => user2.travelStyle.includes(s));
  const score = commonStyles.length > 0 ? Math.min(50 + commonStyles.length * 25, 100) : 40;
  return { score, matches: commonStyles };
};

// Main matching function
export const calculateCompatibility = (currentUser: UserProfile, candidate: UserProfile): MatchScore => {
  const reasons: string[] = [];
  let totalScore = 0;
  let weightTotal = 0;

  // Interest overlap (weight: 25%)
  const interestResult = calculateInterestScore(currentUser, candidate);
  totalScore += interestResult.score * 0.25;
  weightTotal += 0.25;
  if (interestResult.matches.length > 0) {
    const formattedInterests = interestResult.matches.slice(0, 2).map(i => 
      i.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())
    );
    reasons.push(`Both love ${formattedInterests.join(' & ')}`);
  }

  // Personality similarity (weight: 20%)
  const personalityResult = calculatePersonalityScore(currentUser, candidate);
  totalScore += personalityResult.score * 0.20;
  weightTotal += 0.20;
  if (personalityResult.insight) {
    reasons.push(personalityResult.insight);
  }

  // Language overlap (weight: 20%)
  const languageResult = calculateLanguageScore(currentUser, candidate);
  totalScore += languageResult.score * 0.20;
  weightTotal += 0.20;
  if (languageResult.overlap.length > 0) {
    reasons.push(`Language overlap: ${languageResult.overlap.slice(0, 2).join(' + ')}`);
  }

  // Age compatibility (weight: 10%)
  const ageScore = calculateAgeScore(currentUser, candidate);
  totalScore += ageScore * 0.10;
  weightTotal += 0.10;

  // Travel style (weight: 15%)
  const travelStyleResult = calculateTravelStyleScore(currentUser, candidate);
  totalScore += travelStyleResult.score * 0.15;
  weightTotal += 0.15;
  if (travelStyleResult.matches.length > 0 && reasons.length < 3) {
    reasons.push(`Both chase ${travelStyleResult.matches[0]}`);
  }

  // Verification bonus (weight: 5%)
  const verificationScore = candidate.verificationStatus === 'verified' ? 100 : 50;
  totalScore += verificationScore * 0.05;
  weightTotal += 0.05;

  // Rating bonus (weight: 5%)
  const ratingScore = Math.min((candidate.avgRating / 5) * 100, 100);
  totalScore += ratingScore * 0.05;
  weightTotal += 0.05;

  // Normalize score
  const finalScore = Math.round(totalScore / weightTotal);

  // Ensure we have at least 2 reasons
  if (reasons.length < 2) {
    if (candidate.hostingEnabled) {
      reasons.push('Available to host');
    }
    if (candidate.reviewCount > 5) {
      reasons.push('Experienced host');
    }
    if (reasons.length < 2) {
      reasons.push('Great for cultural exchange');
    }
  }

  return {
    compatibilityPercent: Math.min(99, Math.max(45, finalScore)),
    reasons: reasons.slice(0, 3),
  };
};

// Get ranked matches for a user
export const getRankedMatches = (
  currentUser: UserProfile,
  allUsers: UserProfile[],
  swipedUserIds: Set<string>,
  filters?: {
    ageRange?: { min: number; max: number };
    languages?: string[];
    interests?: string[];
    hostingOnly?: boolean;
    verifiedOnly?: boolean;
    platonicOnly?: boolean;
  }
): MatchResult[] => {
  // Filter out current user and already swiped users
  let candidates = allUsers.filter(u => 
    u.id !== currentUser.id && !swipedUserIds.has(u.id)
  );

  // Apply filters
  if (filters) {
    if (filters.ageRange) {
      candidates = candidates.filter(u => 
        u.age >= filters.ageRange!.min && u.age <= filters.ageRange!.max
      );
    }
    if (filters.languages && filters.languages.length > 0) {
      candidates = candidates.filter(u =>
        u.languages.some(l => filters.languages!.includes(l))
      );
    }
    if (filters.interests && filters.interests.length > 0) {
      candidates = candidates.filter(u =>
        u.interests.some(i => filters.interests!.includes(i))
      );
    }
    if (filters.hostingOnly) {
      candidates = candidates.filter(u => u.hostingEnabled);
    }
    if (filters.verifiedOnly) {
      candidates = candidates.filter(u => u.verificationStatus === 'verified');
    }
    if (filters.platonicOnly) {
      candidates = candidates.filter(u => u.romanticIntent === 'platonic-only');
    }
  }

  // Calculate scores and sort
  const results: MatchResult[] = candidates.map(user => ({
    user,
    score: calculateCompatibility(currentUser, user),
  }));

  results.sort((a, b) => b.score.compatibilityPercent - a.score.compatibilityPercent);

  return results;
};