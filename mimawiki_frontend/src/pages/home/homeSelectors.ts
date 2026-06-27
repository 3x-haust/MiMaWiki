import { initialArticles, type WikiArticle } from './articles';
import { getEditorName } from './homeConstants';
import type { SidebarRecentChange } from './homeTypes';
import type { StoredWikiState, WikiRevision, WikiSnapshot } from './wikiStore';

type CreateArticleInput = {
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly content: string;
};

export const filterArticles = (
  articles: readonly WikiSnapshot[],
  query: string,
) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return articles;
  }

  return articles.filter((article) =>
    `${article.title} ${article.category} ${article.summary}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
};

export const findSeedArticle = (
  article: WikiSnapshot,
  createdArticles: readonly WikiArticle[],
) =>
  initialArticles.find((item) => item.slug === article.slug) ??
  createdArticles.find((item) => item.slug === article.slug) ??
  article;

export const listRecentChanges = (state: StoredWikiState) =>
  Object.values(state.revisions)
    .flat()
    .sort((left, right) => right.editedAt.localeCompare(left.editedAt));

export const buildSidebarRecentChanges = (
  articles: readonly WikiSnapshot[],
  revisions: readonly WikiRevision[],
): readonly SidebarRecentChange[] => {
  if (revisions.length > 0) {
    return revisions.slice(0, 8).map((revision) => {
      const article = articles.find((item) => item.slug === revision.articleSlug);

      return {
        id: revision.id,
        slug: revision.articleSlug,
        title: `${article?.title ?? revision.articleSlug} r${revision.version}`,
        time: '방금 전',
      };
    });
  }

  return articles.slice(0, 8).map((article, index) => ({
    id: article.slug,
    slug: article.slug,
    title: article.title,
    time: index === 0 ? '방금 전' : `${index + 2}분 전`,
  }));
};

export const getPopularArticles = (
  articles: readonly WikiSnapshot[],
  likedSlugs: readonly string[],
) =>
  [...articles]
    .sort(
      (left, right) =>
        right.likeCount +
        (likedSlugs.includes(right.slug) ? 1 : 0) -
        (left.likeCount + (likedSlugs.includes(left.slug) ? 1 : 0)),
    )
    .slice(0, 5);

export const getContributedArticles = (
  articles: readonly WikiSnapshot[],
  state: StoredWikiState,
) =>
  articles.filter(
    (article) =>
      article.contributors.includes(getEditorName()) ||
      (state.revisions[article.slug] ?? []).some(
        (revision) => revision.editor === getEditorName(),
      ),
  );

export const createLocalArticle = ({
  title,
  category,
  summary,
  content,
}: CreateArticleInput): WikiArticle => ({
  slug: `custom-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  title,
  category: category.trim() || '생활',
  updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  editor: getEditorName(),
  summary: summary.trim() || '미마위키 사용자가 만든 문서.',
  viewCount: 0,
  likeCount: 0,
  contributors: [getEditorName()],
  content,
});
