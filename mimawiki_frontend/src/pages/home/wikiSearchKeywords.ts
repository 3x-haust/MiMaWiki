import type { StoredWikiState } from './wikiStore';

export const recordSearchKeyword = (
  state: StoredWikiState,
  query: string,
): StoredWikiState => {
  const keyword = query.trim();
  if (keyword.length === 0) {
    return state;
  }

  return {
    ...state,
    searchKeywords: {
      ...state.searchKeywords,
      [keyword]: (state.searchKeywords[keyword] ?? 0) + 1,
    },
  };
};
