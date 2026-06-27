import { normalizeWikiPayload } from './wiki-state.types';

describe('normalizeWikiPayload', () => {
  it('keeps wiki collections when a persisted payload is partial', () => {
    const payload = normalizeWikiPayload({
      likedSlugs: ['major-clubs'],
      searchKeywords: { 전공동아리: 3 },
    });

    expect(payload).toMatchObject({
      discussions: {},
      likedSlugs: ['major-clubs'],
      searchKeywords: { 전공동아리: 3 },
      templates: [],
    });
  });

  it('returns an empty wiki state when payload is invalid', () => {
    const payload = normalizeWikiPayload(null);

    expect(payload).toMatchObject({
      createdArticles: [],
      redirects: {},
      revisions: {},
      searchKeywords: {},
    });
  });
});
