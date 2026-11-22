import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileDown,
  FlaskConical,
  Globe2,
  HardDrive,
  Home,
  Languages,
  Landmark,
  Palette,
  Search,
  Sparkles,
} from 'lucide-react';
import { SUBJECTS } from '../data/curriculum';
import {
  Lesson,
  StudentProgress,
  Subject,
  SubjectId,
  TermFilter,
  UnitKind,
} from '../types/education';
import { OfflineVaultState } from '../utils/offlineStorage';
import { FrameBlossom } from './FrameBlossom';
import { RoseEmblem } from './RoseEmblem';

interface SubjectBrowserProps {
  mode: UnitKind;
  progress: StudentProgress;
  offlineVault: OfflineVaultState;
  selectedTerm: TermFilter;
  onSelectTerm: (term: TermFilter) => void;
  selectedSubjectId: SubjectId | null;
  onSelectSubject: (subjectId: SubjectId | null) => void;
  onStartLesson: (subject: Subject, lesson: Lesson) => void;
  onDownloadSubject: (subject: Subject) => void;
  onDownloadUnit: (unit: Lesson) => void;
  onExportSubjectPack: (subject: Subject) => void;
  onGoHome: () => void;
}

export const TERM_FILTERS: TermFilter[] = [
  'الثلاثي الأول',
  'الثلاثي الثاني',
  'الثلاثي الثالث',
  'الكل',
];

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

const MODE_META: Record<
  UnitKind,
  { heading: string; kicker: string; cta: string; icon: React.FC<{ className?: string }> }
> = {
  lesson: {
    heading: 'مكتبة الدروس الرسميّة (105 درساً)',
    kicker: 'السنة الخامسة ابتدائي · البرنامج الرسمي التونسي 2026',
    cta: 'ابدئي الدرس',
    icon: BookOpen,
  },
  activity: {
    heading: 'بنك الأنشطة التفاعلية (105 نشاطاً)',
    kicker: 'سحب وإفلات · مطابقة · ملء الفراغات · ترتيب',
    cta: 'ابدئي النشاط',
    icon: Sparkles,
  },
  exam: {
    heading: 'الامتحانات والاختبارات التقييمية (105 اختباراً)',
    kicker: 'فروض مراقبة · فروض تأليفية · امتحانات نهاية السنة',
    cta: 'ابدئي الاختبار',
    icon: ClipboardCheck,
  },
};

export const SubjectBrowser: React.FC<SubjectBrowserProps> = ({
  mode,
  progress,
  offlineVault,
  selectedTerm,
  onSelectTerm,
  selectedSubjectId,
  onSelectSubject,
  onStartLesson,
  onDownloadSubject,
  onDownloadUnit,
  onExportSubjectPack,
  onGoHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const meta = MODE_META[mode];

  const subjectMap = useMemo(() => {
    const map: Record<string, Subject> = {};
    for (const s of SUBJECTS) map[s.id] = s;
    return map;
  }, []);

  const filteredUnits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SUBJECTS.filter((s) => !selectedSubjectId || s.id === selectedSubjectId)
      .flatMap((s) => s.lessons)
      .filter((unit) => unit.kind === mode)
      .filter((unit) => selectedTerm === 'الكل' || unit.term === selectedTerm)
      .filter((unit) => {
        if (!q) return true;
        return (
          unit.title.toLowerCase().includes(q) ||
          unit.summaryTitle.toLowerCase().includes(q) ||
          subjectMap[unit.subjectId].title.toLowerCase().includes(q)
        );
      });
  }, [mode, selectedSubjectId, selectedTerm, searchQuery, subjectMap]);

  const activeSubject = selectedSubjectId ? subjectMap[selectedSubjectId] : null;
  const activeSubjectSaved = activeSubject
    ? offlineVault.downloadedSubjectIds.includes(activeSubject.id)
    : false;
  const completedCount = filteredUnits.filter((u) =>
    Boolean(progress.completedLessons[u.id])
  ).length;

  return (
    <section id="subjects-section" className="space-y-6">
      {/* Header + Offline Actions + Home Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-base font-bold text-[#DB2777] mb-1">{meta.kicker}</p>
          <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#2D1B2E] leading-snug">
            {activeSubject ? `${activeSubject.title} · ${meta.heading}` : meta.heading}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeSubject && (
            <>
              <button
                type="button"
                onClick={() => onDownloadSubject(activeSubject)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeSubjectSaved
                    ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                    : 'bg-[#F5F3FF] border-[#DDD6FE] text-[#6D28D9] hover:bg-[#EDE9FE]'
                }`}
              >
                {activeSubjectSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>محفوظة دون نت</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>تحميل المادة دون نت</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onExportSubjectPack(activeSubject)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#F2D7E5] text-sm sm:text-base font-bold text-[#432F46] hover:bg-[#FDF2F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="تنزيل كتيّب ملخّص المادة بصيغة HTML للقراءة دون إنترنت"
              >
                <FileDown className="w-4 h-4 text-[#DB2777]" />
                <span>تنزيل ملخّص</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#F2D7E5] text-base font-bold text-[#DB2777] hover:bg-[#FDF2F8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RoseEmblem variant="pink" size={21} />
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Subject Chips + Term Switcher + Search */}
      <div
        style={
          {
            '--rim-from': '#EAA8C5',
            '--rim-mid': '#D4BFF2',
            '--rim-to': '#F3D79B',
          } as React.CSSProperties
        }
        className="relative srayna-top-frame rounded-2xl p-4 sm:p-5 space-y-4"
      >
        <FrameBlossom size="md" />
        {/* Subject Selector Row */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectSubject(null)}
            className={`px-3.5 py-2 rounded-xl border text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedSubjectId === null
                ? 'bg-[#DB2777] border-[#DB2777] text-white'
                : 'bg-[#FFF8FB] border-[#F2D7E5] text-[#432F46] hover:text-[#2D1B2E]'
            }`}
          >
            كل المواد (7)
          </button>

          {SUBJECTS.map((subj) => {
            const Icon = getSubjectIcon(subj.id);
            const active = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => onSelectSubject(subj.id)}
                style={
                  active
                    ? {
                        backgroundColor: subj.accentHex,
                        borderColor: subj.accentHex,
                        color: '#FFFFFF',
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm sm:text-base font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? ''
                    : 'bg-white border-[#F2D7E5] text-[#3A273C] hover:bg-[#FDF2F8]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{subj.title}</span>
              </button>
            );
          })}
        </div>

        {/* Term & Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-3 border-t border-[#F7E8F0]">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#FBF2F6] border border-[#F2D7E5] rounded-xl">
            {TERM_FILTERS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectTerm(term)}
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

          <div className="flex items-center gap-3 flex-1 md:max-w-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5C475E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي عن عنوان الدرس أو المادة..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-[#F2D7E5] bg-[#FFF8FB] text-base font-semibold text-[#2D1B2E] placeholder:text-[#6B546E] focus:outline-none focus:border-[#DB2777]"
              />
            </div>
            <span className="text-sm sm:text-base font-bold text-[#432F46] tabular-nums whitespace-nowrap shrink-0">
              {completedCount}/{filteredUnits.length} منجز
            </span>
          </div>
        </div>
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white border border-[#F2D7E5] rounded-2xl p-10 text-center">
          <p className="text-lg font-extrabold text-[#2D1B2E] mb-2">
            لا توجد وحدات مطابقة لبحثكِ حالياً
          </p>
          <p className="text-base font-semibold text-[#432F46] mb-4">
            جرّبي مسح عبارة البحث أو اختيار «كل الثلاثيات».
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              onSelectTerm('الكل');
              onSelectSubject(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#DB2777] text-white text-base font-bold cursor-pointer"
          >
            عرض جميع الوحدات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => {
            const subj = subjectMap[unit.subjectId];
            const Icon = getSubjectIcon(subj.id);
            const result = progress.completedLessons[unit.id];
            const isCachedOffline =
              Boolean(result) ||
              offlineVault.downloadedSubjectIds.includes(subj.id) ||
              offlineVault.browsedUnitIds.includes(unit.id);

            return (
              <div
                key={unit.id}
                className="relative bg-white border border-[#EDE0E6] rounded-2xl flex flex-col justify-between hover:border-[#E6B8CD] transition-colors"
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
                    className="px-5 py-3.5 border-b flex items-center justify-between gap-2"
                  style={{
                    backgroundColor: subj.softBgHex,
                    borderColor: subj.borderHex,
                  }}
                >
                  <div className="inline-flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: subj.accentHex }} />
                    <span
                      className="text-sm sm:text-base font-extrabold truncate"
                      style={{ color: subj.accentHex }}
                    >
                      {subj.title}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#432F46] tabular-nums whitespace-nowrap shrink-0">
                    {unit.term} · {String(unit.unitNumber).padStart(2, '0')}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#2D1B2E] leading-snug mb-2">
                      {unit.title}
                    </h3>
                    <p className="text-base font-semibold text-[#432F46] leading-relaxed line-clamp-2">
                      {unit.summaryPoints[0]}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#F7E8F0]">
                    <div className="flex items-center justify-between gap-2">
                      {result ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#059669] tabular-nums">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            مكتمل ({result.bestScore}/{result.totalQuestions})
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#432F46] tabular-nums">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>
                            {unit.exercises.length} تمارين · {unit.durationMinutes} دق
                          </span>
                        </span>
                      )}

                      {isCachedOffline ? (
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#059669] whitespace-nowrap shrink-0">
                          <HardDrive className="w-4 h-4 shrink-0" />
                          <span>متاح دون نت</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDownloadUnit(unit)}
                          className="inline-flex items-center gap-1 text-sm font-bold text-[#6D28D9] hover:text-[#5B21B6] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Download className="w-4 h-4 shrink-0" />
                          <span>حفظ دون نت</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartLesson(subj, unit)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-base font-bold text-white transition-opacity hover:opacity-95 whitespace-nowrap cursor-pointer"
                      style={{ backgroundColor: subj.accentHex }}
                    >
                      <RoseEmblem variant="light" size={21} />
                      <span>{result ? 'مراجعة' : meta.cta}</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
