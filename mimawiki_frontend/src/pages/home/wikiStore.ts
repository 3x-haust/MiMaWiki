import { initialArticles, type WikiArticle } from './articles';

export type TextPatch = {
  readonly start: number;
  readonly deleteCount: number;
  readonly insert: string;
};

export type WikiRevision = {
  readonly id: string;
  readonly articleSlug: string;
  readonly version: number;
  readonly editedAt: string;
  readonly editor: string;
  readonly patch: TextPatch;
};

export type DiscussionComment = {
  readonly id: string;
  readonly articleSlug: string;
  readonly author: string;
  readonly createdAt: string;
  readonly content: string;
};

export type StoredWikiState = {
  readonly revisions: Record<string, readonly WikiRevision[]>;
  readonly discussions: Record<string, readonly DiscussionComment[]>;
};

export type WikiSnapshot = WikiArticle & {
  readonly version: number;
};

export type RevisionFrame = {
  readonly revision: WikiRevision;
  readonly before: string;
  readonly after: string;
};

const STORAGE_KEY = 'mimawiki:wiki-state:v1';

const emptyState: StoredWikiState = {
  revisions: {},
  discussions: {},
};

const isRevision = (value: unknown): value is WikiRevision => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WikiRevision>;
  const patch = candidate.patch as Partial<TextPatch> | undefined;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.articleSlug === 'string' &&
    typeof candidate.version === 'number' &&
    typeof candidate.editedAt === 'string' &&
    typeof candidate.editor === 'string' &&
    typeof patch === 'object' &&
    patch !== null &&
    typeof patch.start === 'number' &&
    typeof patch.deleteCount === 'number' &&
    typeof patch.insert === 'string'
  );
};

const isComment = (value: unknown): value is DiscussionComment => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<DiscussionComment>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.articleSlug === 'string' &&
    typeof candidate.author === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.content === 'string'
  );
};

const readRecord = <T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): Record<string, readonly T[]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  const entries = Object.entries(value).flatMap(([key, items]) => {
    if (!Array.isArray(items)) {
      return [];
    }

    return [[key, items.filter(guard)] as const];
  });

  return Object.fromEntries(entries);
};

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export const loadWikiState = (): StoredWikiState => {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (rawState === null) {
      return emptyState;
    }

    const parsed = JSON.parse(rawState) as Partial<StoredWikiState>;
    return {
      revisions: readRecord(parsed.revisions, isRevision),
      discussions: readRecord(parsed.discussions, isComment),
    };
  } catch {
    return emptyState;
  }
};

export const saveWikiState = (state: StoredWikiState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const createTextPatch = (previous: string, next: string): TextPatch => {
  let start = 0;
  const shortestLength = Math.min(previous.length, next.length);

  while (start < shortestLength && previous[start] === next[start]) {
    start += 1;
  }

  let previousEnd = previous.length;
  let nextEnd = next.length;
  while (
    previousEnd > start &&
    nextEnd > start &&
    previous[previousEnd - 1] === next[nextEnd - 1]
  ) {
    previousEnd -= 1;
    nextEnd -= 1;
  }

  return {
    start,
    deleteCount: previousEnd - start,
    insert: next.slice(start, nextEnd),
  };
};

export const applyTextPatch = (content: string, patch: TextPatch) =>
  `${content.slice(0, patch.start)}${patch.insert}${content.slice(
    patch.start + patch.deleteCount,
  )}`;

export const buildSnapshots = (state: StoredWikiState): readonly WikiSnapshot[] =>
  initialArticles.map((article) => {
    const revisions = state.revisions[article.slug] ?? [];
    const content = revisions.reduce(
      (currentContent, revision) => applyTextPatch(currentContent, revision.patch),
      article.content,
    );
    const latestRevision =
      revisions.length > 0 ? revisions[revisions.length - 1] : undefined;

    return {
      ...article,
      content,
      updatedAt: latestRevision?.editedAt ?? article.updatedAt,
      editor: latestRevision?.editor ?? article.editor,
      version: revisions.length + 1,
    };
  });

export const createRevision = (
  article: WikiSnapshot,
  nextContent: string,
  editor: string,
): WikiRevision => ({
  id: createId(),
  articleSlug: article.slug,
  version: article.version + 1,
  editedAt: formatDateTime(new Date()),
  editor,
  patch: createTextPatch(article.content, nextContent),
});

export const createDiscussionComment = (
  articleSlug: string,
  author: string,
  content: string,
): DiscussionComment => ({
  id: createId(),
  articleSlug,
  author,
  createdAt: formatDateTime(new Date()),
  content,
});

export const buildRevisionFrames = (
  article: WikiArticle,
  revisions: readonly WikiRevision[],
): readonly RevisionFrame[] => {
  let currentContent = article.content;

  return revisions.map((revision) => {
    const before = currentContent;
    const after = applyTextPatch(before, revision.patch);
    currentContent = after;

    return {
      revision,
      before,
      after,
    };
  });
};

export const summarizePatch = (patch: TextPatch) =>
  `-${patch.deleteCount}자 / +${patch.insert.length}자`;

export const getChangedText = (frame: RevisionFrame) => ({
  removed: frame.before.slice(
    frame.revision.patch.start,
    frame.revision.patch.start + frame.revision.patch.deleteCount,
  ),
  added: frame.revision.patch.insert,
});
