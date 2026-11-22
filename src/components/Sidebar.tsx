import React from 'react';
import {
  Award,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Flower2,
  FlaskConical,
  Globe2,
  Home,
  Languages,
  Landmark,
  Palette,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { CURRICULUM_STATS, SUBJECTS } from '../data/curriculum';
import { getCurrentRank } from '../data/rewards';
import { AppSection, StudentProgress, SubjectId } from '../types/education';
import { SafeImage } from './SafeImage';

interface SidebarProps {
  activeSection: AppSection;
  selectedSubjectId: SubjectId | null;
  progress: StudentProgress;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onSelectSection: (section: AppSection, subjectId?: SubjectId | null) => void;
}

const CYRINE_AVATAR_SRC = '/src/assets/images/cyrine_hero_avatar.jpg';

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

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  selectedSubjectId,
  progress,
  mobileOpen,
  onCloseMobile,
  onSelectSection,
}) => {
  const rank = getCurrentRank(progress.totalStars);

  const mainNav: {
    id: AppSection;
    label: string;
    countLabel?: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    {
      id: 'lessons',
      label: 'الدروس الرسميّة',
      countLabel: String(CURRICULUM_STATS.lessonsCount),
      icon: BookOpen,
    },
    {
      id: 'activities',
      label: 'الأنشطة والمختبر',
      countLabel: String(CURRICULUM_STATS.activitiesCount),
      icon: Sparkles,
    },
    {
      id: 'exams',
      label: 'الامتحانات والاختبارات',
      countLabel: String(CURRICULUM_STATS.examsCount),
      icon: ClipboardCheck,
    },
    { id: 'rewards', label: 'ألبوم الأوسمة والتقدّم', icon: Award },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gradient-to-b from-white/95 via-[#FFF7FB]/95 to-[#F7F2FF]/95 backdrop-blur-sm border-l border-[#F2D7E5]">
      {/* Brand Header */}
      <div className="px-5 h-[68px] border-b border-[#F5E1EC] flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            onSelectSection('home', null);
            onCloseMobile();
          }}
          className="inline-flex items-center gap-2 text-lg font-extrabold text-[#2D1B2E] cursor-pointer whitespace-nowrap"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FDF2F8] to-[#F5F3FF] border border-[#FBCFE8] flex items-center justify-center text-[#DB2777]">
            <Flower2 className="w-4 h-4" />
          </span>
          <span>سريّنة</span>
          <span className="font-latin text-[#DB2777]">Srayna</span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-lg text-[#432F46] hover:bg-[#FDF2F8] cursor-pointer"
          aria-label="إغلاق القائمة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Student Profile Mini-Card */}
      <div className="p-4 border-b border-[#F5E1EC]">
        <button
          type="button"
          onClick={() => {
            onSelectSection('rewards', null);
            onCloseMobile();
          }}
          className="w-full p-3 rounded-2xl bg-gradient-to-l from-[#FDF2F8] to-[#F8F5FF] border border-[#F3D5E3] flex items-center gap-3 text-right hover:border-[#DB2777] transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white shadow-xs shrink-0">
            <SafeImage
              src={CYRINE_AVATAR_SRC}
              alt={progress.studentName}
              fallbackLabel={progress.studentName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base font-extrabold text-[#2D1B2E] truncate">
              {progress.studentName}
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#432F46] tabular-nums">
              <span className="text-[#B45309]">{rank.title}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-0.5 text-[#DB2777]">
                <Star className="w-3.5 h-3.5 fill-current" />
                {progress.totalStars}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Sections */}
        <div>
          <div className="px-3 mb-2 text-sm font-extrabold text-[#432F46]">
            الأقسام الرئيسية
          </div>
          <nav aria-label="الأقسام الرئيسية" className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeSection === item.id &&
                (item.id === 'home' || item.id === 'rewards' || selectedSubjectId === null);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id, null);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-sm sm:text-[15px] font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#DB2777] text-white shadow-xs'
                      : 'text-[#3A273C] hover:bg-[#FDF2F8] hover:text-[#DB2777]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.countLabel && (
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isActive ? 'text-white/95' : 'text-[#5C475E]'
                      }`}
                    >
                      {item.countLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Subject Links */}
        <div>
          <div className="px-3 mb-2 text-sm font-extrabold text-[#432F46]">
            المواد الدراسيّة (السنة 5)
          </div>
          <div className="space-y-1">
            {SUBJECTS.map((subj) => {
              const Icon = getSubjectIcon(subj.id);
              const isSelected = selectedSubjectId === subj.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => {
                    const targetSection =
                      activeSection === 'activities' || activeSection === 'exams'
                        ? activeSection
                        : 'lessons';
                    onSelectSection(targetSection, subj.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm sm:text-[15px] font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FDF2F8] text-[#9D174D] border border-[#FBCFE8]'
                      : 'text-[#432F46] hover:bg-[#FFF8FB] hover:text-[#2D1B2E]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 truncate">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: subj.softBgHex,
                        color: subj.accentHex,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="truncate">{subj.title}</span>
                  </span>
                  <span className="text-sm font-bold text-[#5C475E] tabular-nums">
                    {subj.lessons.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop + Panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#2D1B2E]/35 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
