import { initialArticles, type WikiArticle } from './articles';

export { loadWikiState, saveWikiState } from './wikiStateStorage';

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

export type WikiRedirect = {
  readonly aliasSlug: string;
  readonly aliasTitle: string;
  readonly targetSlug: string;
  readonly createdAt: string;
};

export type WikiTemplate = {
  readonly id: string;
  readonly name: string;
  readonly content: string;
  readonly updatedAt: string;
};

export type WikiAttachment = {
  readonly id: string;
  readonly articleSlug: string;
  readonly name: string;
  readonly description: string;
  readonly uploadedAt: string;
};

export type StoredWikiState = {
  readonly revisions: Record<string, readonly WikiRevision[]>;
  readonly discussions: Record<string, readonly DiscussionComment[]>;
  readonly createdArticles: readonly WikiArticle[];
  readonly likedSlugs: readonly string[];
  readonly redirects: Record<string, WikiRedirect>;
  readonly templates: readonly WikiTemplate[];
  readonly attachments: readonly WikiAttachment[];
  readonly protectedSlugs: readonly string[];
  readonly deletedSlugs: readonly string[];
  readonly watchlistSlugs: readonly string[];
};

export type WikiSnapshot = WikiArticle & {
  readonly version: number;
  readonly renderedContent: string;
};

export type RevisionFrame = {
  readonly revision: WikiRevision;
  readonly before: string;
  readonly after: string;
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

export const createArticleSlug = (title: string) =>
  title.trim().toLowerCase().replace(/\s+/g, '-');

export const expandTemplates = (
  content: string,
  templates: readonly WikiTemplate[],
) =>
  content.replace(/\{\{([^{}]+)\}\}/g, (match, rawName: string) => {
    const name = rawName.trim();
    const template = templates.find((item) => item.name === name);
    return template?.content ?? match;
  });

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
  [...initialArticles, ...state.createdArticles]
    .filter((article) => !state.deletedSlugs.includes(article.slug))
    .map((article) => {
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
      renderedContent: expandTemplates(content, state.templates),
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

export const createWikiRedirect = (
  aliasTitle: string,
  targetSlug: string,
): WikiRedirect => ({
  aliasSlug: createArticleSlug(aliasTitle),
  aliasTitle: aliasTitle.trim(),
  targetSlug,
  createdAt: formatDateTime(new Date()),
});

export const createWikiTemplate = (
  name: string,
  content: string,
): WikiTemplate => ({
  id: createId(),
  name: name.trim(),
  content: content.trimEnd(),
  updatedAt: formatDateTime(new Date()),
});

export const createWikiAttachment = (
  articleSlug: string,
  name: string,
  description: string,
): WikiAttachment => ({
  id: createId(),
  articleSlug,
  name: name.trim(),
  description: description.trim(),
  uploadedAt: formatDateTime(new Date()),
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
