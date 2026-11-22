import { Lesson, Subject, UnitKind } from '../types/education';
import { SUBJECT_METAS, TOPIC_BLUEPRINTS } from './curriculum_topics';
import { generateExercisesForUnit } from './exercise_generators';

function buildUnitsForSubject(subjectId: Subject['id'], kind: UnitKind): Lesson[] {
  const blueprints = TOPIC_BLUEPRINTS.filter((bp) => bp.subjectId === subjectId);
  return blueprints.map((bp, idx) => {
    const title =
      kind === 'lesson'
        ? bp.lessonTitle
        : kind === 'activity'
          ? bp.activityTitle
          : bp.examTitle;

    return {
      id: `${subjectId}-${kind}-${bp.topicIndex + 1}`,
      subjectId,
      kind,
      unitNumber: idx + 1,
      title,
      term: bp.term,
      durationMinutes: kind === 'exam' ? 12 : kind === 'activity' ? 7 : 8,
      summaryTitle: bp.summaryTitle,
      summaryPoints: bp.summaryPoints,
      exercises: generateExercisesForUnit(subjectId, bp.topicIndex, kind),
    };
  });
}

export const SUBJECTS: Subject[] = SUBJECT_METAS.map((meta) => ({
  ...meta,
  lessons: [
    ...buildUnitsForSubject(meta.id, 'lesson'),
    ...buildUnitsForSubject(meta.id, 'activity'),
    ...buildUnitsForSubject(meta.id, 'exam'),
  ],
}));

export const ALL_LESSONS: Lesson[] = SUBJECTS.flatMap((s) =>
  s.lessons.filter((l) => l.kind === 'lesson')
);

export const ALL_ACTIVITIES: Lesson[] = SUBJECTS.flatMap((s) =>
  s.lessons.filter((l) => l.kind === 'activity')
);

export const ALL_EXAMS: Lesson[] = SUBJECTS.flatMap((s) =>
  s.lessons.filter((l) => l.kind === 'exam')
);

export const CURRICULUM_STATS = {
  lessonsCount: ALL_LESSONS.length,
  activitiesCount: ALL_ACTIVITIES.length,
  examsCount: ALL_EXAMS.length,
  totalUnits: ALL_LESSONS.length + ALL_ACTIVITIES.length + ALL_EXAMS.length,
  totalExercises: SUBJECTS.reduce(
    (sum, s) => sum + s.lessons.reduce((lSum, l) => lSum + l.exercises.length, 0),
    0
  ),
};
