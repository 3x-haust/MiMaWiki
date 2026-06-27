import type { WikiArticle } from './articles';
import type {
  DiscussionComment,
  StoredWikiState,
  TextPatch,
  WikiAttachment,
  WikiRedirect,
  WikiRevision,
  WikiTemplate,
} from './wikiStore';

const STORAGE_KEY = 'mimawiki:wiki-state:v1';

const emptyState: StoredWikiState = {
  revisions: {},
  discussions: {},
  createdArticles: [],
  likedSlugs: [],
  redirects: {},
  templates: [],
  attachments: [],
  protectedSlugs: [],
  deletedSlugs: [],
  watchlistSlugs: [],
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

const isArticle = (value: unknown): value is WikiArticle => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WikiArticle>;
  return (
    typeof candidate.slug === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.updatedAt === 'string' &&
    typeof candidate.editor === 'string' &&
    typeof candidate.summary === 'string' &&
    typeof candidate.viewCount === 'number' &&
    typeof candidate.likeCount === 'number' &&
    Array.isArray(candidate.contributors) &&
    candidate.contributors.every((item) => typeof item === 'string') &&
    typeof candidate.content === 'string'
  );
};

const isRedirect = (value: unknown): value is WikiRedirect => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WikiRedirect>;
  return (
    typeof candidate.aliasSlug === 'string' &&
    typeof candidate.aliasTitle === 'string' &&
    typeof candidate.targetSlug === 'string' &&
    typeof candidate.createdAt === 'string'
  );
};

const isTemplate = (value: unknown): value is WikiTemplate => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WikiTemplate>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.content === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
};

const isAttachment = (value: unknown): value is WikiAttachment => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WikiAttachment>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.articleSlug === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.uploadedAt === 'string'
  );
};

const isStringArray = (value: unknown): value is readonly string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const readRecord = <T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): Record<string, readonly T[]> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, items]) => {
      if (!Array.isArray(items)) {
        return [];
      }

      return [[key, items.filter(guard)] as const];
    }),
  );
};

const readRedirects = (value: unknown): Record<string, WikiRedirect> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, redirect]) =>
      isRedirect(redirect) ? [[key, redirect] as const] : [],
    ),
  );
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
      createdArticles: Array.isArray(parsed.createdArticles)
        ? parsed.createdArticles.filter(isArticle)
        : [],
      likedSlugs: Array.isArray(parsed.likedSlugs)
        ? parsed.likedSlugs.filter((slug): slug is string => typeof slug === 'string')
        : [],
      redirects: readRedirects(parsed.redirects),
      templates: Array.isArray(parsed.templates)
        ? parsed.templates.filter(isTemplate)
        : [],
      attachments: Array.isArray(parsed.attachments)
        ? parsed.attachments.filter(isAttachment)
        : [],
      protectedSlugs: isStringArray(parsed.protectedSlugs)
        ? parsed.protectedSlugs
        : [],
      deletedSlugs: isStringArray(parsed.deletedSlugs) ? parsed.deletedSlugs : [],
      watchlistSlugs: isStringArray(parsed.watchlistSlugs)
        ? parsed.watchlistSlugs
        : [],
    };
  } catch {
    return emptyState;
  }
};

export const saveWikiState = (state: StoredWikiState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
