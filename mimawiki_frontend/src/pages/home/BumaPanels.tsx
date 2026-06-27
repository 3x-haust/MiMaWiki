import type { FormEvent } from 'react';
import type { WikiSnapshot } from './wikiStore';
import {
  ButtonRow,
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
  RecentChangeRow,
  RecentChangeTime,
  RecentChangeTitle,
  TextArea,
  TextInput,
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
