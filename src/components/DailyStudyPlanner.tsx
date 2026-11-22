import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  Check,
  Clock,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SUBJECTS } from '../data/curriculum';
import { AppSection, SubjectId, TermFilter } from '../types/education';
import { FrameBlossom } from './FrameBlossom';
import { RoseEmblem } from './RoseEmblem';

export interface UpcomingExam {
  id: string;
  subjectId: SubjectId;
  title: string;
  date: string; // YYYY-MM-DD
}

export interface DailyRevisionSlot {
  id: string;
  subjectId: SubjectId;
  startTime: string; // HH:MM
  durationMinutes: number;
  goal: string;
  track: Extract<AppSection, 'lessons' | 'activities' | 'exams'>;
  completedDate: string | null; // YYYY-MM-DD
}

interface StudyPlannerState {
  exams: UpcomingExam[];
  slots: DailyRevisionSlot[];
}

interface DailyStudyPlannerProps {
  selectedTerm: TermFilter;
  onOpenSubjectTrack: (
    subjectId: SubjectId,
    track: Extract<AppSection, 'lessons' | 'activities' | 'exams'>
  ) => void;
}

const PLANNER_STORAGE_KEY = 'srayna_study_planner_v1';

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysIso(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDaysRemaining(dateStr: string): number {
  const today = new Date(`${getTodayIsoDate()}T00:00:00`);
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCountdownLabel(days: number): string {
  if (days < 0) return 'انتهى الموعد';
  if (days === 0) return 'اليوم';
  if (days === 1) return 'غداً';
  if (days === 2) return 'بعد يومين';
  if (days <= 10) return `بعد ${days} أيّام`;
  return `بعد ${days} يوماً`;
}

function formatArabicDate(dateStr: string): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatEndTime(startTime: string, durationMinutes: number): string {
  const [hStr, mStr] = startTime.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return '';
  const total = h * 60 + m + durationMinutes;
  const endH = Math.floor((total % 1440) / 60);
  const endM = total % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

const TRACK_LABELS: Record<DailyRevisionSlot['track'], string> = {
  lessons: 'مراجعة درس',
  activities: 'أنشطة تفاعليّة',
  exams: 'تمارين وامتحانات',
};

function createStarterState(): StudyPlannerState {
  return {
    exams: [
      {
        id: 'exam-starter-1',
        subjectId: 'math',
        title: 'فرض مراقبة في الرياضيات',
        date: addDaysIso(2),
      },
      {
        id: 'exam-starter-2',
        subjectId: 'arabic',
        title: 'اختبار قواعد وإنتاج كتابي',
        date: addDaysIso(4),
      },
      {
        id: 'exam-starter-3',
        subjectId: 'science',
        title: 'تقييم الإيقاظ العلمي',
        date: addDaysIso(7),
      },
    ],
    slots: [
      {
        id: 'slot-starter-1',
        subjectId: 'math',
        startTime: '17:00',
        durationMinutes: 25,
        goal: 'مراجعة الكسور وحلّ نموذج فرض مراقبة',
        track: 'exams',
        completedDate: null,
      },
      {
        id: 'slot-starter-2',
        subjectId: 'arabic',
        startTime: '17:35',
        durationMinutes: 20,
        goal: 'قواعد الجملة الفعلية والتدريب على التعبير',
        track: 'lessons',
        completedDate: null,
      },
      {
        id: 'slot-starter-3',
        subjectId: 'science',
        startTime: '18:05',
        durationMinutes: 20,
        goal: 'تثبيت المفاهيم عبر الأنشطة التفاعلية',
        track: 'activities',
        completedDate: null,
      },
    ],
  };
}

function loadPlannerState(): StudyPlannerState {
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return createStarterState();
    const parsed = JSON.parse(raw) as Partial<StudyPlannerState>;
    return {
      exams: Array.isArray(parsed.exams) ? parsed.exams : createStarterState().exams,
      slots: Array.isArray(parsed.slots) ? parsed.slots : createStarterState().slots,
    };
  } catch {
    return createStarterState();
  }
}

export const DailyStudyPlanner: React.FC<DailyStudyPlannerProps> = ({
  selectedTerm,
  onOpenSubjectTrack,
}) => {
  const [planner, setPlanner] = useState<StudyPlannerState>(loadPlannerState);
  const todayIso = getTodayIsoDate();

  // Add/Edit Exam form state
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examSubjectId, setExamSubjectId] = useState<SubjectId>('math');
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState(addDaysIso(3));

  // Add/Edit Slot form state
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotSubjectId, setSlotSubjectId] = useState<SubjectId>('math');
  const [slotStartTime, setSlotStartTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(25);
  const [slotTrack, setSlotTrack] = useState<DailyRevisionSlot['track']>('lessons');
  const [slotGoal, setSlotGoal] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(planner));
    } catch {
      // Ignore quota errors gracefully
    }
  }, [planner]);

  const subjectMap = useMemo(() => {
    const map = {} as Record<SubjectId, (typeof SUBJECTS)[number]>;
    for (const s of SUBJECTS) {
      map[s.id] = s;
    }
    return map;
  }, []);

  // Sort exams chronologically (nearest first)
  const sortedExams = useMemo(() => {
    return [...planner.exams].sort((a, b) => a.date.localeCompare(b.date));
  }, [planner.exams]);

  // Map each subject to its nearest upcoming exam (0+ days away)
  const nearestExamBySubject = useMemo(() => {
    const map: Partial<Record<SubjectId, { exam: UpcomingExam; days: number }>> = {};
    for (const exam of sortedExams) {
      const days = getDaysRemaining(exam.date);
      if (days >= 0 && !map[exam.subjectId]) {
        map[exam.subjectId] = { exam, days };
      }
    }
    return map;
  }, [sortedExams]);

  const completedTodayCount = planner.slots.filter(
    (s) => s.completedDate === todayIso
  ).length;

  const totalPlannedMinutes = planner.slots.reduce(
    (sum, s) => sum + s.durationMinutes,
    0
  );

  // --- Exam CRUD handlers ---
  const openNewExamForm = () => {
    setEditingExamId(null);
    setExamSubjectId('math');
    setExamTitle('');
    setExamDate(addDaysIso(3));
    setShowExamForm(true);
  };

  const openEditExamForm = (exam: UpcomingExam) => {
    setEditingExamId(exam.id);
    setExamSubjectId(exam.subjectId);
    setExamTitle(exam.title);
    setExamDate(exam.date);
    setShowExamForm(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectTitle = subjectMap[examSubjectId].title;
    const cleanTitle = examTitle.trim() || `امتحان في ${subjectTitle}`;
    if (!examDate) return;

    if (editingExamId) {
      setPlanner((prev) => ({
        ...prev,
        exams: prev.exams.map((ex) =>
          ex.id === editingExamId
            ? { ...ex, subjectId: examSubjectId, title: cleanTitle, date: examDate }
            : ex
        ),
      }));
    } else {
      const newExam: UpcomingExam = {
        id: `exam-${Date.now()}`,
        subjectId: examSubjectId,
        title: cleanTitle,
        date: examDate,
      };
      setPlanner((prev) => ({
        ...prev,
        exams: [...prev.exams, newExam],
      }));
    }
    setShowExamForm(false);
    setEditingExamId(null);
    setExamTitle('');
  };

  const handleDeleteExam = (examId: string) => {
    setPlanner((prev) => ({
      ...prev,
      exams: prev.exams.filter((ex) => ex.id !== examId),
    }));
  };

  // --- Daily Revision Slot CRUD handlers ---
  const openNewSlotForm = (presetSubject?: SubjectId) => {
    setEditingSlotId(null);
    setSlotSubjectId(presetSubject ?? sortedExams[0]?.subjectId ?? 'math');
    const lastSlot = planner.slots[planner.slots.length - 1];
    const suggestedStart = lastSlot
      ? formatEndTime(lastSlot.startTime, lastSlot.durationMinutes + 10) || '17:00'
      : '17:00';
    setSlotStartTime(suggestedStart);
    setSlotDuration(25);
    setSlotTrack('exams');
    setSlotGoal('');
    setShowSlotForm(true);
  };

  const openEditSlotForm = (slot: DailyRevisionSlot) => {
    setEditingSlotId(slot.id);
    setSlotSubjectId(slot.subjectId);
    setSlotStartTime(slot.startTime);
    setSlotDuration(slot.durationMinutes);
    setSlotTrack(slot.track);
    setSlotGoal(slot.goal);
    setShowSlotForm(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectTitle = subjectMap[slotSubjectId].title;
    const cleanGoal = slotGoal.trim() || `مراجعة مركّزة في ${subjectTitle}`;

    if (editingSlotId) {
      setPlanner((prev) => ({
        ...prev,
        slots: prev.slots.map((s) =>
          s.id === editingSlotId
            ? {
                ...s,
                subjectId: slotSubjectId,
                startTime: slotStartTime || '17:00',
                durationMinutes: Math.max(5, Math.min(120, Number(slotDuration) || 20)),
                track: slotTrack,
                goal: cleanGoal,
              }
            : s
        ),
      }));
    } else {
      const newSlot: DailyRevisionSlot = {
        id: `slot-${Date.now()}`,
        subjectId: slotSubjectId,
        startTime: slotStartTime || '17:00',
        durationMinutes: Math.max(5, Math.min(120, Number(slotDuration) || 20)),
        track: slotTrack,
        goal: cleanGoal,
        completedDate: null,
      };
      setPlanner((prev) => ({
        ...prev,
        slots: [...prev.slots, newSlot],
      }));
    }
    setShowSlotForm(false);
    setEditingSlotId(null);
    setSlotGoal('');
  };

  const handleDeleteSlot = (slotId: string) => {
    setPlanner((prev) => ({
      ...prev,
      slots: prev.slots.filter((s) => s.id !== slotId),
    }));
  };

  const handleToggleSlotDone = (slotId: string) => {
    setPlanner((prev) => ({
      ...prev,
      slots: prev.slots.map((s) =>
        s.id === slotId
          ? {
              ...s,
              completedDate: s.completedDate === todayIso ? null : todayIso,
            }
          : s
      ),
    }));
  };

  const handleMoveSlot = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= planner.slots.length) return;
    setPlanner((prev) => {
      const nextSlots = [...prev.slots];
      const temp = nextSlots[index];
      nextSlots[index] = nextSlots[targetIndex];
      nextSlots[targetIndex] = temp;
      return { ...prev, slots: nextSlots };
    });
  };

  const handleResetTodayChecks = () => {
    setPlanner((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => ({ ...s, completedDate: null })),
    }));
  };

  // Auto-organize daily revision plan according to nearest upcoming exams
  const handleOrganizeByUpcomingExams = () => {
    const activeUpcoming = sortedExams.filter((ex) => getDaysRemaining(ex.date) >= 0);
    if (activeUpcoming.length === 0) {
      openNewExamForm();
      return;
    }

    const startTimes = ['17:00', '17:35', '18:10', '18:45'];
    const generatedSlots: DailyRevisionSlot[] = activeUpcoming
      .slice(0, 3)
      .map((exam, idx) => {
        const days = getDaysRemaining(exam.date);
        const duration = days <= 2 ? 30 : 20;
        const track: DailyRevisionSlot['track'] =
          days <= 2 ? 'exams' : idx === 1 ? 'lessons' : 'activities';
        return {
          id: `slot-auto-${Date.now()}-${idx}`,
          subjectId: exam.subjectId,
          startTime: startTimes[idx] ?? '19:00',
          durationMinutes: duration,
          goal: `التحضير لـ: ${exam.title} (${formatCountdownLabel(days)})`,
          track,
          completedDate: null,
        };
      });

    setPlanner((prev) => ({
      ...prev,
      slots: generatedSlots,
    }));
  };

  return (
    <section
      aria-labelledby="daily-planner-heading"
      style={
        {
          '--frame-bg': 'rgba(255, 255, 255, 0.96)',
          '--rim-from': '#EAA8C5',
          '--rim-mid': '#D4BFF2',
          '--rim-to': '#F3D79B',
        } as React.CSSProperties
      }
      className="relative srayna-top-frame rounded-3xl p-5 sm:p-7 space-y-6"
    >
      <FrameBlossom size="lg" />
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#F7E8F0]">
        <div>
          <p className="text-sm sm:text-base font-bold text-[#DB2777] mb-1">
            تنظيم الوقت الشخصي · {selectedTerm === 'الكل' ? 'كامل السنة' : selectedTerm}
          </p>
          <h2
            id="daily-planner-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#2D1B2E] leading-snug"
          >
            جدول المراجعة اليوميّة ومواعيد الامتحانات
          </h2>
          <p className="text-base font-semibold text-[#432F46] mt-1">
            أضيفي مواعيد امتحاناتكِ القادمة وتحكّمي بحصص المراجعة اليوميّة بالوقت والمدّة التي تناسبكِ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleOrganizeByUpcomingExams}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] text-sm sm:text-base font-bold text-[#6D28D9] hover:bg-[#EDE9FE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>ترتيب حسب أقرب امتحان</span>
          </button>

          <button
            type="button"
            onClick={() => openNewSlotForm()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DB2777] text-white text-sm sm:text-base font-bold hover:bg-[#BE185D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RoseEmblem variant="light" size={20} />
            <Plus className="w-4 h-4 shrink-0" />
            <span>إضافة حصّة مراجعة</span>
          </button>
        </div>
      </div>

      {/* Part 1: Upcoming Exams Controlled by the Student */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#DB2777] shrink-0" />
            <h3 className="text-lg font-extrabold text-[#2D1B2E]">
              مواعيد الامتحانات القادمة
            </h3>
            <span className="text-sm font-bold text-[#432F46] tabular-nums">
              · {sortedExams.length} مواعيد
            </span>
          </div>

          <button
            type="button"
            onClick={openNewExamForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF8FB] border border-[#F2D7E5] text-sm sm:text-base font-bold text-[#DB2777] hover:bg-[#FDF2F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>إضافة موعد امتحان</span>
          </button>
        </div>

        {/* Add / Edit Exam Inline Form */}
        {showExamForm && (
          <form
            onSubmit={handleSaveExam}
            className="bg-[#FFF8FB] border border-[#F2D7E5] rounded-2xl p-4 sm:p-5 space-y-4"
          >
            <div className="text-base font-extrabold text-[#2D1B2E]">
              {editingExamId ? 'تعديل موعد الامتحان' : 'إضافة موعد امتحان جديد'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  المادة الدراسيّة
                </label>
                <select
                  value={examSubjectId}
                  onChange={(e) => setExamSubjectId(e.target.value as SubjectId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2D7E5] bg-white text-base font-bold text-[#2D1B2E] focus:outline-none focus:border-[#DB2777]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  اسم الامتحان أو الفرض
                </label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="مثال: فرض مراقبة عدد 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2D7E5] bg-white text-base font-semibold text-[#2D1B2E] placeholder:text-[#6B546E] focus:outline-none focus:border-[#DB2777]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  تاريخ الامتحان
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F2D7E5] bg-white text-base font-bold text-[#2D1B2E] tabular-nums focus:outline-none focus:border-[#DB2777]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#DB2777] text-white text-sm sm:text-base font-bold hover:bg-[#BE185D] transition-colors cursor-pointer"
              >
                {editingExamId ? 'حفظ التعديل' : 'إضافة الموعد'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExamForm(false);
                  setEditingExamId(null);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#F2D7E5] text-sm sm:text-base font-bold text-[#432F46] hover:bg-[#FDF2F8] transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {sortedExams.length === 0 ? (
          <div className="bg-[#FFF8FB] border border-[#F2D7E5] rounded-2xl p-5 text-center">
            <p className="text-base font-semibold text-[#432F46]">
              لم تضيفي مواعيد امتحانات بعد. اضغطي على «إضافة موعد امتحان» لتحديد أول اختبار قادم.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {sortedExams.map((exam) => {
              const subj = subjectMap[exam.subjectId];
              const daysLeft = getDaysRemaining(exam.date);
              const isUrgent = daysLeft >= 0 && daysLeft <= 2;

              return (
                <div
                  key={exam.id}
                  className="relative rounded-2xl border flex flex-col transition-colors"
                  style={{
                    backgroundColor: subj.softBgHex,
                    borderColor: subj.borderHex,
                  }}
                >
                  <FrameBlossom size="sm" accentHex={subj.accentHex} />
                  <div className="rounded-[15px] overflow-hidden flex-1 flex flex-col">
                    <div
                      className="h-1.5 w-full shrink-0"
                      style={{
                        background: `linear-gradient(to left, ${subj.accentHex}66, #EAA8C5, #F3D79B)`,
                      }}
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-sm font-extrabold mb-1.5">
                        <span style={{ color: subj.accentHex }}>{subj.title}</span>
                        <span
                          className={`tabular-nums ${
                            isUrgent
                              ? 'text-[#B91C1C]'
                              : daysLeft < 0
                                ? 'text-[#6B546E]'
                                : 'text-[#432F46]'
                          }`}
                        >
                          {formatCountdownLabel(daysLeft)} · {formatArabicDate(exam.date)}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#2D1B2E] leading-snug">
                        {exam.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-black/5">
                      <button
                        type="button"
                        onClick={() => openNewSlotForm(exam.subjectId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#F2D7E5] text-sm font-bold text-[#2D1B2E] hover:border-[#DB2777] hover:text-[#DB2777] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>أضيفي مراجعة</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditExamForm(exam)}
                          aria-label={`تعديل موعد ${exam.title}`}
                          className="p-2 rounded-lg text-[#432F46] hover:bg-white hover:text-[#DB2777] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExam(exam.id)}
                          aria-label={`حذف موعد ${exam.title}`}
                          className="p-2 rounded-lg text-[#432F46] hover:bg-white hover:text-[#DC2626] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Part 2: Daily Revision Schedule (Full Student Control) */}
      <div className="pt-5 border-t border-[#F7E8F0] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#6D28D9] shrink-0" />
              <h3 className="text-lg font-extrabold text-[#2D1B2E]">
                برنامج مراجعتكِ اليوم
              </h3>
            </div>
            <span className="text-sm sm:text-base font-bold text-[#432F46] tabular-nums">
              {completedTodayCount} / {planner.slots.length} منجزة · المجموع {totalPlannedMinutes} دق
            </span>
          </div>

          {completedTodayCount > 0 && (
            <button
              type="button"
              onClick={handleResetTodayChecks}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF8FB] border border-[#F2D7E5] text-sm font-bold text-[#432F46] hover:text-[#DB2777] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بداية يوم جديد</span>
            </button>
          )}
        </div>

        {/* Add / Edit Slot Inline Form */}
        {showSlotForm && (
          <form
            onSubmit={handleSaveSlot}
            className="bg-[#F5F3FF]/70 border border-[#DDD6FE] rounded-2xl p-4 sm:p-5 space-y-4"
          >
            <div className="text-base font-extrabold text-[#2D1B2E]">
              {editingSlotId ? 'تعديل حصّة المراجعة' : 'إضافة حصّة مراجعة جديدة لجدولكِ'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  المادة
                </label>
                <select
                  value={slotSubjectId}
                  onChange={(e) => setSlotSubjectId(e.target.value as SubjectId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-base font-bold text-[#2D1B2E] focus:outline-none focus:border-[#6D28D9]"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  وقت البداية
                </label>
                <input
                  type="time"
                  value={slotStartTime}
                  onChange={(e) => setSlotStartTime(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-base font-bold text-[#2D1B2E] tabular-nums focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  المدّة (بالدقائق)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-base font-bold text-[#2D1B2E] tabular-nums focus:outline-none focus:border-[#6D28D9]"
                >
                  <option value={15}>15 دقيقة</option>
                  <option value={20}>20 دقيقة</option>
                  <option value={25}>25 دقيقة</option>
                  <option value={30}>30 دقيقة</option>
                  <option value={45}>45 دقيقة</option>
                  <option value={60}>60 دقيقة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                  نوع النشاط
                </label>
                <select
                  value={slotTrack}
                  onChange={(e) =>
                    setSlotTrack(e.target.value as DailyRevisionSlot['track'])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-base font-bold text-[#2D1B2E] focus:outline-none focus:border-[#6D28D9]"
                >
                  <option value="lessons">مراجعة درس</option>
                  <option value="activities">أنشطة تفاعليّة</option>
                  <option value="exams">تمارين وامتحانات</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#432F46] mb-1.5">
                هدف الحصّة (اختياري)
              </label>
              <input
                type="text"
                value={slotGoal}
                onChange={(e) => setSlotGoal(e.target.value)}
                placeholder="مثال: حلّ 5 تمارين في الكسور أو مراجعة درس الكهرباء"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-base font-semibold text-[#2D1B2E] placeholder:text-[#6B546E] focus:outline-none focus:border-[#6D28D9]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#6D28D9] text-white text-sm sm:text-base font-bold hover:bg-[#5B21B6] transition-colors cursor-pointer"
              >
                {editingSlotId ? 'حفظ التعديلات' : 'إضافة إلى جدولي'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSlotForm(false);
                  setEditingSlotId(null);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#DDD6FE] text-sm sm:text-base font-bold text-[#432F46] hover:bg-[#F5F3FF] transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}

        {/* Daily Revision Slots List */}
        {planner.slots.length === 0 ? (
          <div className="bg-[#FFF8FB] border border-[#F2D7E5] rounded-2xl p-6 text-center space-y-3">
            <p className="text-base font-semibold text-[#432F46]">
              جدول اليوم فارغ حالياً. يمكنكِ إضافة حصّة مراجعة بنفسكِ أو ترتيبه تلقائياً حسب امتحاناتكِ.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => openNewSlotForm()}
                className="px-4 py-2 rounded-xl bg-[#DB2777] text-white text-sm font-bold cursor-pointer"
              >
                إضافة حصّة الآن
              </button>
            </div>
          </div>
        ) : (
          <div className="relative border border-[#EDE0E6] rounded-2xl bg-white">
            <FrameBlossom size="md" />
            <div className="rounded-[15px] overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-l from-[#CEBAF0] via-[#EAA8C5] to-[#F3D79B]" />
              <div className="divide-y divide-[#F7E8F0]">
              {planner.slots.map((slot, index) => {
              const subj = subjectMap[slot.subjectId];
              const isDoneToday = slot.completedDate === todayIso;
              const linkedExam = nearestExamBySubject[slot.subjectId];

              return (
                <motion.div
                  key={slot.id}
                  layout
                  transition={{ duration: 0.18 }}
                  className={`px-3 py-3 sm:px-4 sm:py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-colors ${
                    isDoneToday ? 'bg-[#ECFDF5]/60' : 'hover:bg-[#FFF9FC]'
                  }`}
                >
                  <div className="flex items-stretch gap-3 min-w-0 flex-1">
                    {/* Rightmost Compact Check + Time Column */}
                    <div className="flex items-center gap-2 shrink-0 w-fit">
                      <button
                        type="button"
                        onClick={() => handleToggleSlotDone(slot.id)}
                        aria-label={
                          isDoneToday
                            ? `إلغاء إنجاز حصّة ${subj.title}`
                            : `تحديد حصّة ${subj.title} كمنجزة`
                        }
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isDoneToday
                            ? 'bg-[#059669] border-[#059669] text-white'
                            : 'bg-white border-[#D9AFC7] text-transparent hover:border-[#DB2777]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="shrink-0 leading-tight whitespace-nowrap text-right">
                        <div className="text-sm font-extrabold text-[#2D1B2E] tabular-nums">
                          {slot.startTime}
                        </div>
                        <div className="text-xs font-bold text-[#432F46] tabular-nums">
                          {slot.durationMinutes} دق
                        </div>
                      </div>
                    </div>

                    {/* Light Vertical Column Divider */}
                    <div
                      aria-hidden="true"
                      className="self-stretch w-px bg-[#E5BFD4] shrink-0"
                    />

                    {/* Subject & Revision Goal */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold mb-0.5">
                        <span style={{ color: subj.accentHex }}>{subj.title}</span>
                        <span className="text-[#9E88A1]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[#432F46]">
                          {TRACK_LABELS[slot.track]}
                        </span>
                        {linkedExam && (
                          <>
                            <span className="text-[#9E88A1]" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-[#DB2777]">
                              امتحانها {formatCountdownLabel(linkedExam.days)}
                            </span>
                          </>
                        )}
                      </div>

                      <p
                        className={`text-base sm:text-lg font-extrabold leading-snug ${
                          isDoneToday
                            ? 'line-through text-[#6B546E]'
                            : 'text-[#2D1B2E]'
                        }`}
                      >
                        {slot.goal}
                      </p>
                    </div>
                  </div>

                  {/* Row Controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenSubjectTrack(slot.subjectId, slot.track)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm sm:text-base font-bold text-white transition-opacity hover:opacity-95 whitespace-nowrap shrink-0 cursor-pointer"
                      style={{ backgroundColor: subj.accentHex }}
                    >
                      <RoseEmblem variant="light" size={19} />
                      <span>ابدئي المراجعة</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="inline-flex items-center border border-[#F2D7E5] rounded-xl bg-white p-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSlot(index, -1)}
                        disabled={index === 0}
                        aria-label="تقديم الحصّة للأعلى"
                        className="p-2 rounded-lg text-[#432F46] hover:bg-[#FDF2F8] hover:text-[#DB2777] disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSlot(index, 1)}
                        disabled={index === planner.slots.length - 1}
                        aria-label="تأخير الحصّة للأسفل"
                        className="p-2 rounded-lg text-[#432F46] hover:bg-[#FDF2F8] hover:text-[#DB2777] disabled:opacity-35 disabled:pointer-events-none cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditSlotForm(slot)}
                        aria-label={`تعديل حصّة ${subj.title}`}
                        className="p-2 rounded-lg text-[#432F46] hover:bg-[#FDF2F8] hover:text-[#6D28D9] cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(slot.id)}
                        aria-label={`حذف حصّة ${subj.title}`}
                        className="p-2 rounded-lg text-[#432F46] hover:bg-[#FDF2F8] hover:text-[#DC2626] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
