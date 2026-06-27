import type { FormEvent } from 'react';
import { formatCount, getEditorName } from './homeConstants';
import type { CoinTrade, WikiSnapshot } from './wikiStore';
import {
  ButtonRow,
  DangerButton,
  DocumentList,
  EmptyState,
  FeatureCard,
  FeatureCardMeta,
  FeatureCardTitle,
  FeatureGrid,
  FieldGrid,
  FieldLabel,
  Form,
  Panel,
  PanelTitle,
  PrimaryButton,
  RankingList,
  RecentChangeRow,
  RecentChangeTime,
  RecentChangeTitle,
  SecondaryButton,
  SidebarListItem,
  SidebarRank,
  TextArea,
  TextInput,
  Timeline,
  TimelineHeader,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from './styles';

type CreatePanelProps = {
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly content: string;
  readonly onTitleChange: (value: string) => void;
  readonly onCategoryChange: (value: string) => void;
  readonly onSummaryChange: (value: string) => void;
  readonly onContentChange: (value: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const CreatePanel = ({
  title,
  category,
  summary,
  content,
  onTitleChange,
  onCategoryChange,
  onSummaryChange,
  onContentChange,
  onSubmit,
}: CreatePanelProps) => (
  <Panel aria-label="문서 생성">
    <PanelTitle>문서 생성</PanelTitle>
    <Form onSubmit={onSubmit}>
      <FieldGrid>
        <FieldLabel>
          문서 제목
          <TextInput
            onChange={(event) => onTitleChange(event.currentTarget.value)}
            placeholder="예: 프로젝트 발표회"
            value={title}
          />
        </FieldLabel>
        <FieldLabel>
          분류
          <TextInput
            onChange={(event) => onCategoryChange(event.currentTarget.value)}
            placeholder="생활"
            value={category}
          />
        </FieldLabel>
      </FieldGrid>
      <FieldLabel>
        설명
        <TextInput
          onChange={(event) => onSummaryChange(event.currentTarget.value)}
          placeholder="검색과 문서 목록에 표시될 한 줄 설명"
          value={summary}
        />
      </FieldLabel>
      <TextArea
        aria-label="새 문서 내용"
        onChange={(event) => onContentChange(event.currentTarget.value)}
        value={content}
      />
      <ButtonRow>
        <PrimaryButton type="submit">문서 생성</PrimaryButton>
      </ButtonRow>
    </Form>
  </Panel>
);

type MyPagePanelProps = {
  readonly articles: readonly WikiSnapshot[];
  readonly contributedArticles: readonly WikiSnapshot[];
  readonly likedSlugs: readonly string[];
  readonly onSelectArticle: (slug: string) => void;
};

export const MyPagePanel = ({
  articles,
  contributedArticles,
  likedSlugs,
  onSelectArticle,
}: MyPagePanelProps) => (
  <Panel aria-label="마이페이지">
    <PanelTitle>마이페이지</PanelTitle>
    <FeatureGrid>
      <FeatureCard>
        <FeatureCardTitle>내 기여 문서</FeatureCardTitle>
        <FeatureCardMeta>{contributedArticles.length}개 문서</FeatureCardMeta>
        <ArticleShortcutList
          articles={contributedArticles}
          emptyText="아직 기여한 문서가 없습니다."
          onSelectArticle={onSelectArticle}
        />
      </FeatureCard>
      <FeatureCard>
        <FeatureCardTitle>좋아요 문서</FeatureCardTitle>
        <FeatureCardMeta>{likedSlugs.length}개 문서</FeatureCardMeta>
        <ArticleShortcutList
          articles={likedSlugs.flatMap((slug) =>
            articles.filter((article) => article.slug === slug),
          )}
          emptyText="좋아요한 문서가 없습니다."
          onSelectArticle={onSelectArticle}
        />
      </FeatureCard>
    </FeatureGrid>
  </Panel>
);

type ArticleShortcutListProps = {
  readonly articles: readonly WikiSnapshot[];
  readonly emptyText: string;
  readonly onSelectArticle: (slug: string) => void;
};

const ArticleShortcutList = ({
  articles,
  emptyText,
  onSelectArticle,
}: ArticleShortcutListProps) => (
  <DocumentList>
    {articles.length > 0 ? (
      articles.map((article) => (
        <RecentChangeRow
          key={article.slug}
          onClick={() => onSelectArticle(article.slug)}
          type="button"
        >
          <RecentChangeTitle>{article.title}</RecentChangeTitle>
          <RecentChangeTime>{article.category}</RecentChangeTime>
        </RecentChangeRow>
      ))
    ) : (
      <EmptyState>{emptyText}</EmptyState>
    )}
  </DocumentList>
);

const tradeLabels = {
  buy: '구매',
  sell: '판매',
  daily: '출석 보상',
} as const satisfies Record<CoinTrade['type'], string>;

type CoinPanelProps = {
  readonly coinBalance: number;
  readonly coinCount: number;
  readonly trades: readonly CoinTrade[];
  readonly onCoinTrade: (type: 'buy' | 'sell') => void;
  readonly onDailyReward: () => void;
};

export const CoinPanel = ({
  coinBalance,
  coinCount,
  trades,
  onCoinTrade,
  onDailyReward,
}: CoinPanelProps) => (
  <Panel aria-label="미마코인">
    <PanelTitle>미마코인</PanelTitle>
    <FeatureGrid>
      <FeatureCard>
        <FeatureCardTitle>내 지갑</FeatureCardTitle>
        <FeatureCardMeta>
          잔액 {formatCount(coinBalance)}원 · 보유 {formatCount(coinCount)} MIMA
        </FeatureCardMeta>
        <ButtonRow>
          <PrimaryButton onClick={() => onCoinTrade('buy')} type="button">
            1 MIMA 구매
          </PrimaryButton>
          <SecondaryButton onClick={() => onCoinTrade('sell')} type="button">
            1 MIMA 판매
          </SecondaryButton>
          <DangerButton onClick={onDailyReward} type="button">
            출석 보상
          </DangerButton>
        </ButtonRow>
      </FeatureCard>
      <FeatureCard>
        <FeatureCardTitle>코인 랭킹</FeatureCardTitle>
        <RankingList>
          {[
            ['학생회 기록팀', 42],
            ['소프트웨어과 편집자', 31],
            ['디자인과 편집자', 28],
            [getEditorName(), coinCount],
          ].map(([name, count], index) => (
            <SidebarListItem key={name}>
              <SidebarRank>{index + 1}</SidebarRank>
              <FeatureCardMeta>
                {name} · {formatCount(Number(count))} MIMA
              </FeatureCardMeta>
            </SidebarListItem>
          ))}
        </RankingList>
      </FeatureCard>
    </FeatureGrid>
    <Timeline>
      {trades.length > 0 ? (
        trades.map((trade) => (
          <TimelineItem key={trade.id}>
            <TimelineHeader>
              <TimelineTitle>{tradeLabels[trade.type]}</TimelineTitle>
              <TimelineMeta>
                {trade.createdAt} · {formatCount(trade.coinPrice)}원
              </TimelineMeta>
            </TimelineHeader>
          </TimelineItem>
        ))
      ) : (
        <EmptyState>거래 내역이 없습니다.</EmptyState>
      )}
    </Timeline>
  </Panel>
);
