import { Badge, StudentProgress } from '../types/education';

export interface RankTier {
  id: string;
  title: string;
  minStars: number;
  nextStars: number | null;
  encouragement: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    id: 'butterfly',
    title: 'الفراشة',
    minStars: 0,
    nextStars: 100,
    encouragement: 'بداية مشرقة يا فراشة! كل تمرين تحلّينه يرفعكِ نحو نجمة سريّنة.',
  },
  {
    id: 'star',
    title: 'نجمة سريّنة',
    minStars: 100,
    nextStars: 250,
    encouragement: 'أداء رائع! أنتِ تتقدّمين بثبات في جميع المواد.',
  },
  {
    id: 'princess',
    title: 'أميرة المعرفة',
    minStars: 250,
    nextStars: 500,
    encouragement: 'تألّق لافت! معرفتكِ تتوسّع في العلوم واللغات والحساب.',
  },
  {
    id: 'carthage',
    title: 'عبقريّة قرطاج',
    minStars: 500,
    nextStars: null,
    encouragement: 'مرتبة الشرف العليا! أنتِ قدوة لتلميذات السنة الخامسة ابتدائي.',
  },
];

export const BADGES: Badge[] = [
  {
    id: 'first_butterfly',
    title: 'وسام الفراشة المتألّقة',
    description: 'أتممتِ أول درس بنجاح وبدأتِ رحلة الإبداع في سريّنة.',
    criteriaText: 'إتمام أول درس بنجاح',
    colorHex: '#EC4899',
    bgHex: '#FDF2F8',
    emblemType: 'butterfly',
  },
  {
    id: 'math_genius',
    title: 'وسام أميرة الحساب',
    description: 'تألّقتِ في حلّ مسائل الرياضيات والكسور والهندسة.',
    criteriaText: 'إتمام درسين في الرياضيات',
    colorHex: '#9333EA',
    bgHex: '#FAF5FF',
    emblemType: 'compass',
  },
  {
    id: 'arabic_quill',
    title: 'وسام أميرة الكلمات',
    description: 'أبدعتِ في اللغة العربية والنواسخ والإملاء الجميل.',
    criteriaText: 'إتمام درسين في اللغة العربية',
    colorHex: '#E11D48',
    bgHex: '#FFF1F2',
    emblemType: 'quill',
  },
  {
    id: 'science_explorer',
    title: 'وسام عالمة المستقبل',
    description: 'اكتشفتِ أسرار الإيقاظ العلمي والطاقة والكهرباء بذكاء.',
    criteriaText: 'إتمام درسين في الإيقاظ العلمي',
    colorHex: '#10B981',
    bgHex: '#ECFDF5',
    emblemType: 'atom',
  },
  {
    id: 'carthage_ambassador',
    title: 'وسام زهرة قرطاج',
    description: 'تميّزتِ في دروس التنشئة ومعالم تونس الخضراء.',
    criteriaText: 'إتمام درسين في التنشئة',
    colorHex: '#F59E0B',
    bgHex: '#FFFBEB',
    emblemType: 'carthage',
  },
  {
    id: 'polyglot_star',
    title: 'وسام فراشة اللغات',
    description: 'حلّقتِ بين العربية والفرنسية والإنقليزية برشاقة.',
    criteriaText: 'إتمام درس فرنسي ودرس إنقليزي',
    colorHex: '#0EA5E9',
    bgHex: '#F0F9FF',
    emblemType: 'polyglot',
  },
  {
    id: 'creative_artist',
    title: 'وسام الفنانة الحالمة',
    description: 'أبهرتِ الجميع بذوقكِ في التربية التكنولوجية والفنّية.',
    criteriaText: 'إتمام درس في التربية التكنولوجية والفنّية',
    colorHex: '#F97316',
    bgHex: '#FFF7ED',
    emblemType: 'palette',
  },
  {
    id: 'golden_crown',
    title: 'تاج التميّز الملكي',
    description: 'حقّقتِ علامة كاملة في 3 وحدات وجمعتِ 200 نجمة.',
    criteriaText: '200 نجمة + 3 وحدات بعلامة كاملة',
    colorHex: '#D97706',
    bgHex: '#FEF3C7',
    emblemType: 'crown',
  },
];

export function getCurrentRank(stars: number): RankTier {
  let current = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (stars >= tier.minStars) {
      current = tier;
    }
  }
  return current;
}

export function evaluateUnlockedBadges(progress: StudentProgress): string[] {
  const results = Object.values(progress.completedLessons);
  const completedCountBySubject = (subjectId: string) =>
    results.filter((r) => r.subjectId === subjectId).length;

  const perfectCount = results.filter((r) => r.bestScore === r.totalQuestions).length;
  const migratedIds = progress.unlockedBadgeIds.map((id) =>
    id === 'first_jasmine' ? 'first_butterfly' : id
  );
  const unlocked = new Set<string>(migratedIds);

  if (results.length >= 1) unlocked.add('first_butterfly');
  if (completedCountBySubject('math') >= 2) unlocked.add('math_genius');
  if (completedCountBySubject('arabic') >= 2) unlocked.add('arabic_quill');
  if (completedCountBySubject('science') >= 2) unlocked.add('science_explorer');
  if (completedCountBySubject('tanchia') >= 2) unlocked.add('carthage_ambassador');
  if (completedCountBySubject('french') >= 1 && completedCountBySubject('english') >= 1) {
    unlocked.add('polyglot_star');
  }
  if (completedCountBySubject('arts_tech') >= 1) unlocked.add('creative_artist');
  if (progress.totalStars >= 200 && perfectCount >= 3) unlocked.add('golden_crown');

  return Array.from(unlocked);
}
