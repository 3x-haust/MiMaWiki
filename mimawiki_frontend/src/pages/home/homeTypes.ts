export type ViewMode =
  | 'read'
  | 'edit'
  | 'history'
  | 'discussion'
  | 'recent'
  | 'create'
  | 'mypage'
  | 'engine';

export type SidebarRecentChange = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly time: string;
};

export type WikiSyncStatus = 'online' | 'saving' | 'offline';
