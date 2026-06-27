import { useEffect, useState } from 'react';
import { fetchWikiState, persistWikiState } from './wikiApi';
import { loadWikiState, saveWikiState, type StoredWikiState } from './wikiStore';
import type { WikiSyncStatus } from './homeTypes';

export const useSyncedWikiState = () => {
  const [storedState, setStoredState] = useState<StoredWikiState>(() =>
    loadWikiState(),
  );
  const [syncStatus, setSyncStatus] = useState<WikiSyncStatus>('offline');

  useEffect(() => {
    let isActive = true;

    void fetchWikiState()
      .then((remoteState) => {
        if (!isActive) {
          return;
        }

        setStoredState(remoteState);
        saveWikiState(remoteState);
        setSyncStatus('online');
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        if (error instanceof Error) {
          setSyncStatus('offline');
          return;
        }

        throw error;
      });

    return () => {
      isActive = false;
    };
  }, []);

  const updateStoredState = (nextState: StoredWikiState) => {
    setStoredState(nextState);
    saveWikiState(nextState);
    setSyncStatus('saving');

    void persistWikiState(nextState)
      .then((remoteState) => {
        setStoredState(remoteState);
        saveWikiState(remoteState);
        setSyncStatus('online');
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setSyncStatus('offline');
          return;
        }

        throw error;
      });
  };

  return { storedState, syncStatus, updateStoredState };
};
