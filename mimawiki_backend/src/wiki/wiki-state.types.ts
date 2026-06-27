export type WikiStatePayload = Record<string, unknown>;

export const EMPTY_WIKI_STATE: WikiStatePayload = {
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
  searchKeywords: {},
};

const isRecord = (value: unknown): value is WikiStatePayload =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const normalizeWikiPayload = (payload: unknown): WikiStatePayload =>
  isRecord(payload) ? { ...EMPTY_WIKI_STATE, ...payload } : EMPTY_WIKI_STATE;
