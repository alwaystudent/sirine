import { Lesson, LessonResult, Subject, SubjectId } from '../types/education';

const OFFLINE_META_KEY = 'srayna_offline_vault_meta_v1';
const CACHE_NAME = 'srayna-offline-vault-v1';

const APP_ASSET_URLS = [
  '/src/assets/images/srayna_hero_study_1795361307506.jpg',
  '/src/assets/images/srayna_floral_bg_1795369349254.jpg',
  '/src/assets/images/cyrine_hero_avatar.jpg',
  '/src/assets/images/reward_trophy_crown_1795361309988.jpg',
  '/icon.svg',
  '/pwa-192x192.png',
];

export interface OfflineVaultState {
  downloadedSubjectIds: SubjectId[];
  browsedUnitIds: string[];
  lastUpdatedAt: string | null;
}

const DEFAULT_OFFLINE_STATE: OfflineVaultState = {
  downloadedSubjectIds: [],
  browsedUnitIds: [],
  lastUpdatedAt: null,
};

export function loadOfflineVaultState(): OfflineVaultState {
  try {
    const raw = localStorage.getItem(OFFLINE_META_KEY);
    if (!raw) return DEFAULT_OFFLINE_STATE;
    const parsed = JSON.parse(raw) as Partial<OfflineVaultState>;
    return {
      downloadedSubjectIds: Array.isArray(parsed.downloadedSubjectIds)
        ? parsed.downloadedSubjectIds
        : [],
      browsedUnitIds: Array.isArray(parsed.browsedUnitIds) ? parsed.browsedUnitIds : [],
      lastUpdatedAt: parsed.lastUpdatedAt ?? null,
    };
  } catch {
    return DEFAULT_OFFLINE_STATE;
  }
}

function saveOfflineVaultState(state: OfflineVaultState): void {
  try {
    localStorage.setItem(OFFLINE_META_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota limitations gracefully
  }
}

async function cacheMissingAppAssets(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    for (const url of APP_ASSET_URLS) {
      const existing = await cache.match(url);
      if (!existing) {
        try {
          await cache.add(url);
        } catch {
          // Ignore single asset fetch failures when already offline
        }
      }
    }
  } catch {
    // Cache API unavailable
  }
}

export async function cacheBrowsedUnit(
  unit: Lesson,
  currentState: OfflineVaultState
): Promise<OfflineVaultState> {
  const alreadyCached = currentState.browsedUnitIds.includes(unit.id);

  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cacheKey = `/offline-vault/unit-${unit.id}.json`;
      const hit = await cache.match(cacheKey);
      if (!hit) {
        const body = JSON.stringify(unit);
        await cache.put(
          cacheKey,
          new Response(body, {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          })
        );
      }
    } catch {
      // Ignore cache API failure
    }
  }

  if (alreadyCached) {
    return currentState;
  }

  const nextState: OfflineVaultState = {
    downloadedSubjectIds: currentState.downloadedSubjectIds,
    browsedUnitIds: [...currentState.browsedUnitIds, unit.id],
    lastUpdatedAt: new Date().toISOString(),
  };
  saveOfflineVaultState(nextState);
  return nextState;
}

export async function downloadSubjectForOffline(
  subject: Subject,
  currentState: OfflineVaultState
): Promise<OfflineVaultState> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const subjectKey = `/offline-vault/subject-${subject.id}.json`;
      await cache.put(
        subjectKey,
        new Response(JSON.stringify(subject), {
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        })
      );
      await cacheMissingAppAssets();
    } catch {
      // Continue updating metadata even if Cache API is restricted
    }
  }

  const nextSubjects = currentState.downloadedSubjectIds.includes(subject.id)
    ? currentState.downloadedSubjectIds
    : [...currentState.downloadedSubjectIds, subject.id];

  const mergedUnits = new Set(currentState.browsedUnitIds);
  for (const lesson of subject.lessons) {
    mergedUnits.add(lesson.id);
  }

  const nextState: OfflineVaultState = {
    downloadedSubjectIds: nextSubjects,
    browsedUnitIds: Array.from(mergedUnits),
    lastUpdatedAt: new Date().toISOString(),
  };
  saveOfflineVaultState(nextState);
  return nextState;
}

export async function downloadCompletedSubjectsForOffline(
  subjects: Subject[],
  completedLessons: Record<string, LessonResult>,
  currentState: OfflineVaultState
): Promise<{ state: OfflineVaultState; syncedCount: number }> {
  const completedSubjectIds = new Set(
    Object.values(completedLessons).map((item) => item.subjectId)
  );

  let nextState = currentState;
  let syncedCount = 0;

  for (const subj of subjects) {
    if (completedSubjectIds.has(subj.id)) {
      nextState = await downloadSubjectForOffline(subj, nextState);
      syncedCount += 1;
    }
  }

  // Always cache any browsed units in cache storage too without duplicate network calls
  await cacheMissingAppAssets();

  return { state: nextState, syncedCount };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportSubjectOfflinePack(
  subject: Subject,
  completedLessons: Record<string, LessonResult>
): void {
  const completedSet = new Set(Object.keys(completedLessons));
  const lessonsHtml = subject.lessons
    .map((unit) => {
      const isDone = completedSet.has(unit.id);
      const points = unit.summaryPoints
        .map((pt) => `<li>${escapeHtml(pt)}</li>`)
        .join('');
      return `
      <article class="card ${isDone ? 'done' : ''}">
        <div class="meta">
          <span>${escapeHtml(unit.term)} · الوحدة ${unit.unitNumber}</span>
          <span class="status">${isDone ? 'منجز ✓' : 'للمراجعة'}</span>
        </div>
        <h2>${escapeHtml(unit.title)}</h2>
        <h3>${escapeHtml(unit.summaryTitle)}</h3>
        <ul>${points}</ul>
      </article>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ملخّص ${escapeHtml(subject.title)} — سريّنة Srayna</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FFF7FA; color: #2D1B2E; margin: 0; padding: 24px; line-height: 1.7; }
    .wrap { max-width: 860px; margin: 0 auto; }
    header { background: #FFFFFF; border: 2px solid #FBCFE8; border-radius: 20px; padding: 24px; margin-bottom: 24px; }
    h1 { margin: 0 0 8px; color: #DB2777; font-size: 26px; }
    .sub { margin: 0; color: #432F46; font-weight: 700; }
    .card { background: #FFFFFF; border: 1px solid #F0D9E4; border-radius: 16px; padding: 18px 22px; margin-bottom: 14px; }
    .card.done { border-color: #10B981; background: #F0FDF4; }
    .meta { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #432F46; margin-bottom: 6px; }
    .status { color: #059669; }
    h2 { margin: 0 0 6px; font-size: 19px; color: #2D1B2E; }
    h3 { margin: 0 0 8px; font-size: 16px; color: #7C3AED; }
    ul { margin: 0; padding-right: 20px; }
    li { margin-bottom: 4px; font-size: 15px; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>سريّنة Srayna · ${escapeHtml(subject.title)}</h1>
      <p class="sub">نسخة محفوظة للدراسة دون إنترنت · السنة الخامسة ابتدائي (تونس 2026)</p>
    </header>
    ${lessonsHtml}
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `srayna-${subject.id}-offline.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
