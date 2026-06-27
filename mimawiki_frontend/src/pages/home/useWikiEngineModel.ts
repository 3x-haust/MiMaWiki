import {
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';
import { initialArticles } from './articles';
import type { ViewMode } from './homeTypes';
import {
  createLocalArticle,
  getArticleAttachments,
  getBacklinks,
  getCategoryIndex,
} from './homeSelectors';
import {
  createWikiAttachment,
  createWikiRedirect,
  createWikiTemplate,
  type StoredWikiState,
  type WikiSnapshot,
} from './wikiStore';

type UseWikiEngineModelInput = {
  readonly articles: readonly WikiSnapshot[];
  readonly selectedArticle: WikiSnapshot;
  readonly storedState: StoredWikiState;
  readonly updateStoredState: (nextState: StoredWikiState) => void;
  readonly selectArticle: (slug: string) => void;
  readonly setSelectedSlug: Dispatch<SetStateAction<string>>;
  readonly setViewMode: Dispatch<SetStateAction<ViewMode>>;
};

const toggleSlug = (slugs: readonly string[], slug: string) =>
  slugs.includes(slug)
    ? slugs.filter((item) => item !== slug)
    : [...slugs, slug];

export const useWikiEngineModel = ({
  articles,
  selectedArticle,
  storedState,
  updateStoredState,
  selectArticle,
  setSelectedSlug,
  setViewMode,
}: UseWikiEngineModelInput) => {
  const [redirectAlias, setRedirectAlias] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentDescription, setAttachmentDescription] = useState('');
  const [moveTitle, setMoveTitle] = useState('');

  const isProtected = storedState.protectedSlugs.includes(selectedArticle.slug);
  const isWatched = storedState.watchlistSlugs.includes(selectedArticle.slug);
  const categoryIndex = useMemo(() => getCategoryIndex(articles), [articles]);
  const backlinks = useMemo(
    () => getBacklinks(articles, selectedArticle),
    [articles, selectedArticle],
  );
  const selectedAttachments = useMemo(
    () => getArticleAttachments(storedState.attachments, selectedArticle.slug),
    [selectedArticle.slug, storedState.attachments],
  );
  const deletedArticles = useMemo(
    () =>
      [...initialArticles, ...storedState.createdArticles].filter((article) =>
        storedState.deletedSlugs.includes(article.slug),
      ),
    [storedState.createdArticles, storedState.deletedSlugs],
  );

  const handleCreateRedirect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const aliasTitle = redirectAlias.trim();
    if (aliasTitle.length === 0) {
      return;
    }

    const redirect = createWikiRedirect(aliasTitle, selectedArticle.slug);
    updateStoredState({
      ...storedState,
      redirects: { ...storedState.redirects, [redirect.aliasSlug]: redirect },
    });
    setRedirectAlias('');
  };
  const handleSaveTemplate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = templateName.trim();
    const content = templateContent.trimEnd();
    if (name.length === 0 || content.length === 0) {
      return;
    }

    const template = createWikiTemplate(name, content);
    updateStoredState({
      ...storedState,
      templates: [
        template,
        ...storedState.templates.filter((item) => item.name !== template.name),
      ],
    });
    setTemplateName('');
    setTemplateContent('');
  };
  const handleAddAttachment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = attachmentName.trim();
    if (name.length === 0) {
      return;
    }

    updateStoredState({
      ...storedState,
      attachments: [
        createWikiAttachment(selectedArticle.slug, name, attachmentDescription),
        ...storedState.attachments,
      ],
    });
    setAttachmentName('');
    setAttachmentDescription('');
  };
  const handleToggleProtection = () => {
    updateStoredState({
      ...storedState,
      protectedSlugs: toggleSlug(storedState.protectedSlugs, selectedArticle.slug),
    });
  };
  const handleToggleWatchlist = () => {
    updateStoredState({
      ...storedState,
      watchlistSlugs: toggleSlug(storedState.watchlistSlugs, selectedArticle.slug),
    });
  };
  const handleMoveArticle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = moveTitle.trim();
    if (title.length === 0 || title === selectedArticle.title) {
      return;
    }

    const movedArticle = createLocalArticle({
      title,
      category: selectedArticle.category,
      summary: selectedArticle.summary,
      content: selectedArticle.content,
    });
    const redirect = createWikiRedirect(selectedArticle.title, movedArticle.slug);
    updateStoredState({
      ...storedState,
      createdArticles: [...storedState.createdArticles, movedArticle],
      deletedSlugs: [...storedState.deletedSlugs, selectedArticle.slug],
      redirects: { ...storedState.redirects, [redirect.aliasSlug]: redirect },
    });
    setMoveTitle('');
    selectArticle(movedArticle.slug);
  };
  const handleDeleteArticle = () => {
    updateStoredState({
      ...storedState,
      deletedSlugs: [...storedState.deletedSlugs, selectedArticle.slug],
    });
    setSelectedSlug(
      articles.find((article) => article.slug !== selectedArticle.slug)?.slug ??
        initialArticles[0].slug,
    );
    setViewMode('engine');
  };
  const handleRestoreArticle = (slug: string) => {
    updateStoredState({
      ...storedState,
      deletedSlugs: storedState.deletedSlugs.filter((item) => item !== slug),
    });
    setSelectedSlug(slug);
    setViewMode('read');
  };

  return {
    attachmentDescription, attachmentName, backlinks, categoryIndex, deletedArticles,
    handleAddAttachment, handleCreateRedirect, handleDeleteArticle,
    handleMoveArticle, handleRestoreArticle, handleSaveTemplate,
    handleToggleProtection, handleToggleWatchlist, isProtected, isWatched,
    moveTitle, redirectAlias, selectedAttachments, setAttachmentDescription,
    setAttachmentName, setMoveTitle, setRedirectAlias, setTemplateContent,
    setTemplateName, templateContent, templateName,
  };
};
