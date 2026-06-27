import { formatCount } from './homeConstants';
import type { ViewMode } from './homeTypes';
import {
  ArticleCategory,
  ArticleMetrics,
  ArticleSummary,
  ArticleTitle,
  ArticleTools,
  ButtonRow,
  MetricDescription,
  MetricItem,
  MetricTerm,
  PrimaryButton,
  ToolButton,
  ToolCluster,
} from './styles';
import type { WikiSnapshot } from './wikiStore';

const toolModes = [
  ['read', '읽기'],
  ['edit', '편집'],
  ['history', '역사'],
  ['discussion', '토론'],
  ['recent', '최근변경'],
  ['create', '생성'],
  ['mypage', '마이페이지'],
  ['engine', '엔진'],
] as const satisfies readonly (readonly [ViewMode, string])[];

type ArticleHeaderProps = {
  readonly article: WikiSnapshot;
  readonly revisionCount: number;
  readonly likeCount: number;
  readonly contributorCount: number;
  readonly isLiked: boolean;
  readonly viewMode: ViewMode;
  readonly onModeChange: (nextMode: ViewMode) => void;
  readonly onToggleLike: () => void;
};

export const ArticleHeader = ({
  article,
  revisionCount,
  likeCount,
  contributorCount,
  isLiked,
  viewMode,
  onModeChange,
  onToggleLike,
}: ArticleHeaderProps) => (
  <>
    <ArticleTools aria-label="문서 도구">
      <ArticleCategory>{article.category}</ArticleCategory>
      <ToolCluster>
        {toolModes.map(([mode, label]) => (
          <ToolButton
            aria-pressed={viewMode === mode}
            key={mode}
            onClick={() => onModeChange(mode)}
            type="button"
          >
            {label}
          </ToolButton>
        ))}
      </ToolCluster>
    </ArticleTools>
    <ArticleTitle>{article.title}</ArticleTitle>
    <ArticleSummary>최근 수정 시각: {article.updatedAt}</ArticleSummary>
    <ArticleMetrics aria-label="문서 지표">
      <MetricItem>
        <MetricTerm>조회수</MetricTerm>
        <MetricDescription>
          {formatCount(article.viewCount + revisionCount)}
        </MetricDescription>
      </MetricItem>
      <MetricItem>
        <MetricTerm>추천</MetricTerm>
        <MetricDescription>{formatCount(likeCount)}</MetricDescription>
      </MetricItem>
      <MetricItem>
        <MetricTerm>기여자</MetricTerm>
        <MetricDescription>{contributorCount}명</MetricDescription>
      </MetricItem>
    </ArticleMetrics>
    <ButtonRow>
      <PrimaryButton onClick={onToggleLike} type="button">
        {isLiked ? '좋아요 취소' : '좋아요'}
      </PrimaryButton>
    </ButtonRow>
  </>
);
