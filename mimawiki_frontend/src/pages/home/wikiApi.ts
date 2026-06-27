import { MIMAWIKI_API_BASE_URL } from '../../shared/api/baseUrl';
import { normalizeWikiState } from './wikiStateStorage';
import type { StoredWikiState } from './wikiStore';

type ApiResponse = {
  readonly data?: unknown;
  readonly message?: string;
};

const WIKI_STATE_URL = `${MIMAWIKI_API_BASE_URL}/wiki/state`;
const REQUEST_TIMEOUT_MS = 2500;

const isApiResponse = (value: unknown): value is ApiResponse =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const requestWithTimeout = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const parseStateResponse = async (response: Response): Promise<StoredWikiState> => {
  const body: unknown = await response.json();
  if (!response.ok) {
    const message =
      isApiResponse(body) && typeof body.message === 'string'
        ? body.message
        : '위키 상태 동기화 실패';
    throw new Error(message);
  }

  return normalizeWikiState(isApiResponse(body) ? body.data : body);
};

export const fetchWikiState = async (): Promise<StoredWikiState> =>
  parseStateResponse(
    await requestWithTimeout(WIKI_STATE_URL, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
  );

export const persistWikiState = async (
  state: StoredWikiState,
): Promise<StoredWikiState> =>
  parseStateResponse(
    await requestWithTimeout(WIKI_STATE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(state),
      cache: 'no-store',
    }),
  );
