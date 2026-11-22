import React, { useState } from 'react';
import { Award, Check, Flame, Lock, Pencil, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { BADGES, getCurrentRank } from '../data/rewards';
import { SUBJECTS } from '../data/curriculum';
import { StudentProgress } from '../types/education';
import { BadgeEmblem } from './BadgeEmblem';
import { FrameBlossom } from './FrameBlossom';
import { SafeImage } from './SafeImage';

interface RewardsAlbumProps {
  progress: StudentProgress;
  onUpdateProfile: (name: string) => void;
}

const CYRINE_AVATAR_SRC = '/src/assets/images/cyrine_hero_avatar.jpg';

export const RewardsAlbum: React.FC<RewardsAlbumProps> = ({ progress, onUpdateProfile }) => {
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(progress.studentName);
  const rank = getCurrentRank(progress.totalStars);

  const nextTarget = rank.nextStars ?? 500;
  const pctToNext = rank.nextStars
    ? Math.min(100, Math.round(((progress.totalStars - rank.minStars) / (nextTarget - rank.minStars)) * 100))
    : 100;

  const saveName = () => {
    const cleaned = draftName.trim();
    if (cleaned.length > 0) {
      onUpdateProfile(cleaned);
    }
    setEditingName(false);
  };

  return (
    <section id="rewards-album" className="w-full">
      {/* Rank & Profile Showcase Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-stretch">
        {/* Profile & Rank Progress */}
        <div
          style={
            {
              '--rim-from': '#EAA8C5',
              '--rim-mid': '#F1BAD3',
              '--rim-to': '#F3D79B',
            } as React.CSSProperties
          }
          className="relative lg:col-span-7 srayna-top-frame rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
        >
          <FrameBlossom size="md" />
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#FBCFE8] bg-[#FDF2F8] shrink-0 shadow-xs">
                  <SafeImage
                    src={CYRINE_AVATAR_SRC}
                    alt={progress.studentName}
                    fallbackLabel={progress.studentName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#DB2777] mb-0.5">
                    ملف التلميذة · السنة الخامسة ابتدائي
                  </div>
                  {editingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveName();
                        }}
                        maxLength={24}
                        className="px-3 py-1.5 rounded-lg border border-[#DB2777] text-base font-bold text-[#2D1B2E] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={saveName}
                        className="p-2 rounded-lg bg-[#DB2777] text-white cursor-pointer"
                        aria-label="حفظ الاسم"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D1B2E]">
                        {progress.studentName}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftName(progress.studentName);
                          setEditingName(true);
                        }}
                        className="p-1.5 rounded-lg text-[#432F46] hover:text-[#DB2777] hover:bg-[#FDF2F8] transition-colors cursor-pointer"
                        aria-label="تعديل الاسم"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-sm font-bold text-[#9D174D]">
                <Sparkles className="w-4 h-4 text-[#DB2777]" />
                <span>{rank.title}</span>
              </span>
            </div>

            {/* Current Rank Progress */}
            <div className="p-5 rounded-xl bg-[#FFF9FB] border border-[#F0D9E4] mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 text-base">
                  <Award className="w-5 h-5 text-[#DB2777]" />
                  <span className="font-extrabold text-[#2D1B2E]">اللقب الحالي: {rank.title}</span>
                </div>
                <span className="text-base font-extrabold text-[#DB2777] tabular-nums">
                  {progress.totalStars} {rank.nextStars ? `/ ${rank.nextStars}` : ''} نجمة
                </span>
              </div>
              <div className="w-full h-3.5 bg-[#F4DCE6] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-l from-[#EC4899] to-[#DB2777] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(pctToNext, 6)}%` }}
                />
              </div>
              <p className="text-base font-semibold text-[#432F46] leading-relaxed">
                {rank.encouragement}
              </p>
            </div>
          </div>

          {/* Per-Subject Progress Bars */}
          <div id="my-progress">
            <h3 className="text-lg font-extrabold text-[#2D1B2E] mb-3.5">
              تقدّمكِ حسب المواد الدراسية
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {SUBJECTS.map((subj) => {
                const doneCount = subj.lessons.filter(
                  (l) => Boolean(progress.completedLessons[l.id])
                ).length;
                const pct = Math.round((doneCount / subj.lessons.length) * 100);
                return (
                  <div key={subj.id}>
                    <div className="flex items-center justify-between text-sm font-bold mb-1.5">
                      <span className="text-[#2D1B2E] truncate max-w-[180px]">{subj.title}</span>
                      <span className="text-[#432F46] tabular-nums">
                        {doneCount}/{subj.lessons.length} وحدة
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F4DCE6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: subj.accentHex,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rewards Illustration Card */}
        <div className="relative lg:col-span-5 bg-white border border-[#EDE0E6] rounded-2xl flex flex-col">
          <FrameBlossom size="md" />
          <div className="rounded-[15px] overflow-hidden flex-1 flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-l from-[#EAA8C5] via-[#D4BFF2] to-[#F3D79B] shrink-0" />
            <div className="h-56 sm:h-64 lg:h-full relative bg-[#FDF2F8]">
              <SafeImage
                src="/src/assets/images/reward_trophy_crown_1795361309988.jpg"
                alt="ألبوم الأوسمة والمكافآت في منصة سريّنة"
                fallbackLabel="ألبوم أوسمة سريّنة"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D1B2E]/90 via-[#2D1B2E]/55 to-transparent p-6 text-white">
                <div className="flex items-center gap-4 text-base font-bold tabular-nums">
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-current text-[#FDE047]" />
                    {progress.totalStars} نجمة
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#FB923C]" />
                    {progress.streakDays} أيام مواظبة
                  </span>
                </div>
                <p className="text-base sm:text-lg font-extrabold mt-1.5 leading-snug">
                  اجمعي الأوسمة الثمانية لتتألّقي بلقب عبقريّة قرطاج!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collectible Girly Badges Grid */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
          <div>
            <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#2D1B2E] mb-1">
              ألبوم الأوسمة والميداليات الجميلة
            </h3>
            <p className="text-base font-semibold text-[#432F46]">
              أتمّي الدروس في مختلف المواد لفتح جميع الأوسمة المرصّعة بالجواهر.
            </p>
          </div>
          <div className="text-base font-extrabold text-[#DB2777] tabular-nums">
            الأوسمة المفتوحة: {progress.unlockedBadgeIds.length} / {BADGES.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge, index) => {
            const unlocked = progress.unlockedBadgeIds.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                style={
                  unlocked
                    ? ({
                        '--frame-surface': 'linear-gradient(to bottom, #FFFFFF, #FFF7FB)',
                        '--rim-from': `${badge.colorHex}66`,
                        '--rim-mid': '#EAA8C5',
                        '--rim-to': '#F3D79B',
                      } as React.CSSProperties)
                    : ({
                        '--frame-bg': '#FAF5F7',
                        '--rim-from': '#E2C9D6',
                        '--rim-mid': '#D8CEF2',
                        '--rim-to': '#F4E4BC',
                      } as React.CSSProperties)
                }
                className={`relative srayna-top-frame rounded-2xl p-5 transition-colors ${
                  unlocked ? 'shadow-xs' : ''
                }`}
              >
                <FrameBlossom
                  size="sm"
                  accentHex={unlocked ? badge.colorHex : undefined}
                />
                <div className="flex items-start justify-between gap-3 mb-3">
                  <BadgeEmblem
                    type={badge.emblemType}
                    colorHex={badge.colorHex}
                    unlocked={unlocked}
                    size={64}
                  />
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-extrabold ${
                      unlocked ? 'text-[#059669]' : 'text-[#5C475E]'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>مفتوح</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>مقفل</span>
                      </>
                    )}
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-[#2D1B2E] mb-1.5">{badge.title}</h4>
                <p className="text-sm sm:text-base font-semibold text-[#432F46] leading-relaxed mb-3">
                  {badge.description}
                </p>
                <div className="text-sm font-bold text-[#9D174D]">
                  الشرط: {badge.criteriaText}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
