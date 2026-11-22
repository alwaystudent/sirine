import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  BookOpenCheck,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileDown,
  FlaskConical,
  Globe2,
  HardDrive,
  Home,
  Languages,
  Landmark,
  Menu,
  Palette,
  Sparkles,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ConceptLab } from './components/ConceptLab';
import { DailyStudyPlanner } from './components/DailyStudyPlanner';
import { ExercisePlayer } from './components/ExercisePlayer';
import { FrameBlossom } from './components/FrameBlossom';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { RewardsAlbum } from './components/RewardsAlbum';
import { RoseEmblem } from './components/RoseEmblem';
import { SafeImage } from './components/SafeImage';
import { Sidebar } from './components/Sidebar';
import { SubjectBrowser, TERM_FILTERS } from './components/SubjectBrowser';
import { SubjectDropdown } from './components/SubjectDropdown';
import { CURRICULUM_STATS, SUBJECTS } from './data/curriculum';
import { BADGES, evaluateUnlockedBadges, getCurrentRank } from './data/rewards';
import {
  AppSection,
  Lesson,
  StudentProgress,
  Subject,
  SubjectId,
  TermFilter,
} from './types/education';
import {
  cacheBrowsedUnit,
  downloadCompletedSubjectsForOffline,
  downloadSubjectForOffline,
  exportSubjectOfflinePack,
  loadOfflineVaultState,
  OfflineVaultState,
} from './utils/offlineStorage';

const STORAGE_KEY = 'srayna_tunisian_5th_progress_v2';

const DEFAULT_PROGRESS: StudentProgress = {
  studentName: 'سيرين',
  avatarId: 'cyrine',
  totalStars: 30,
  streakDays: 1,
  completedLessons: {},
  unlockedBadgeIds: [],
  dailyChallengeDone: false,
};

function loadProgress(): StudentProgress {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem('srayna_tunisian_5th_progress_v1');
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const migratedName =
      !parsed.studentName || parsed.studentName === 'سلمى'
        ? 'سيرين'
        : parsed.studentName;
    const migratedBadges = (parsed.unlockedBadgeIds ?? []).map((id) =>
      id === 'first_jasmine' ? 'first_butterfly' : id
    );
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      studentName: migratedName,
      avatarId: 'cyrine',
      completedLessons: parsed.completedLessons ?? {},
      unlockedBadgeIds: migratedBadges,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function getSubjectIcon(id: SubjectId) {
  switch (id) {
    case 'math':
      return Calculator;
    case 'arabic':
      return BookOpen;
    case 'science':
      return FlaskConical;
    case 'tanchia':
      return Landmark;
    case 'french':
      return Languages;
    case 'english':
      return Globe2;
    case 'arts_tech':
      return Palette;
  }
}

const SECTION_TITLES: Record<AppSection, string> = {
  home: 'الرئيسية',
  lessons: 'الدروس الرسميّة',
  activities: 'الأنشطة والمختبر التفاعلي',
  exams: 'الامتحانات والاختبارات',
  rewards: 'ألبوم الأوسمة والتقدّم',
};

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(loadProgress);
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [selectedTerm, setSelectedTerm] = useState<TermFilter>('الثلاثي الأول');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<{
    subject: Subject;
    lesson: Lesson;
  } | null>(null);
  const [newBadgeNotice, setNewBadgeNotice] = useState<string | null>(null);
  const [offlineVault, setOfflineVault] = useState<OfflineVaultState>(loadOfflineVaultState);
  const [offlineFeedback, setOfflineFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [progress]);

  // Auto-cache any subject with completed units on mount (zero duplicate network hits)
  useEffect(() => {
    void downloadCompletedSubjectsForOffline(
      SUBJECTS,
      progress.completedLessons,
      loadOfflineVaultState()
    ).then(({ state }) => {
      setOfflineVault(state);
    });
  }, []);

  const completedUnitsCount = Object.keys(progress.completedLessons).length;
  const currentRank = getCurrentRank(progress.totalStars);

  // Pick next uncompleted unit matching the currently selected Term
  const nextRecommended = useMemo(() => {
    const termPool = SUBJECTS.flatMap((subj) =>
      subj.lessons
        .filter((l) => selectedTerm === 'الكل' || l.term === selectedTerm)
        .map((lesson) => ({ subject: subj, lesson }))
    );

    const uncompleted = termPool.find(
      (item) => !progress.completedLessons[item.lesson.id]
    );
    if (uncompleted) return uncompleted;
    if (termPool.length > 0) return termPool[0];
    return { subject: SUBJECTS[0], lesson: SUBJECTS[0].lessons[0] };
  }, [progress.completedLessons, selectedTerm]);

  const handleSelectSection = (section: AppSection, subjectId: SubjectId | null = null) => {
    setActiveSession(null);
    setActiveSection(section);
    setSelectedSubjectId(subjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    handleSelectSection('home', null);
  };

  const handleStartNextChallenge = () => {
    void handleStartLesson(nextRecommended.subject, nextRecommended.lesson);
  };

  const handleStartLesson = (subject: Subject, lesson: Lesson) => {
    setActiveSession({ subject, lesson });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Automatically save browsed lesson/activity/exam offline so revisiting uses 0 internet data
    void cacheBrowsedUnit(lesson, offlineVault).then((next) => {
      setOfflineVault(next);
    });
  };

  const handleDownloadSubject = async (subject: Subject) => {
    const next = await downloadSubjectForOffline(subject, offlineVault);
    setOfflineVault(next);
    setOfflineFeedback(`تم حفظ مادة «${subject.title}» بالكامل للتصفّح دون إنترنت.`);
  };

  const handleDownloadUnit = async (unit: Lesson) => {
    const next = await cacheBrowsedUnit(unit, offlineVault);
    setOfflineVault(next);
    setOfflineFeedback(`تم حفظ «${unit.title}» للتصفّح دون استهلاك رصيد النت.`);
  };

  const handleDownloadAllCompleted = async () => {
    const { state, syncedCount } = await downloadCompletedSubjectsForOffline(
      SUBJECTS,
      progress.completedLessons,
      offlineVault
    );
    setOfflineVault(state);
    if (syncedCount > 0) {
      setOfflineFeedback(
        `تم حفظ ${syncedCount} مادة منجزة وما تمّ تصفّحه للتشغيل دون إنترنت.`
      );
    } else {
      setOfflineFeedback('تم تأمين الدروس والملفات التي تصفّحتها للعمل دون إنترنت.');
    }
  };

  const handleExportSubjectPack = (subject: Subject) => {
    exportSubjectOfflinePack(subject, progress.completedLessons);
    setOfflineFeedback(`تم تنزيل ملخّص مادة «${subject.title}» كملف مستقل للدراسة دون نت.`);
  };

  const handleCompleteLesson = (
    score: number,
    totalQuestions: number,
    starsEarned: number
  ) => {
    if (!activeSession) return;
    const { subject, lesson } = activeSession;

    // Automatically save completed subject & unit offline so it never uses internet again
    void downloadSubjectForOffline(subject, offlineVault).then((next) => {
      setOfflineVault(next);
    });

    setProgress((prev) => {
      const existing = prev.completedLessons[lesson.id];
      const bestScore = existing ? Math.max(existing.bestScore, score) : score;
      const updated: StudentProgress = {
        ...prev,
        totalStars: prev.totalStars + starsEarned,
        completedLessons: {
          ...prev.completedLessons,
          [lesson.id]: {
            lessonId: lesson.id,
            subjectId: subject.id,
            kind: lesson.kind,
            bestScore,
            totalQuestions,
            starsEarned: (existing?.starsEarned ?? 0) + starsEarned,
            completedAt: new Date().toISOString(),
          },
        },
      };

      const nextUnlocked = evaluateUnlockedBadges(updated);
      const newlyEarned = nextUnlocked.filter(
        (id) => !prev.unlockedBadgeIds.includes(id)
      );
      if (newlyEarned.length > 0) {
        const badgeObj = BADGES.find((b) => b.id === newlyEarned[0]);
        if (badgeObj) {
          setNewBadgeNotice(badgeObj.title);
        }
      }

      return {
        ...updated,
        unlockedBadgeIds: nextUnlocked,
      };
    });
  };

  const handleUpdateProfile = (name: string) => {
    setProgress((prev) => ({
      ...prev,
      studentName: name,
      avatarId: 'cyrine',
    }));
  };

  return (
    <div className="min-h-screen flex srayna-canvas-bg text-[#2D1B2E] relative">
      {/* Subtle Decorative Backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <svg className="absolute top-24 left-8 w-36 h-36 text-[#D97706] opacity-[0.045]" viewBox="0 0 120 120" fill="currentColor">
          <path d="M60 10 L68 44 L102 52 L68 60 L60 94 L52 60 L18 52 L52 44 Z" />
        </svg>
        <svg className="absolute bottom-16 right-80 w-44 h-44 text-[#94A3B8] opacity-[0.05]" viewBox="0 0 120 120" fill="currentColor">
          <circle cx="60" cy="30" r="18" />
          <circle cx="90" cy="60" r="18" />
          <circle cx="60" cy="90" r="18" />
          <circle cx="30" cy="60" r="18" />
        </svg>
      </div>

      {/* Responsive Right-Hand RTL Sidebar */}
      <div className="relative z-20 shrink-0">
        <Sidebar
          activeSection={activeSection}
          selectedSubjectId={selectedSubjectId}
          progress={progress}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onSelectSection={handleSelectSection}
        />
      </div>

      {/* Main Content Workspace */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        <OfflineIndicator />

        {/* Clean Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FDFDFB]/88 backdrop-blur-md border-b border-[#EFECE4]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#F2D7E5] text-sm font-bold text-[#2D1B2E] hover:bg-[#FDF2F8] cursor-pointer shrink-0"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-4 h-4 text-[#DB2777]" />
                <span>القائمة</span>
              </button>

              {activeSection !== 'home' && !activeSession && (
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#F2D7E5] text-sm font-bold text-[#DB2777] hover:bg-[#FDF2F8] cursor-pointer shrink-0"
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية</span>
                </button>
              )}

              <div className="text-base sm:text-lg font-extrabold text-[#2D1B2E] truncate">
                {activeSession
                  ? `${activeSession.subject.title} · ${activeSession.lesson.title}`
                  : SECTION_TITLES[activeSection]}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden md:inline-block text-sm font-bold text-[#432F46] whitespace-nowrap">
                {selectedTerm === 'الكل' ? 'كل الثلاثيات' : selectedTerm}
              </span>
              <PWAInstallButton variant="header" />
              <button
                type="button"
                onClick={handleStartNextChallenge}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#DB2777] text-white text-sm font-extrabold hover:bg-[#BE185D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RoseEmblem variant="light" size={20} />
                <span>ابدئي التحدي</span>
              </button>
            </div>
          </div>
        </header>

        {/* Newly Unlocked Badge Toast */}
        {newBadgeNotice && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-l from-[#FDF2F8] to-[#F5F3FF] border border-[#FBCFE8] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5 text-base font-extrabold text-[#9D174D]">
                <Award className="w-5 h-5 text-[#DB2777] shrink-0" />
                <span>
                  مبارك يا {progress.studentName}! فتحتِ وساماً جديداً: {newBadgeNotice}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNewBadgeNotice(null)}
                className="text-sm sm:text-base font-extrabold text-[#DB2777] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}

        {/* Offline Save Notification Banner */}
        {offlineFeedback && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 w-full">
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#065F46]">
                <HardDrive className="w-5 h-5 text-[#059669] shrink-0" />
                <span>{offlineFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setOfflineFeedback(null)}
                className="text-sm font-extrabold text-[#059669] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeSession ? (
            <ExercisePlayer
              subject={activeSession.subject}
              lesson={activeSession.lesson}
              onExit={() => setActiveSession(null)}
              onGoHome={handleGoHome}
              onCompleteLesson={handleCompleteLesson}
            />
          ) : activeSection === 'home' ? (
            <div className="space-y-8">
              {/* Hero Section */}
              <div
                style={
                  {
                    '--frame-surface':
                      'linear-gradient(to bottom left, rgba(255, 255, 255, 0.97), rgba(255, 249, 252, 0.96), rgba(252, 231, 243, 0.92))',
                    '--rim-from': '#EAA8C5',
                    '--rim-mid': '#D4BFF2',
                    '--rim-to': '#F3D79B',
                  } as React.CSSProperties
                }
                className="relative srayna-top-frame backdrop-blur-xs rounded-3xl p-6 sm:p-8 flex flex-col justify-center shadow-sm shadow-[#DB2777]/5"
              >
                <FrameBlossom size="lg" />
                <div className="mb-2.5">
                  <p className="text-base sm:text-lg font-extrabold text-[#DB2777] leading-snug">
                    أهلاً بكِ يا {progress.studentName}
                  </p>
                  <p className="text-sm font-bold text-[#432F46] mt-0.5 leading-snug">
                    السنة الخامسة ابتدائي · تونس 2026
                  </p>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#2D1B2E] leading-snug mb-2.5">
                  رحلتكِ المبهجة نحو التفوّق
                </h1>
                <p className="text-base font-semibold text-[#432F46] leading-relaxed mb-5">
                  تضمّ منصّتكِ {CURRICULUM_STATS.lessonsCount} درساً،{' '}
                  {CURRICULUM_STATS.activitiesCount} نشاطاً تفاعلياً، و
                  {CURRICULUM_STATS.examsCount} اختباراً وامتحاناً موافقة للبرنامج التونسي
                  الرسمي لعام 2026.
                </p>

                {/* Hero Illustration Placed Above Term Selector */}
                <div className="mb-6 bg-[#FDF2F8] border border-[#F2D7E5] rounded-2xl overflow-hidden h-56 sm:h-72 lg:h-80">
                  <SafeImage
                    src="/src/assets/images/srayna_hero_study_1795361307506.jpg"
                    alt="التلميذة سيرين تدرس بحماس في منصة سريّنة"
                    fallbackLabel="منصة سريّنة التعليمية"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Upfront Term Selector */}
                <div className="mb-6">
                  <div className="text-sm sm:text-base font-extrabold text-[#432F46] mb-2">
                    اختاري الثلاثي الدراسي أولاً:
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FBF2F6] border border-[#F2D7E5] rounded-xl">
                    {TERM_FILTERS.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setSelectedTerm(term)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selectedTerm === term
                            ? 'bg-[#DB2777] text-white shadow-xs'
                            : 'text-[#432F46] hover:text-[#2D1B2E]'
                        }`}
                      >
                        <RoseEmblem
                          variant={selectedTerm === term ? 'light' : 'pink'}
                          size={19}
                        />
                        <span>{term === 'الكل' ? 'كل الثلاثيات' : term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <SubjectDropdown
                    progress={progress}
                    onSelectSubject={(subjId) => handleSelectSection('lessons', subjId)}
                  />
                  <button
                    type="button"
                    onClick={() => handleSelectSection('exams', null)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#F2D7E5] text-[#2D1B2E] text-base font-bold hover:bg-[#FDF2F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RoseEmblem variant="pink" size={22} />
                    <span>تصفّحي الامتحانات ({CURRICULUM_STATS.examsCount})</span>
                  </button>
                  <PWAInstallButton variant="hero" />
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  style={
                    {
                      '--rim-from': '#EAA8C5',
                      '--rim-mid': '#F1BAD3',
                      '--rim-to': '#F4D9A0',
                    } as React.CSSProperties
                  }
                  className="relative srayna-top-frame rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
                >
                  <FrameBlossom size="sm" accentHex="#DB2777" />
                  <div>
                    <div className="text-sm sm:text-base font-bold text-[#432F46] mb-0.5">
                      رصيد النجوم
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#DB2777] tabular-nums">
                      {progress.totalStars} نجمة
                    </div>
                  </div>
                  <Star className="w-6 h-6 text-[#DB2777] fill-current shrink-0" />
                </div>

                <div
                  style={
                    {
                      '--rim-from': '#CBB5F0',
                      '--rim-mid': '#EDB4CD',
                      '--rim-to': '#B4DFF5',
                    } as React.CSSProperties
                  }
                  className="relative srayna-top-frame rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
                >
                  <FrameBlossom size="sm" accentHex="#7C3AED" />
                  <div>
                    <div className="text-sm sm:text-base font-bold text-[#432F46] mb-0.5">
                      الوحدات المنجزة
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#2D1B2E] tabular-nums">
                      {completedUnitsCount} / {CURRICULUM_STATS.totalUnits}
                    </div>
                  </div>
                  <BookOpenCheck className="w-6 h-6 text-[#7C3AED] shrink-0" />
                </div>

                <div
                  style={
                    {
                      '--rim-from': '#9ADBC2',
                      '--rim-mid': '#A8E2D8',
                      '--rim-to': '#F3D79B',
                    } as React.CSSProperties
                  }
                  className="relative srayna-top-frame rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
                >
                  <FrameBlossom size="sm" accentHex="#059669" />
                  <div>
                    <div className="text-sm sm:text-base font-bold text-[#432F46] mb-0.5">
                      أوسمة التميّز
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#059669] tabular-nums">
                      {progress.unlockedBadgeIds.length} / {BADGES.length}
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-[#059669] shrink-0" />
                </div>

                <div
                  style={
                    {
                      '--rim-from': '#EED091',
                      '--rim-mid': '#F5DFAD',
                      '--rim-to': '#EAA8C5',
                    } as React.CSSProperties
                  }
                  className="relative srayna-top-frame rounded-2xl px-5 py-4 flex items-center justify-between gap-3"
                >
                  <FrameBlossom size="sm" accentHex="#D97706" />
                  <div>
                    <div className="text-sm sm:text-base font-bold text-[#432F46] mb-0.5">
                      اللقب الحالي
                    </div>
                    <div className="text-xl sm:text-2xl font-extrabold text-[#B45309] truncate max-w-[160px]">
                      {currentRank.title}
                    </div>
                  </div>
                  <Award className="w-6 h-6 text-[#D97706] shrink-0" />
                </div>
              </div>

              {/* Student-Controlled Daily Revision & Upcoming Exams Planner */}
              <DailyStudyPlanner
                selectedTerm={selectedTerm}
                onOpenSubjectTrack={(subjectId, track) =>
                  handleSelectSection(track, subjectId)
                }
              />

              {/* 3 Main Tracks Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectSection('lessons', null)}
                  style={
                    {
                      '--rim-from': '#EAA8C5',
                      '--rim-mid': '#F4C1D9',
                      '--rim-to': '#F4D9A0',
                    } as React.CSSProperties
                  }
                  className="relative text-right srayna-top-frame rounded-2xl p-6 hover:brightness-[0.99] transition-all cursor-pointer flex flex-col justify-between gap-4"
                >
                  <FrameBlossom size="md" accentHex="#DB2777" />
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-[#FDF2F8] text-[#DB2777] flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <span className="text-base font-extrabold text-[#DB2777] tabular-nums">
                      {CURRICULUM_STATS.lessonsCount} درساً
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#2D1B2E] mb-1.5">
                      الدروس الرسميّة
                    </h2>
                    <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                      شرح مبسّط لكل القواعد والمفاهيم في 7 مواد مع تمارين تطبيقية فورية.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSection('activities', null)}
                  style={
                    {
                      '--rim-from': '#CBB5F0',
                      '--rim-mid': '#EDB4CD',
                      '--rim-to': '#F3D79B',
                    } as React.CSSProperties
                  }
                  className="relative text-right srayna-top-frame rounded-2xl p-6 hover:brightness-[0.99] transition-all cursor-pointer flex flex-col justify-between gap-4"
                >
                  <FrameBlossom size="md" accentHex="#7C3AED" />
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <span className="text-base font-extrabold text-[#7C3AED] tabular-nums">
                      {CURRICULUM_STATS.activitiesCount} نشاطاً
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#2D1B2E] mb-1.5">
                      الأنشطة التفاعلية والمختبر
                    </h2>
                    <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                      ألعاب السحب والإفلات والمطابقة، بالإضافة إلى مختبر الكسور والكهرباء وخريطة تونس.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectSection('exams', null)}
                  style={
                    {
                      '--rim-from': '#9ADBC2',
                      '--rim-mid': '#A8D8F0',
                      '--rim-to': '#F3D79B',
                    } as React.CSSProperties
                  }
                  className="relative text-right srayna-top-frame rounded-2xl p-6 hover:brightness-[0.99] transition-all cursor-pointer flex flex-col justify-between gap-4"
                >
                  <FrameBlossom size="md" accentHex="#059669" />
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5" />
                    </span>
                    <span className="text-base font-extrabold text-[#059669] tabular-nums">
                      {CURRICULUM_STATS.examsCount} اختباراً
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#2D1B2E] mb-1.5">
                      الامتحانات والاختبارات
                    </h2>
                    <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                      فروض مراقبة وتأليفية بمؤقت ذكي للثلاثيات الثلاث تحضّركِ للنجاح بأعلى المعدلات.
                    </p>
                  </div>
                </button>
              </div>

              {/* 7 Subjects Quick Entrance Grid */}
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                  <div>
                    <p className="text-base font-bold text-[#DB2777] mb-1">
                      {selectedTerm === 'الكل' ? 'كامل السنة الدراسية' : selectedTerm}
                    </p>
                    <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#2D1B2E] leading-snug">
                      المواد الدراسيّة السبع
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#432F46] bg-white/90 border border-[#F2D7E5] rounded-xl px-3.5 py-2 tabular-nums">
                      <HardDrive className="w-4 h-4 text-[#059669]" />
                      <span>
                        محفوظ دون نت: {offlineVault.downloadedSubjectIds.length}/7 مواد ·{' '}
                        {offlineVault.browsedUnitIds.length} وحدة
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleDownloadAllCompleted()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#059669] text-white text-sm sm:text-base font-bold hover:bg-[#047857] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RoseEmblem variant="light" size={20} />
                      <Download className="w-4 h-4" />
                      <span>حفظ المنجز والمتصفّح دون نت</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {SUBJECTS.map((subj) => {
                    const Icon = getSubjectIcon(subj.id);
                    const totalEx = subj.lessons.reduce(
                      (s, l) => s + l.exercises.length,
                      0
                    );
                    const doneUnits = subj.lessons.filter((l) =>
                      Boolean(progress.completedLessons[l.id])
                    ).length;
                    const isSavedOffline = offlineVault.downloadedSubjectIds.includes(subj.id);

                    return (
                      <div
                        key={subj.id}
                        className="relative bg-white/95 border border-[#EDE0E6] rounded-2xl flex flex-col justify-between hover:border-[#E6B8CD] transition-colors"
                      >
                        <FrameBlossom size="sm" accentHex={subj.accentHex} />
                        <div className="rounded-[15px] overflow-hidden flex-1 flex flex-col justify-between">
                          <div
                            className="h-1.5 w-full shrink-0"
                            style={{
                              background: `linear-gradient(to left, ${subj.accentHex}66, #F1B3CD, #F4D89E)`,
                            }}
                          />
                          <div
                            className="p-5 border-b"
                            style={{
                              backgroundColor: subj.softBgHex,
                              borderColor: subj.borderHex,
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div
                                className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0"
                                style={{
                                  color: subj.accentHex,
                                  border: `1px solid ${subj.borderHex}`,
                                }}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <span className="text-sm font-bold text-[#432F46] tabular-nums">
                                45 وحدة · {totalEx} تمريناً
                              </span>
                            </div>
                            <h3 className="text-xl font-extrabold text-[#2D1B2E] mt-4 mb-1">
                              {subj.title}
                            </h3>
                            <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                              {subj.subtitle}
                            </p>
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between text-sm font-bold text-[#432F46] tabular-nums">
                              <span>15 درساً · 15 نشاطاً · 15 اختباراً</span>
                              <span style={{ color: subj.accentHex }}>
                                {doneUnits}/{subj.lessons.length}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleSelectSection('lessons', subj.id)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-base font-bold text-white cursor-pointer whitespace-nowrap"
                                style={{ backgroundColor: subj.accentHex }}
                              >
                                <RoseEmblem variant="light" size={21} />
                                <span>الدروس</span>
                                <ArrowLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelectSection('exams', subj.id)}
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FFF8FB] border border-[#F2D7E5] text-base font-bold text-[#2D1B2E] hover:bg-[#FDF2F8] cursor-pointer whitespace-nowrap"
                              >
                                <RoseEmblem variant="pink" size={21} />
                                <span>الاختبارات</span>
                              </button>
                            </div>

                            <div className="pt-2 border-t border-[#F7E8F0] flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => void handleDownloadSubject(subj)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                                  isSavedOffline
                                    ? 'bg-[#ECFDF5] text-[#059669]'
                                    : 'bg-[#F5F3FF] text-[#6D28D9] hover:bg-[#EDE9FE]'
                                }`}
                              >
                                {isSavedOffline ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span>محفوظة دون نت</span>
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 shrink-0" />
                                    <span>تحميل دون نت</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleExportSubjectPack(subj)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-bold text-[#432F46] hover:bg-[#FDF2F8] hover:text-[#DB2777] transition-colors cursor-pointer whitespace-nowrap"
                                title="تنزيل ملخّص المادة كملف للقراءة دون إنترنت"
                              >
                                <FileDown className="w-4 h-4 shrink-0" />
                                <span>ملخّص</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeSection === 'lessons' ? (
            <SubjectBrowser
              mode="lesson"
              progress={progress}
              offlineVault={offlineVault}
              selectedTerm={selectedTerm}
              onSelectTerm={setSelectedTerm}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              onStartLesson={handleStartLesson}
              onDownloadSubject={handleDownloadSubject}
              onDownloadUnit={handleDownloadUnit}
              onExportSubjectPack={handleExportSubjectPack}
              onGoHome={handleGoHome}
            />
          ) : activeSection === 'activities' ? (
            <div className="space-y-10">
              <ConceptLab />
              <SubjectBrowser
                mode="activity"
                progress={progress}
                offlineVault={offlineVault}
                selectedTerm={selectedTerm}
                onSelectTerm={setSelectedTerm}
                selectedSubjectId={selectedSubjectId}
                onSelectSubject={setSelectedSubjectId}
                onStartLesson={handleStartLesson}
                onDownloadSubject={handleDownloadSubject}
                onDownloadUnit={handleDownloadUnit}
                onExportSubjectPack={handleExportSubjectPack}
                onGoHome={handleGoHome}
              />
            </div>
          ) : activeSection === 'exams' ? (
            <SubjectBrowser
              mode="exam"
              progress={progress}
              offlineVault={offlineVault}
              selectedTerm={selectedTerm}
              onSelectTerm={setSelectedTerm}
              selectedSubjectId={selectedSubjectId}
              onSelectSubject={setSelectedSubjectId}
              onStartLesson={handleStartLesson}
              onDownloadSubject={handleDownloadSubject}
              onDownloadUnit={handleDownloadUnit}
              onExportSubjectPack={handleExportSubjectPack}
              onGoHome={handleGoHome}
            />
          ) : (
            <RewardsAlbum progress={progress} onUpdateProfile={handleUpdateProfile} />
          )}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-[#F2D7E5] bg-white py-5 mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-base font-semibold text-[#432F46]">
            <span>
              سريّنة Srayna · منصة تعليمية للسنة الخامسة ابتدائي وفق المنهج الرسمي التونسي 2026
            </span>
            <div className="flex items-center gap-5 font-bold">
              <button
                type="button"
                onClick={handleGoHome}
                className="hover:text-[#DB2777] cursor-pointer"
              >
                الرئيسية
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('lessons', null)}
                className="hover:text-[#DB2777] cursor-pointer"
              >
                الدروس
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('activities', null)}
                className="hover:text-[#DB2777] cursor-pointer"
              >
                الأنشطة
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('exams', null)}
                className="hover:text-[#DB2777] cursor-pointer"
              >
                الامتحانات
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
