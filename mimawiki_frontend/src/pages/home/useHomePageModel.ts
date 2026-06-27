import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { initialArticles } from './articles';
import { useArticleMetadata, useHeaderEvents } from './homeEffects';
import { getEditorName } from './homeConstants';
import type { ViewMode } from './homeTypes';
import {
  buildSidebarRecentChanges,
  createLocalArticle,
  filterArticles,
  findSeedArticle,
  getContributedArticles,
  getPopularArticles,
  listRecentChanges,
} from './homeSelectors';
import {
  buildRevisionFrames,
  buildSnapshots,
  createDiscussionComment,
  createRevision,
  loadWikiState,
  saveWikiState,
  type StoredWikiState,
} from './wikiStore';

export const useHomePageModel = () => {
  const [storedState, setStoredState] = useState<StoredWikiState>(() =>
    loadWikiState(),
  );
  const [selectedSlug, setSelectedSlug] = useState(initialArticles[0].slug);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('read');
  const [draftContent, setDraftContent] = useState(initialArticles[0].content);
  const [discussionDraft, setDiscussionDraft] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [createCategory, setCreateCategory] = useState('생활');
  const [createSummary, setCreateSummary] = useState('');
  const [createContent, setCreateContent] = useState(
    '== 개요 ==\n새 문서 내용을 작성하세요.',
  );

  const articles = useMemo(() => buildSnapshots(storedState), [storedState]);
  const selectedArticle =
    articles.find((article) => article.slug === selectedSlug) ?? articles[0];
  const articleRevisions = useMemo(
    () => storedState.revisions[selectedArticle.slug] ?? [],
    [selectedArticle.slug, storedState.revisions],
  );
  const revisionFrames = useMemo(
    () =>
      buildRevisionFrames(
        findSeedArticle(selectedArticle, storedState.createdArticles),
        articleRevisions,
      ),
    [articleRevisions, selectedArticle, storedState.createdArticles],
  );
  const recentChanges = useMemo(() => listRecentChanges(storedState), [storedState]);
  const contributorNames = useMemo(
    () =>
      Array.from(
        new Set([
          ...selectedArticle.contributors,
          ...articleRevisions.map((revision) => revision.editor),
        ]),
      ),
    [articleRevisions, selectedArticle.contributors],
  );
  const filteredArticles = useMemo(
    () => filterArticles(articles, query),
    [articles, query],
  );
  const sidebarRecentChanges = useMemo(
    () => buildSidebarRecentChanges(articles, recentChanges),
    [articles, recentChanges],
  );
  const popularArticles = useMemo(
    () => getPopularArticles(articles, storedState.likedSlugs),
    [articles, storedState.likedSlugs],
  );
  const contributedArticles = useMemo(
    () => getContributedArticles(articles, storedState),
    [articles, storedState],
  );
  const articleComments = storedState.discussions[selectedArticle.slug] ?? [];
  const isLiked = storedState.likedSlugs.includes(selectedArticle.slug);
  const selectedLikeCount = selectedArticle.likeCount + (isLiked ? 1 : 0);

  useArticleMetadata(selectedArticle.title, selectedArticle.summary);
  useHeaderEvents(
    (queryText) => {
      setQuery(queryText);
      setViewMode('read');
    },
    setViewMode,
  );

  useEffect(() => {
    setDraftContent(selectedArticle.content);
    setDiscussionDraft('');
    setViewMode((currentMode) => (currentMode === 'edit' ? 'read' : currentMode));
  }, [selectedArticle.content, selectedArticle.slug]);

  const updateStoredState = (nextState: StoredWikiState) => {
    setStoredState(nextState);
    saveWikiState(nextState);
  };
  const selectArticle = (slug: string) => {
    setSelectedSlug(slug);
    setViewMode('read');
  };
  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setViewMode('read');
  };
  const handleModeChange = (nextMode: ViewMode) => {
    if (nextMode === 'edit') {
      setDraftContent(selectedArticle.content);
    }
    setViewMode(nextMode);
  };
  const handleUtilityClick = (target: string) => {
    if (target === '문서 토론') {
      setViewMode('discussion');
      return;
    }

    const nextArticle = articles.find((article) => article.title === target);
    if (nextArticle !== undefined) {
      selectArticle(nextArticle.slug);
    }
  };
  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContent = draftContent.trimEnd();
    if (nextContent === selectedArticle.content) {
      setViewMode('read');
      return;
    }

    const revision = createRevision(selectedArticle, nextContent, getEditorName());
    updateStoredState({
      ...storedState,
      revisions: {
        ...storedState.revisions,
        [selectedArticle.slug]: [...articleRevisions, revision],
      },
    });
    setViewMode('history');
  };
  const handleCreateArticle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = createTitle.trim();
    const content = createContent.trimEnd();
    if (title.length === 0 || content.length === 0) {
      return;
    }

    const article = createLocalArticle({
      title,
      category: createCategory,
      summary: createSummary,
      content,
    });
    updateStoredState({
      ...storedState,
      createdArticles: [...storedState.createdArticles, article],
    });
    selectArticle(article.slug);
    setCreateTitle('');
    setCreateSummary('');
    setCreateContent('== 개요 ==\n새 문서 내용을 작성하세요.');
  };
  const handleToggleLike = () => {
    updateStoredState({
      ...storedState,
      likedSlugs: isLiked
        ? storedState.likedSlugs.filter((slug) => slug !== selectedArticle.slug)
        : [...storedState.likedSlugs, selectedArticle.slug],
    });
  };
  const handleDiscussionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = discussionDraft.trim();
    if (content.length === 0) {
      return;
    }

    const comment = createDiscussionComment(
      selectedArticle.slug,
      getEditorName(),
      content,
    );
    updateStoredState({
      ...storedState,
      discussions: {
        ...storedState.discussions,
        [selectedArticle.slug]: [...articleComments, comment],
      },
    });
    setDiscussionDraft('');
  };

  return {
    articleComments, articleRevisions, articles, contributorNames,
    contributedArticles, createCategory, createContent, createSummary, createTitle,
    draftContent, discussionDraft, filteredArticles, handleCreateArticle,
    handleDiscussionSubmit,
    handleModeChange, handleSave, handleToggleLike, handleUtilityClick, isLiked,
    popularArticles, query, recentChanges, revisionFrames, selectedArticle,
    selectedLikeCount, setCreateCategory, setCreateContent, setCreateSummary,
    setCreateTitle, setDiscussionDraft, setDraftContent, setViewMode,
    sidebarRecentChanges, selectArticle, storedState, updateQuery, viewMode,
  };
};

export type HomePageModel = ReturnType<typeof useHomePageModel>;
