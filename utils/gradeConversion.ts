export type GradeSystem = "french" | "yds" | "uiaa" | "british" | "v-scale";

// Grade conversion tables
const FRENCH_GRADES = [
  "3a", "3b", "3c", "4a", "4b", "4c", "5a", "5b", "5c",
  "6a", "6a+", "6b", "6b+", "6c", "6c+",
  "7a", "7a+", "7b", "7b+", "7c", "7c+",
  "8a", "8a+", "8b", "8b+", "8c", "8c+",
  "9a", "9a+", "9b", "9b+", "9c"
];

const YDS_GRADES = [
  "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a",
  "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c",
  "5.11d", "5.12a", "5.12b", "5.12c", "5.12d", "5.13a",
  "5.13b", "5.13c", "5.13d", "5.14a", "5.14b", "5.14c",
  "5.14d", "5.15a", "5.15b", "5.15c", "5.15d"
];

const UIAA_GRADES = [
  "III", "III+", "IV-", "IV", "IV+", "V-", "V", "V+", "VI-",
  "VI", "VI+", "VII-", "VII", "VII+", "VIII-",
  "VIII", "VIII+", "IX-", "IX", "IX+", "X-",
  "X", "X+", "XI-", "XI", "XI+", "XII-",
  "XII", "XII+", "XIII-", "XIII", "XIII+"
];

const BRITISH_GRADES = [
  "Mod", "Diff", "VDiff", "S", "HS", "VS", "HVS", "E1", "E2",
  "E3", "E4", "E5", "E6", "E7", "E8",
  "E9", "E10", "E11", "E12", "E13", "E14",
  "E15", "E16", "E17", "E18", "E19", "E20",
  "E21", "E22", "E23", "E24", "E25"
];

// Boulder grades (V-scale)
const BOULDER_GRADES = [
  "V0", "V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", 
  "V10", "V11", "V12", "V13", "V14", "V15", "V16", "V17"
];

export function convertGrade(grade: string, fromSystem: GradeSystem, toSystem: GradeSystem): string {
  if (fromSystem === toSystem) return grade;
  
  // Handle boulder grades (V-scale)
  if (BOULDER_GRADES.includes(grade)) {
    // If converting to V-scale, keep boulder grades
    if (toSystem === "v-scale") {
      return grade;
    }
    // If converting from V-scale to other systems, boulder grades stay as is
    // since they are used for bouldering problems in all systems
    return grade;
  }
  
  // If target system is V-scale but grade is not a boulder grade, return original
  if (toSystem === "v-scale") {
    return grade;
  }
  
  // If source system is V-scale but grade is not a boulder grade, return original
  if (fromSystem === "v-scale") {
    return grade;
  }
  
  let gradeIndex = -1;
  
  // Find the grade index in the source system
  switch (fromSystem) {
    case "french":
      gradeIndex = FRENCH_GRADES.indexOf(grade);
      break;
    case "yds":
      gradeIndex = YDS_GRADES.indexOf(grade);
      break;
    case "uiaa":
      gradeIndex = UIAA_GRADES.indexOf(grade);
      break;
    case "british":
      gradeIndex = BRITISH_GRADES.indexOf(grade);
      break;
  }
  
  if (gradeIndex === -1) return grade; // Grade not found, return original
  
  // Convert to target system
  switch (toSystem) {
    case "french":
      return FRENCH_GRADES[gradeIndex] || grade;
    case "yds":
      return YDS_GRADES[gradeIndex] || grade;
    case "uiaa":
      return UIAA_GRADES[gradeIndex] || grade;
    case "british":
      return BRITISH_GRADES[gradeIndex] || grade;
    default:
      return grade;
  }
}

export function getGradesForSystem(system: GradeSystem): string[] {
  switch (system) {
    case "french":
      return [...FRENCH_GRADES, ...BOULDER_GRADES];
    case "yds":
      return [...YDS_GRADES, ...BOULDER_GRADES];
    case "uiaa":
      return [...UIAA_GRADES, ...BOULDER_GRADES];
    case "british":
      return [...BRITISH_GRADES, ...BOULDER_GRADES];
    case "v-scale":
      return BOULDER_GRADES;
    default:
      return [...FRENCH_GRADES, ...BOULDER_GRADES];
  }
}

export function isValidGrade(grade: string, system: GradeSystem): boolean {
  const validGrades = getGradesForSystem(system);
  return validGrades.some(validGrade => validGrade.toLowerCase() === grade.toLowerCase());
}

export function getGradeSuggestionsForSystem(input: string, system: GradeSystem): string[] {
  const normalizedInput = input.trim().toLowerCase();
  if (!normalizedInput) return getGradesForSystem(system).slice(0, 10);
  
  return getGradesForSystem(system).filter(grade => 
    grade.toLowerCase().includes(normalizedInput)
  ).slice(0, 8);
}