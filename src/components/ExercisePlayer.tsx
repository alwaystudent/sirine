import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GripVertical,
  HelpCircle,
  Home,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Exercise, ExerciseType, Lesson, Subject } from '../types/education';
import { FrameBlossom } from './FrameBlossom';
import { RoseEmblem } from './RoseEmblem';

interface ExercisePlayerProps {
  subject: Subject;
  lesson: Lesson;
  onExit: () => void;
  onGoHome: () => void;
  onCompleteLesson: (score: number, totalQuestions: number, starsEarned: number) => void;
}

function deterministicShuffle<T>(items: T[], seedKey: string): T[] {
  const arr = [...items];
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash * 31 + seedKey.charCodeAt(i)) % 1000;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (hash + i * 7) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr.length > 1 && arr.every((v, idx) => v === items[idx])) {
    [arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]];
  }
  return arr;
}

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getExerciseTypeLabel(type: ExerciseType, isLtr: boolean): string {
  if (isLtr) {
    switch (type) {
      case 'choice':
        return 'Multiple Choice';
      case 'fill_blank':
        return 'Fill in the Blank';
      case 'order':
        return 'Drag & Drop Order';
      case 'classify':
        return 'Drag & Drop Classify';
      case 'match':
        return 'Match Pairs';
      case 'input':
        return 'Type Your Answer';
      case 'boolean':
        return 'True or False';
    }
  }
  switch (type) {
    case 'choice':
      return 'اختيار من متعدّد';
    case 'fill_blank':
      return 'املئي الفراغ';
    case 'order':
      return 'رتّبي بالسحب والإفلات';
    case 'classify':
      return 'صنّفي بالسحب والإفلات';
    case 'match':
      return 'طابقي الأزواج';
    case 'input':
      return 'اكتبي الإجابة';
    case 'boolean':
      return 'صحيح أم خطأ';
  }
}

const PAIR_COLORS = [
  { bg: '#FDF2F8', border: '#DB2777', text: '#9D174D' },
  { bg: '#F5F3FF', border: '#7C3AED', text: '#5B21B6' },
  { bg: '#ECFDF5', border: '#059669', text: '#065F46' },
  { bg: '#FFFBEB', border: '#D97706', text: '#92400E' },
];

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  subject,
  lesson,
  onExit,
  onGoHome,
  onCompleteLesson,
}) => {
  const isExam = lesson.kind === 'exam';
  const totalExamSeconds = lesson.durationMinutes * 60;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRule, setShowRule] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Exam timer state
  const [secondsLeft, setSecondsLeft] = useState(totalExamSeconds);
  const [timerPaused, setTimerPaused] = useState(false);

  // Per-type states
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean | null>(null);
  const [textInput, setTextInput] = useState('');
  const [blankChoice, setBlankChoice] = useState<string>('');
  const [orderedItems, setOrderedItems] = useState<string[]>([]);

  // Classify state: map itemId -> bucketIndex (0 | 1)
  const [classifiedMap, setClassifiedMap] = useState<Record<string, 0 | 1>>({});
  const [activeClassifyItemId, setActiveClassifyItemId] = useState<string | null>(null);

  // Match state: map leftPairId -> selectedRightText
  const [matchedMap, setMatchedMap] = useState<Record<string, string>>({});
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [finished, setFinished] = useState(false);

  // Reset exam timer when opening a new unit
  useEffect(() => {
    setSecondsLeft(lesson.durationMinutes * 60);
    setTimerPaused(false);
    setCurrentIndex(0);
    setCorrectCount(0);
    setEarnedStars(0);
    setFinished(false);
  }, [lesson.id, lesson.durationMinutes]);

  // Live exam countdown interval
  useEffect(() => {
    if (!isExam || finished || timerPaused || secondsLeft <= 0) return;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isExam, finished, timerPaused, secondsLeft]);

  // Celebratory confetti when winning an exam or activity
  useEffect(() => {
    if (!finished) return;
    const isActivityOrExam = lesson.kind === 'exam' || lesson.kind === 'activity';
    const passed = correctCount * 2 >= lesson.exercises.length;
    if (!isActivityOrExam || !passed) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const palette = ['#DB2777', '#EC4899', '#7C3AED', '#F59E0B', '#10B981', '#FDE047'];
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.62 },
      colors: palette,
    });

    const sideTimer = window.setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.65 },
        colors: palette,
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.65 },
        colors: palette,
      });
    }, 240);

    return () => window.clearTimeout(sideTimer);
  }, [finished, lesson.kind, lesson.exercises.length, correctCount]);

  const exercise: Exercise = lesson.exercises[currentIndex];
  const isLtr = exercise?.lang === 'fr' || exercise?.lang === 'en';

  const poolOrderItems = useMemo(() => {
    if (exercise?.type !== 'order' || !exercise.correctOrder) return [];
    return deterministicShuffle(exercise.correctOrder, exercise.id);
  }, [exercise]);

  const shuffledRightMatches = useMemo(() => {
    if (exercise?.type !== 'match' || !exercise.pairs) return [];
    return deterministicShuffle(
      exercise.pairs.map((p) => p.right),
      exercise.id + '_right'
    );
  }, [exercise]);

  const shuffledClassifyItems = useMemo(() => {
    if (exercise?.type !== 'classify' || !exercise.classifyItems) return [];
    return deterministicShuffle(exercise.classifyItems, exercise.id + '_cls');
  }, [exercise]);

  useEffect(() => {
    setShowHint(false);
    setSelectedChoice(null);
    setSelectedBool(null);
    setTextInput('');
    setBlankChoice('');
    setOrderedItems([]);
    setClassifiedMap({});
    setActiveClassifyItemId(null);
    setMatchedMap({});
    setActiveLeftId(null);
    setSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex, lesson.id]);

  const canSubmit = useMemo(() => {
    if (!exercise) return false;
    if (exercise.type === 'choice') return selectedChoice !== null;
    if (exercise.type === 'boolean') return selectedBool !== null;
    if (exercise.type === 'input') return textInput.trim().length > 0;
    if (exercise.type === 'fill_blank') return blankChoice.trim().length > 0;
    if (exercise.type === 'order') {
      return orderedItems.length === (exercise.correctOrder?.length ?? 0);
    }
    if (exercise.type === 'classify') {
      return (
        Object.keys(classifiedMap).length === (exercise.classifyItems?.length ?? 0)
      );
    }
    if (exercise.type === 'match') {
      return Object.keys(matchedMap).length === (exercise.pairs?.length ?? 0);
    }
    return false;
  }, [
    exercise,
    selectedChoice,
    selectedBool,
    textInput,
    blankChoice,
    orderedItems,
    classifiedMap,
    matchedMap,
  ]);

  const handleToggleOrderItem = (item: string) => {
    if (submitted) return;
    if (orderedItems.includes(item)) {
      setOrderedItems((prev) => prev.filter((x) => x !== item));
    } else {
      setOrderedItems((prev) => [...prev, item]);
    }
  };

  const handleDropToOrderZone = (e: React.DragEvent) => {
    e.preventDefault();
    if (submitted) return;
    const item = e.dataTransfer.getData('text/plain');
    if (item && !orderedItems.includes(item)) {
      setOrderedItems((prev) => [...prev, item]);
    }
  };

  const handleAssignClassify = (itemId: string, bucket: 0 | 1) => {
    if (submitted) return;
    setClassifiedMap((prev) => ({ ...prev, [itemId]: bucket }));
    setActiveClassifyItemId(null);
  };

  const handleDropToBucket = (e: React.DragEvent, bucket: 0 | 1) => {
    e.preventDefault();
    if (submitted) return;
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      handleAssignClassify(itemId, bucket);
    }
  };

  const handleSelectRightMatch = (rightVal: string) => {
    if (submitted) return;
    if (activeLeftId) {
      setMatchedMap((prev) => {
        const next = { ...prev };
        for (const k of Object.keys(next)) {
          if (next[k] === rightVal) delete next[k];
        }
        next[activeLeftId] = rightVal;
        return next;
      });
      setActiveLeftId(null);
    }
  };

  const handleCheckAnswer = () => {
    if (!exercise || submitted) return;
    let right = false;

    if (exercise.type === 'choice') {
      right = selectedChoice === exercise.correctIndex;
    } else if (exercise.type === 'boolean') {
      right = selectedBool === exercise.correctBoolean;
    } else if (exercise.type === 'input') {
      const normalized = textInput.trim().toLowerCase().replace(/\s+/g, ' ');
      right = (exercise.correctAnswers ?? []).some(
        (ans) => ans.trim().toLowerCase() === normalized
      );
    } else if (exercise.type === 'fill_blank') {
      const normalized = blankChoice.trim().toLowerCase().replace(/\s+/g, ' ');
      right = (exercise.correctAnswers ?? []).some(
        (ans) => ans.trim().toLowerCase() === normalized
      );
    } else if (exercise.type === 'order') {
      right = (exercise.correctOrder ?? []).every(
        (val, idx) => orderedItems[idx] === val
      );
    } else if (exercise.type === 'classify') {
      right = (exercise.classifyItems ?? []).every(
        (item) => classifiedMap[item.id] === item.bucketIndex
      );
    } else if (exercise.type === 'match') {
      right = (exercise.pairs ?? []).every(
        (pair) => matchedMap[pair.id] === pair.right
      );
    }

    setIsCorrect(right);
    setSubmitted(true);
    if (right) {
      setCorrectCount((prev) => prev + 1);
      setEarnedStars((prev) => prev + exercise.points);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const bonus = correctCount === lesson.exercises.length ? 20 : 10;
      const totalStars = earnedStars + bonus;
      setEarnedStars(totalStars);
      setFinished(true);
      onCompleteLesson(correctCount, lesson.exercises.length, totalStars);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setEarnedStars(0);
    setFinished(false);
    setSecondsLeft(totalExamSeconds);
    setTimerPaused(false);
  };

  if (finished) {
    const accuracy = Math.round((correctCount / lesson.exercises.length) * 100);
    const elapsedSeconds = Math.max(0, totalExamSeconds - secondsLeft);

    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={
            {
              '--rim-from': `${subject.accentHex}66`,
              '--rim-mid': '#EAA8C5',
              '--rim-to': '#F3D79B',
            } as React.CSSProperties
          }
          className="relative srayna-top-frame rounded-2xl p-8 text-center shadow-xs"
        >
          <FrameBlossom size="lg" accentHex={subject.accentHex} />
          <motion.div
            initial={{ scale: 0.7, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="w-18 h-18 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3] border border-[#FBCFE8] flex items-center justify-center text-[#DB2777]"
          >
            <Trophy className="w-9 h-9" />
          </motion.div>
          <p className="text-base font-bold text-[#DB2777] mb-1">
            {subject.title} · {lesson.term}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B2E] mb-3">
            {accuracy >= 75
              ? 'عملٌ رائع يا متميّزة!'
              : accuracy >= 50
                ? 'أحسنتِ يا بطلة! لقد نجحتِ!'
                : 'محاولة جميلة، استمرّي في التقدّم!'}
          </h2>
          <p className="text-base font-semibold text-[#432F46] mb-8">
            أكملتِ {isExam ? 'الاختبار' : lesson.kind === 'activity' ? 'النشاط' : 'الدرس'} «{lesson.title}» وأضفتِ نجوماً جديدة إلى رصيدكِ.
          </p>

          <div
            className={`grid ${
              isExam ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
            } gap-4 max-w-2xl mx-auto mb-8 py-5 px-4 bg-[#FBF2F6] rounded-xl border border-[#F0D9E4]`}
          >
            <div>
              <div className="text-sm font-bold text-[#432F46] mb-1">الإجابات الصحيحة</div>
              <div className="text-2xl font-extrabold text-[#2D1B2E] tabular-nums">
                {correctCount} / {lesson.exercises.length}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#432F46] mb-1">نسبة النجاح</div>
              <div className="text-2xl font-extrabold text-[#059669] tabular-nums">{accuracy}%</div>
            </div>
            <div>
              <div className="text-sm font-bold text-[#432F46] mb-1">النجوم المكتسبة</div>
              <div className="text-2xl font-extrabold text-[#DB2777] tabular-nums">
                +{earnedStars} ★
              </div>
            </div>
            {isExam && (
              <div>
                <div className="text-sm font-bold text-[#432F46] mb-1">الوقت المستغرق</div>
                <div className="text-2xl font-extrabold text-[#7C3AED] tabular-nums">
                  {formatClock(elapsedSeconds)}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-[#DB2777] text-base font-bold hover:bg-[#FCE7F3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
            <button
              type="button"
              onClick={onExit}
              className="px-6 py-3 rounded-xl bg-[#DB2777] text-white text-base font-bold hover:bg-[#BE185D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              العودة إلى القائمة
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#F0D9E4] text-[#2D1B2E] text-base font-bold hover:bg-[#FBF2F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المحاولة</span>
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  const progressPct = Math.round(
    ((currentIndex + (submitted ? 1 : 0)) / lesson.exercises.length) * 100
  );
  const isTimerLow = isExam && secondsLeft > 0 && secondsLeft <= 120;
  const isTimeUp = isExam && secondsLeft === 0;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Back Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-sm sm:text-base font-bold text-[#DB2777] hover:bg-[#FCE7F3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#F0D9E4] text-sm sm:text-base font-bold text-[#2D1B2E] hover:bg-[#FBF2F6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى {subject.title}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-base font-bold text-[#432F46] tabular-nums">
          <span>{lesson.term}</span>
          <span aria-hidden="true">·</span>
          <span>
            السؤال {currentIndex + 1} من {lesson.exercises.length}
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-extrabold text-[#DB2777]">
            <Star className="w-4 h-4 fill-current" />
            {earnedStars}
          </span>
        </div>
      </div>

      {/* Exam Countdown Timer Bar */}
      {isExam && (
        <div
          className={`mb-5 rounded-2xl border px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 transition-colors ${
            isTimeUp
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
              : isTimerLow
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
                : 'bg-gradient-to-l from-[#FDF2F8] to-[#F5F3FF] border-[#FBCFE8] text-[#2D1B2E]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isTimeUp
                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                  : isTimerLow
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-white border border-[#FBCFE8] text-[#DB2777]'
              }`}
            >
              <Timer className="w-5 h-5" />
            </span>
            <div>
              <div className="text-sm sm:text-base font-extrabold">
                {isTimeUp
                  ? 'انتهى وقت الاختبار المحدّد'
                  : isTimerLow
                    ? 'تنبيه: أوشك وقت الاختبار على الانتهاء'
                    : 'مؤقت الاختبار الرسمي'}
              </div>
              <div className="text-sm font-semibold opacity-90">
                {isTimeUp
                  ? 'يمكنكِ إتمام الإجابة عن الأسئلة المتبقية بهدوء.'
                  : timerPaused
                    ? 'المؤقت متوقف مؤقتاً'
                    : `المدة المخصّصة: ${lesson.durationMinutes} دقيقة`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-xl bg-white border font-extrabold text-xl tabular-nums ${
                isTimeUp
                  ? 'border-[#FCA5A5] text-[#DC2626]'
                  : isTimerLow
                    ? 'border-[#FCD34D] text-[#B45309]'
                    : 'border-[#FBCFE8] text-[#DB2777]'
              }`}
            >
              {formatClock(secondsLeft)}
            </span>

            {!isTimeUp && (
              <button
                type="button"
                onClick={() => setTimerPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#F0D9E4] text-sm font-bold text-[#2D1B2E] hover:bg-[#FDF2F8] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {timerPaused ? (
                  <>
                    <Play className="w-4 h-4 text-[#059669]" />
                    <span>استئناف</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 text-[#DB2777]" />
                    <span>إيقاف مؤقت</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {isTimeUp && (
        <div className="mb-5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-4 py-3 flex items-center gap-2.5 text-sm sm:text-base font-bold text-[#92400E]">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#D97706]" />
          <span>لا تقلقي يا بطلة! انتهى المؤقت ولكن يمكنكِ إكمال الأسئلة أو الضغط على «إعادة المحاولة» لاحقاً.</span>
        </div>
      )}

      {/* Linear Progress Bar */}
      <div className="w-full h-3.5 bg-[#F4DCE6] rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.max(progressPct, 8)}%`,
            backgroundColor: subject.accentHex,
          }}
        />
      </div>

      {/* Collapsible Mini Lesson Card ("تذكّر القاعدة") */}
      <div
        style={
          {
            '--rim-from': `${subject.accentHex}66`,
            '--rim-mid': '#F1B3CD',
            '--rim-to': '#F3D79B',
          } as React.CSSProperties
        }
        className="relative srayna-top-frame rounded-2xl mb-6"
      >
        <FrameBlossom size="sm" accentHex={subject.accentHex} />
        <div className="rounded-[15px] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowRule((prev) => !prev)}
            className="w-full flex items-center justify-between px-6 py-4 text-right hover:bg-[#FFF9FB] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 shrink-0" style={{ color: subject.accentHex }} />
              <span className="text-base sm:text-lg font-extrabold text-[#2D1B2E]">
                {lesson.summaryTitle}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#432F46] whitespace-nowrap shrink-0">
              <span>{showRule ? 'إخفاء الملخص' : 'عرض الملخص'}</span>
              {showRule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>
          {showRule && (
            <div className="px-6 pb-5 pt-2 border-t border-[#F6E8EE] bg-[#FFFDFD]">
              <ul
                className="space-y-2.5 text-base font-semibold text-[#432F46] leading-relaxed"
                dir={isLtr ? 'ltr' : 'rtl'}
              >
                {lesson.summaryPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span
                      className="mt-2.5 w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: subject.accentHex }}
                    />
                    <span className={isLtr ? 'font-latin' : ''}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Active Exercise Stage */}
      <div
        style={
          {
            '--rim-from': `${subject.accentHex}66`,
            '--rim-mid': '#D4BFF2',
            '--rim-to': '#EAA8C5',
          } as React.CSSProperties
        }
        className="relative srayna-top-frame rounded-2xl p-6 sm:p-8"
      >
        <FrameBlossom size="lg" accentHex={subject.accentHex} />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#432F46]">
            <span style={{ color: subject.accentHex }}>
              {getExerciseTypeLabel(exercise.type, isLtr)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{lesson.title}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-[#DB2777]">{exercise.points} نجمة</span>
          </div>

          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-[#6D28D9] bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showHint ? 'إخفاء التلميح' : 'تلميح لطيف'}</span>
          </button>
        </div>

        {showHint && (
          <div
            dir={isLtr ? 'ltr' : 'rtl'}
            className={`mb-5 p-4 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-base font-semibold text-[#4C1D95] leading-relaxed ${
              isLtr ? 'font-latin' : ''
            }`}
          >
            {exercise.hint}
          </div>
        )}

        <div dir={isLtr ? 'ltr' : 'rtl'} className={isLtr ? 'font-latin text-left' : 'text-right'}>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#2D1B2E] leading-relaxed mb-2">
            {exercise.prompt}
          </h3>
          {exercise.subPrompt && (
            <p className="text-base font-semibold text-[#432F46] mb-5">{exercise.subPrompt}</p>
          )}

          {/* Type 1: Multiple Choice */}
          {exercise.type === 'choice' && exercise.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
              {exercise.options.map((opt, idx) => {
                const isSelected = selectedChoice === idx;
                const isRightOption = submitted && idx === exercise.correctIndex;
                const isWrongSelected = submitted && isSelected && !isRightOption;

                let btnClass =
                  'bg-[#FFF9FB] border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777] hover:bg-[#FDF2F8]';
                if (isSelected && !submitted) {
                  btnClass = 'bg-[#FDF2F8] border-[#DB2777] text-[#9D174D] ring-2 ring-[#FBCFE8]';
                } else if (isRightOption) {
                  btnClass = 'bg-[#ECFDF5] border-[#059669] text-[#065F46]';
                } else if (isWrongSelected) {
                  btnClass = 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelectedChoice(idx)}
                    className={`flex items-center justify-between gap-3 px-5 py-4 rounded-xl border text-base sm:text-lg font-bold transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <span className="leading-snug">{opt}</span>
                    {isRightOption && <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />}
                    {isWrongSelected && <XCircle className="w-5 h-5 text-[#DC2626] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Type 2: Boolean */}
          {exercise.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
              {[
                { val: true, label: isLtr ? 'True / Vrai' : 'صحيح' },
                { val: false, label: isLtr ? 'False / Faux' : 'خطأ' },
              ].map((item) => {
                const isSelected = selectedBool === item.val;
                const isRightOption = submitted && item.val === exercise.correctBoolean;
                const isWrongSelected = submitted && isSelected && !isRightOption;

                let btnClass =
                  'bg-[#FFF9FB] border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777] hover:bg-[#FDF2F8]';
                if (isSelected && !submitted) {
                  btnClass = 'bg-[#FDF2F8] border-[#DB2777] text-[#9D174D] ring-2 ring-[#FBCFE8]';
                } else if (isRightOption) {
                  btnClass = 'bg-[#ECFDF5] border-[#059669] text-[#065F46]';
                } else if (isWrongSelected) {
                  btnClass = 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]';
                }

                return (
                  <button
                    key={String(item.val)}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelectedBool(item.val)}
                    className={`flex items-center justify-center gap-2 px-5 py-4 rounded-xl border text-base sm:text-lg font-extrabold transition-colors cursor-pointer disabled:cursor-default ${btnClass}`}
                  >
                    <span>{item.label}</span>
                    {isRightOption && <CheckCircle2 className="w-5 h-5 text-[#059669]" />}
                    {isWrongSelected && <XCircle className="w-5 h-5 text-[#DC2626]" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Type 3: Input */}
          {exercise.type === 'input' && (
            <div className="mt-6 max-w-lg">
              <label htmlFor="exercise-input" className="sr-only">
                الإجابة
              </label>
              <input
                id="exercise-input"
                type="text"
                disabled={submitted}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit && !submitted) {
                    handleCheckAnswer();
                  }
                }}
                placeholder={exercise.inputPlaceholder ?? 'اكتبي إجابتكِ هنا'}
                className="w-full px-5 py-3.5 rounded-xl border border-[#EED5E0] bg-[#FFF9FB] text-lg font-bold text-[#2D1B2E] focus:outline-none focus:border-[#DB2777] focus:ring-2 focus:ring-[#FBCFE8] tabular-nums"
              />
              {exercise.quickKeys && !submitted && (
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {exercise.quickKeys.map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTextInput((prev) => prev + k)}
                      className="min-w-[42px] h-10 px-3 rounded-lg bg-[#FBF2F6] border border-[#F0D9E4] text-base font-bold text-[#2D1B2E] hover:bg-[#FCE7F3] transition-colors cursor-pointer tabular-nums"
                    >
                      {k}
                    </button>
                  ))}
                  {textInput.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTextInput('')}
                      className="h-10 px-3 rounded-lg bg-white border border-[#F0D9E4] text-sm font-bold text-[#432F46] hover:bg-[#FBF2F6] cursor-pointer"
                    >
                      مسح
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Type 4: Fill in the Blank */}
          {exercise.type === 'fill_blank' && (
            <div className="mt-6 space-y-5">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (submitted) return;
                  const val = e.dataTransfer.getData('text/plain');
                  if (val) setBlankChoice(val);
                }}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFF9FB] border border-[#F0D9E4] text-lg sm:text-xl font-bold text-[#2D1B2E] leading-loose flex flex-wrap items-center gap-2"
              >
                {exercise.sentenceBefore && <span>{exercise.sentenceBefore}</span>}
                <span
                  onClick={() => {
                    if (!submitted && blankChoice) setBlankChoice('');
                  }}
                  className={`inline-flex items-center justify-center min-w-[130px] px-4 py-1.5 rounded-xl border-2 border-dashed text-base sm:text-lg font-bold transition-colors tabular-nums ${
                    blankChoice
                      ? submitted
                        ? isCorrect
                          ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                          : 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                        : 'bg-[#FDF2F8] border-[#DB2777] text-[#9D174D] cursor-pointer'
                      : 'bg-white border-[#DB2777]/50 text-[#5C475E]'
                  }`}
                >
                  {blankChoice || (isLtr ? 'Drop or tap word' : 'اسحبي أو اختاري')}
                </span>
                {exercise.sentenceAfter && <span>{exercise.sentenceAfter}</span>}
              </div>

              {exercise.wordBank && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {exercise.wordBank.map((word) => {
                    const selected = blankChoice === word;
                    return (
                      <button
                        key={word}
                        type="button"
                        draggable={!submitted}
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', word)}
                        disabled={submitted}
                        onClick={() => setBlankChoice(word)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-base font-bold transition-colors tabular-nums cursor-grab active:cursor-grabbing ${
                          selected
                            ? 'bg-[#DB2777] border-[#DB2777] text-white'
                            : 'bg-white border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777] hover:bg-[#FDF2F8]'
                        }`}
                      >
                        <GripVertical className="w-4 h-4 opacity-60" />
                        <span>{word}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Type 5: Drag & Drop / Tap Ordering */}
          {exercise.type === 'order' && (
            <div className="mt-6 space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropToOrderZone}
                className="min-h-[76px] p-4 rounded-xl bg-[#FFF9FB] border-2 border-dashed border-[#DB2777]/45 flex flex-wrap items-center gap-2.5"
              >
                {orderedItems.length === 0 ? (
                  <span className="text-base font-semibold text-[#5C475E]">
                    {isLtr
                      ? 'Drag cards here or click them below in the right order...'
                      : 'اسحبي البطاقات إلى هنا أو اضغطي عليها بالترتيب الصحيح...'}
                  </span>
                ) : (
                  orderedItems.map((item, idx) => (
                    <button
                      key={`${item}-${idx}`}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleToggleOrderItem(item)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DB2777] text-white text-base font-bold shadow-xs hover:bg-[#BE185D] transition-colors cursor-pointer tabular-nums"
                    >
                      <span className="text-sm opacity-90">{idx + 1}.</span>
                      <span>{item}</span>
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {poolOrderItems.map((item) => {
                  const used = orderedItems.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      draggable={!submitted && !used}
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', item)}
                      disabled={submitted || used}
                      onClick={() => handleToggleOrderItem(item)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-base font-bold transition-colors tabular-nums ${
                        used
                          ? 'bg-[#F3E8EE] border-[#EED5E0] text-[#9E879F] cursor-default'
                          : 'bg-white border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777] hover:bg-[#FDF2F8] cursor-grab active:cursor-grabbing'
                      }`}
                    >
                      {!used && <GripVertical className="w-4 h-4 opacity-55" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type 6: Drag & Drop Classification */}
          {exercise.type === 'classify' && exercise.buckets && (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5 min-h-[52px] p-3.5 rounded-xl bg-[#FBF2F6] border border-[#F0D9E4]">
                {shuffledClassifyItems.filter((it) => classifiedMap[it.id] === undefined).length ===
                0 ? (
                  <span className="text-sm sm:text-base font-bold text-[#059669]">
                    {isLtr
                      ? 'All items placed! Click "Check Answer" below.'
                      : 'تم توزيع كل البطاقات! اضغطي على «تحقّقي من الإجابة» بالأسفل.'}
                  </span>
                ) : (
                  shuffledClassifyItems
                    .filter((it) => classifiedMap[it.id] === undefined)
                    .map((item) => {
                      const active = activeClassifyItemId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          draggable={!submitted}
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                          onClick={() =>
                            setActiveClassifyItemId((prev) =>
                              prev === item.id ? null : item.id
                            )
                          }
                          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-base font-bold transition-colors cursor-grab active:cursor-grabbing ${
                            active
                              ? 'bg-[#DB2777] border-[#DB2777] text-white'
                              : 'bg-white border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777]'
                          }`}
                        >
                          <GripVertical className="w-4 h-4 opacity-60" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exercise.buckets.map((bucketTitle, bIdx) => {
                  const bucketIndex = bIdx as 0 | 1;
                  const itemsInBucket = shuffledClassifyItems.filter(
                    (it) => classifiedMap[it.id] === bucketIndex
                  );
                  return (
                    <div
                      key={bucketTitle}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropToBucket(e, bucketIndex)}
                      onClick={() => {
                        if (activeClassifyItemId) {
                          handleAssignClassify(activeClassifyItemId, bucketIndex);
                        }
                      }}
                      className={`min-h-[135px] p-4 rounded-2xl border-2 border-dashed transition-colors ${
                        activeClassifyItemId
                          ? 'border-[#DB2777] bg-[#FDF2F8]/60 cursor-pointer'
                          : 'border-[#EED5E0] bg-[#FFF9FB]'
                      }`}
                    >
                      <div className="text-base font-extrabold text-[#2D1B2E] mb-3">
                        {bucketTitle}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {itemsInBucket.map((item) => {
                          const itemCorrect =
                            submitted && item.bucketIndex === bucketIndex;
                          const itemWrong =
                            submitted && item.bucketIndex !== bucketIndex;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              disabled={submitted}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!submitted) {
                                  setClassifiedMap((prev) => {
                                    const copy = { ...prev };
                                    delete copy[item.id];
                                    return copy;
                                  });
                                }
                              }}
                              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-base font-bold cursor-pointer ${
                                itemCorrect
                                  ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                                  : itemWrong
                                    ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                                    : 'bg-white border-[#DB2777] text-[#9D174D]'
                              }`}
                            >
                              <span>{item.label}</span>
                              {itemCorrect && <CheckCircle2 className="w-4 h-4 text-[#059669]" />}
                              {itemWrong && <XCircle className="w-4 h-4 text-[#DC2626]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Type 7: Pair Matching */}
          {exercise.type === 'match' && exercise.pairs && (
            <div className="mt-6 space-y-3">
              <p className="text-sm sm:text-base font-bold text-[#432F46]">
                {isLtr
                  ? 'Tap an item on the left, then tap its matching partner on the right.'
                  : 'اضغطي على بطاقة من اليمين ثم اضغطي على ما يناسبها من اليسار لربطهما معاً.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  {exercise.pairs.map((pair, idx) => {
                    const color = PAIR_COLORS[idx % PAIR_COLORS.length];
                    const isSelected = activeLeftId === pair.id;
                    const assignedRight = matchedMap[pair.id];
                    const pairCorrect = submitted && assignedRight === pair.right;
                    const pairWrong = submitted && assignedRight !== pair.right;

                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setActiveLeftId((prev) => (prev === pair.id ? null : pair.id))
                        }
                        style={
                          assignedRight && !submitted
                            ? {
                                backgroundColor: color.bg,
                                borderColor: color.border,
                                color: color.text,
                              }
                            : undefined
                        }
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-base font-bold transition-colors cursor-pointer ${
                          pairCorrect
                            ? 'bg-[#ECFDF5] border-[#059669] text-[#065F46]'
                            : pairWrong
                              ? 'bg-[#FEF2F2] border-[#DC2626] text-[#991B1B]'
                              : isSelected
                                ? 'bg-[#FDF2F8] border-[#DB2777] text-[#9D174D] ring-2 ring-[#FBCFE8]'
                                : 'bg-[#FFF9FB] border-[#EED5E0] text-[#2D1B2E] hover:border-[#DB2777]'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 tabular-nums">
                          <span className="w-7 h-7 rounded-full bg-white/90 border border-current/25 text-sm flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{pair.left}</span>
                        </span>
                        {assignedRight && (
                          <span className="inline-flex items-center gap-1 text-sm opacity-95">
                            <Link2 className="w-4 h-4" />
                            <span>{assignedRight}</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2.5">
                  {shuffledRightMatches.map((rightText) => {
                    const mappedLeftIdx = exercise.pairs!.findIndex(
                      (p) => matchedMap[p.id] === rightText
                    );
                    const color =
                      mappedLeftIdx >= 0
                        ? PAIR_COLORS[mappedLeftIdx % PAIR_COLORS.length]
                        : null;

                    return (
                      <button
                        key={rightText}
                        type="button"
                        disabled={submitted || !activeLeftId}
                        onClick={() => handleSelectRightMatch(rightText)}
                        style={
                          color
                            ? {
                                backgroundColor: color.bg,
                                borderColor: color.border,
                                color: color.text,
                              }
                            : undefined
                        }
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-base font-bold transition-colors tabular-nums ${
                          activeLeftId
                            ? 'cursor-pointer hover:border-[#DB2777] bg-white border-[#EED5E0] text-[#2D1B2E]'
                            : 'bg-[#FFF9FB] border-[#EED5E0] text-[#2D1B2E] cursor-default'
                        }`}
                      >
                        <span>{rightText}</span>
                        {mappedLeftIdx >= 0 && (
                          <span className="w-7 h-7 rounded-full bg-white/90 border border-current/25 text-sm flex items-center justify-center shrink-0">
                            {mappedLeftIdx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Immediate Friendly Feedback Banner */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            dir={isLtr ? 'ltr' : 'rtl'}
            className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
              isCorrect
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
            } ${isLtr ? 'font-latin text-left' : 'text-right'}`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 text-[#059669] shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-base sm:text-lg font-extrabold mb-1">
                {isCorrect
                  ? isLtr
                    ? `Bravo! +${exercise.points} stars`
                    : `أحسنتِ يا بطلة! (+${exercise.points} نجمة)`
                  : isLtr
                    ? 'Good try! Look at the explanation:'
                    : 'محاولة جميلة! إليكِ التوضيح:'}
              </div>
              <p className="text-base font-semibold leading-relaxed">{exercise.explanation}</p>
            </div>
          </motion.div>
        )}

        {/* Action Footer */}
        <div className="mt-7 pt-5 border-t border-[#F6E8EE] flex items-center justify-between gap-4">
          {!submitted ? (
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleCheckAnswer}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DB2777] text-white text-base font-extrabold hover:bg-[#BE185D] disabled:bg-[#F3D2E1] disabled:text-white/95 transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              <RoseEmblem variant="light" size={22} />
              <span>تحقّقي من الإجابة</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D1B2E] text-white text-base font-extrabold hover:bg-[#422844] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RoseEmblem variant="light" size={22} />
              <span>
                {currentIndex + 1 < lesson.exercises.length ? 'السؤال التالي' : 'عرض النتيجة والنجوم'}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
