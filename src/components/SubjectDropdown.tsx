import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  ChevronDown,
  FlaskConical,
  Globe2,
  Languages,
  Landmark,
  Palette,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SUBJECTS } from '../data/curriculum';
import { StudentProgress, SubjectId } from '../types/education';
import { RoseEmblem } from './RoseEmblem';

interface SubjectDropdownProps {
  progress: StudentProgress;
  onSelectSubject: (subjectId: SubjectId) => void;
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

export const SubjectDropdown: React.FC<SubjectDropdownProps> = ({
  progress,
  onSelectSubject,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-l from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white text-base font-extrabold shadow-md shadow-[#7C3AED]/25 hover:brightness-105 transition-all whitespace-nowrap shrink-0 cursor-pointer"
      >
        <RoseEmblem variant="light" size={22} />
        <span>اختاري المادة</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            aria-label="قائمة المواد الدراسية"
            className="absolute right-0 mt-2 w-72 sm:w-80 bg-gradient-to-b from-[#FAF5FF] to-white border border-[#DDD6FE] rounded-2xl shadow-xl shadow-[#7C3AED]/15 p-2 z-40"
          >
            <div className="px-2.5 py-1 mb-1 border-b border-[#EDE9FE] flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#5B21B6]">
                اختاري مادتكِ للانطلاق
              </span>
              <span className="text-sm font-bold text-[#7C3AED]">7 مواد</span>
            </div>

            <div className="space-y-0.5 max-h-[260px] overflow-y-auto pl-0.5">
              {SUBJECTS.map((subj) => {
                const Icon = getSubjectIcon(subj.id);
                const doneCount = subj.lessons.filter((l) =>
                  Boolean(progress.completedLessons[l.id])
                ).length;

                return (
                  <button
                    key={subj.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      onSelectSubject(subj.id);
                    }}
                    className="w-full flex items-center justify-between gap-2.5 px-2.5 py-1.5 rounded-xl text-right hover:bg-[#EDE9FE]/75 transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: subj.softBgHex,
                          color: subj.accentHex,
                          borderColor: subj.borderHex,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm sm:text-[15px] font-extrabold text-[#2D1B2E] group-hover:text-[#6D28D9] truncate">
                        {subj.title}
                      </span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 shrink-0">
                      <span className="text-sm font-bold text-[#5B21B6] tabular-nums">
                        {doneCount}/{subj.lessons.length}
                      </span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#7C3AED] opacity-60 group-hover:opacity-100 group-hover:-translate-x-0.5 transition-all" />
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
