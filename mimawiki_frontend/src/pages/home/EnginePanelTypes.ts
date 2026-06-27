import type { FormEvent } from 'react';
import type { WikiArticle } from './articles';
import type {
  WikiAttachment,
  WikiRedirect,
  WikiSnapshot,
  WikiTemplate,
} from './wikiStore';

export type EnginePanelProps = {
  readonly article: WikiSnapshot;
  readonly articles: readonly WikiSnapshot[];
  readonly attachments: readonly WikiAttachment[];
  readonly backlinks: readonly WikiSnapshot[];
  readonly categoryIndex: readonly (readonly [string, readonly WikiSnapshot[]])[];
  readonly deletedArticles: readonly WikiArticle[];
  readonly isProtected: boolean;
  readonly isWatched: boolean;
  readonly redirects: Record<string, WikiRedirect>;
  readonly templates: readonly WikiTemplate[];
  readonly watchlistSlugs: readonly string[];
  readonly redirectAlias: string;
  readonly templateName: string;
  readonly templateContent: string;
  readonly attachmentName: string;
  readonly attachmentDescription: string;
  readonly moveTitle: string;
  readonly onAddAttachment: (event: FormEvent<HTMLFormElement>) => void;
  readonly onCreateRedirect: (event: FormEvent<HTMLFormElement>) => void;
  readonly onDeleteArticle: () => void;
  readonly onMoveArticle: (event: FormEvent<HTMLFormElement>) => void;
  readonly onRestoreArticle: (slug: string) => void;
  readonly onSaveTemplate: (event: FormEvent<HTMLFormElement>) => void;
  readonly onSelectArticle: (slug: string) => void;
  readonly onToggleProtection: () => void;
  readonly onToggleWatchlist: () => void;
  readonly setAttachmentDescription: (value: string) => void;
  readonly setAttachmentName: (value: string) => void;
  readonly setMoveTitle: (value: string) => void;
  readonly setRedirectAlias: (value: string) => void;
  readonly setTemplateContent: (value: string) => void;
  readonly setTemplateName: (value: string) => void;
};

export const findArticleTitle = (
  articles: readonly WikiSnapshot[],
  slug: string,
) => articles.find((article) => article.slug === slug)?.title ?? slug;
