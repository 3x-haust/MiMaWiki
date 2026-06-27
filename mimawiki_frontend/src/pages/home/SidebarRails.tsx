import { formatCount, realtimeKeywords } from './homeConstants';
import type { SidebarRecentChange } from './homeTypes';
import {
  DocumentButton,
  DocumentList,
  DocumentMeta,
  DocumentTitle,
  EmptyState,
  MetadataDescription,
  MetadataList,
  MetadataRow,
  MetadataTerm,
  Rail,
  RailTitle,
  RecentChangeRow,
  RecentChangeTime,
  RecentChangeTitle,
  SearchGroup,
  SearchInput,
  SidebarColumn,
  SidebarLinkButton,
  SidebarList,
  SidebarListItem,
  SidebarRank,
} from './styles';
import type { WikiSnapshot } from './wikiStore';

type SidebarRailsProps = {
  readonly selectedArticle: WikiSnapshot;
  readonly contributorNames: readonly string[];
  readonly revisionCount: number;
  readonly recentChanges: readonly SidebarRecentChange[];
  readonly popularArticles: readonly WikiSnapshot[];
  readonly filteredArticles: readonly WikiSnapshot[];
  readonly likedSlugs: readonly string[];
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
  readonly onSelectArticle: (slug: string) => void;
};

export const SidebarRails = ({
  selectedArticle,
  contributorNames,
  revisionCount,
  recentChanges,
  popularArticles,
  filteredArticles,
  likedSlugs,
  query,
  onQueryChange,
  onSelectArticle,
}: SidebarRailsProps) => (
  <SidebarColumn>
    <Rail aria-label="실시간 검색어">
      <RailTitle>실시간 검색어</RailTitle>
      <SidebarList>
        {realtimeKeywords.map((keyword, index) => (
          <SidebarListItem key={keyword}>
            <SidebarRank>{index + 1}</SidebarRank>
            <SidebarLinkButton onClick={() => onQueryChange(keyword)} type="button">
              {keyword}
            </SidebarLinkButton>
          </SidebarListItem>
        ))}
      </SidebarList>
    </Rail>

    <Rail aria-label="최근 변경">
      <RailTitle>최근 변경</RailTitle>
      <DocumentList>
        {recentChanges.map((change) => (
          <RecentChangeRow
            key={change.id}
            onClick={() => onSelectArticle(change.slug)}
            type="button"
          >
            <RecentChangeTitle>{change.title}</RecentChangeTitle>
            <RecentChangeTime>{change.time}</RecentChangeTime>
          </RecentChangeRow>
        ))}
      </DocumentList>
    </Rail>

    <Rail aria-label="인기 문서">
      <RailTitle>인기 문서</RailTitle>
      <SidebarList>
        {popularArticles.map((article, index) => (
          <SidebarListItem key={article.slug}>
            <SidebarRank>{index + 1}</SidebarRank>
            <SidebarLinkButton
              onClick={() => onSelectArticle(article.slug)}
              type="button"
            >
              {article.title} · 추천{' '}
              {formatCount(
                article.likeCount + (likedSlugs.includes(article.slug) ? 1 : 0),
              )}
            </SidebarLinkButton>
          </SidebarListItem>
        ))}
      </SidebarList>
    </Rail>

    <Rail aria-label="문서 정보" data-testid="metadata-rail">
      <RailTitle>문서 정보</RailTitle>
      <MetadataList>
        <MetadataRow>
          <MetadataTerm>분류</MetadataTerm>
          <MetadataDescription>{selectedArticle.category}</MetadataDescription>
        </MetadataRow>
        <MetadataRow>
          <MetadataTerm>최근 수정</MetadataTerm>
          <MetadataDescription>{selectedArticle.updatedAt}</MetadataDescription>
        </MetadataRow>
        <MetadataRow>
          <MetadataTerm>기여</MetadataTerm>
          <MetadataDescription>{contributorNames.join(', ')}</MetadataDescription>
        </MetadataRow>
        <MetadataRow>
          <MetadataTerm>리비전</MetadataTerm>
          <MetadataDescription>r{selectedArticle.version}</MetadataDescription>
        </MetadataRow>
        <MetadataRow>
          <MetadataTerm>조회수</MetadataTerm>
          <MetadataDescription>
            {formatCount(selectedArticle.viewCount + revisionCount)}
          </MetadataDescription>
        </MetadataRow>
        <MetadataRow>
          <MetadataTerm>대표 색상</MetadataTerm>
          <MetadataDescription>#008156</MetadataDescription>
        </MetadataRow>
      </MetadataList>
    </Rail>

    <Rail aria-label="최근 문서" data-testid="document-rail">
      <RailTitle>최근 문서</RailTitle>
      <SearchGroup>
        문서 검색
        <SearchInput
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="제목, 분류, 설명"
          type="search"
          value={query}
        />
      </SearchGroup>
      <DocumentList>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <DocumentButton
              aria-pressed={article.slug === selectedArticle.slug}
              key={article.slug}
              onClick={() => onSelectArticle(article.slug)}
              type="button"
            >
              <DocumentTitle>{article.title}</DocumentTitle>
              <DocumentMeta>
                {article.category} · {article.updatedAt}
              </DocumentMeta>
              <DocumentMeta>{article.summary}</DocumentMeta>
            </DocumentButton>
          ))
        ) : (
          <EmptyState>검색 결과가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </Rail>
  </SidebarColumn>
);
