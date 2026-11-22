export type SubjectId =
  | 'math'
  | 'arabic'
  | 'science'
  | 'tanchia'
  | 'french'
  | 'english'
  | 'arts_tech';

export type TermFilter = 'الكل' | 'الثلاثي الأول' | 'الثلاثي الثاني' | 'الثلاثي الثالث';

export type SubjectCategory = 'all' | 'scientific' | 'languages' | 'humanities';

export type UnitKind = 'lesson' | 'activity' | 'exam';

export type AppSection = 'home' | 'lessons' | 'activities' | 'exams' | 'rewards';

export type ExerciseType =
  | 'choice'
  | 'input'
  | 'fill_blank'
  | 'order'
  | 'match'
  | 'classify'
  | 'boolean';

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface ClassifyItem {
  id: string;
  label: string;
  bucketIndex: 0 | 1;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  lang?: 'ar' | 'fr' | 'en';
  prompt: string;
  subPrompt?: string;
  hint: string;
  explanation: string;
  points: number;
  options?: string[];
  correctIndex?: number;
  correctBoolean?: boolean;
  correctAnswers?: string[];
  inputPlaceholder?: string;
  quickKeys?: string[];
  sentenceBefore?: string;
  sentenceAfter?: string;
  wordBank?: string[];
  correctOrder?: string[];
  pairs?: MatchPair[];
  buckets?: [string, string];
  classifyItems?: ClassifyItem[];
}

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  kind: UnitKind;
  unitNumber: number;
  title: string;
  term: Exclude<TermFilter, 'الكل'>;
  durationMinutes: number;
  summaryTitle: string;
  summaryPoints: string[];
  exercises: Exercise[];
}

export interface Subject {
  id: SubjectId;
  title: string;
  subtitle: string;
  category: Exclude<SubjectCategory, 'all'>;
  accentHex: string;
  softBgHex: string;
  borderHex: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  criteriaText: string;
  colorHex: string;
  bgHex: string;
  emblemType: 'butterfly' | 'compass' | 'quill' | 'atom' | 'carthage' | 'polyglot' | 'crown' | 'palette';
}

export interface LessonResult {
  lessonId: string;
  subjectId: SubjectId;
  kind: UnitKind;
  bestScore: number;
  totalQuestions: number;
  starsEarned: number;
  completedAt: string;
}

export interface StudentProgress {
  studentName: string;
  avatarId: 'cyrine';
  totalStars: number;
  streakDays: number;
  completedLessons: Record<string, LessonResult>;
  unlockedBadgeIds: string[];
  dailyChallengeDone: boolean;
}
