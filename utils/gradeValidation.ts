import { getGradesForSystem, isValidGrade, getGradeSuggestionsForSystem, type GradeSystem } from "@/utils/gradeConversion";

// Legacy functions for backward compatibility - now use French as default
export function isValidFrenchGrade(grade: string): boolean {
  return isValidGrade(grade, "french");
}

export function formatGrade(grade: string): string {
  const normalizedGrade = grade.trim();
  if (isValidGrade(normalizedGrade, "french")) {
    return normalizedGrade;
  }
  return grade;
}

export function getGradeSuggestions(input: string): string[] {
  return getGradeSuggestionsForSystem(input, "french");
}

// New functions that work with any grade system
export function isValidGradeForSystem(grade: string, system: GradeSystem): boolean {
  return isValidGrade(grade, system);
}

export function formatGradeForSystem(grade: string, system: GradeSystem): string {
  const normalizedGrade = grade.trim();
  if (isValidGrade(normalizedGrade, system)) {
    return normalizedGrade;
  }
  return grade;
}

export function getGradeSuggestionsForGradeSystem(input: string, system: GradeSystem): string[] {
  return getGradeSuggestionsForSystem(input, system);
}

export function getAllGradesForSystem(system: GradeSystem): string[] {
  return getGradesForSystem(system);
}