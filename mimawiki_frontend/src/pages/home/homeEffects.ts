import { useEffect } from 'react';
import type { ViewMode } from './homeTypes';

type HeaderMode = Extract<ViewMode, 'coin' | 'discussion' | 'recent'>;

export const useArticleMetadata = (title: string, summary: string) => {
  useEffect(() => {
    document.title = `미마위키 - ${title}`;
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (description !== null) {
      description.content = `${title}: ${summary}`;
    }
  }, [summary, title]);
};

export const useHeaderEvents = (
  onSearch: (query: string) => void,
  onMode: (mode: HeaderMode) => void,
) => {
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const queryText =
        event instanceof CustomEvent && typeof event.detail === 'string'
          ? event.detail
          : '';
      onSearch(queryText);
    };
    const handleHeaderMode = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        (event.detail === 'recent' ||
          event.detail === 'discussion' ||
          event.detail === 'coin')
      ) {
        onMode(event.detail);
      }
    };

    window.addEventListener('mimawiki:search', handleHeaderSearch);
    window.addEventListener('mimawiki:mode', handleHeaderMode);
    return () => {
      window.removeEventListener('mimawiki:search', handleHeaderSearch);
      window.removeEventListener('mimawiki:mode', handleHeaderMode);
    };
  }, [onMode, onSearch]);
};
