import type { EnginePanelProps } from './EnginePanelTypes';
import { findArticleTitle } from './EnginePanelTypes';
import {
  ButtonRow,
  DocumentList,
  EmptyState,
  FeatureCard,
  FeatureCardMeta,
  FeatureCardTitle,
  FieldLabel,
  Form,
  PrimaryButton,
  RecentChangeRow,
  RecentChangeTime,
  RecentChangeTitle,
  TextArea,
  TextInput,
} from './styles';

type EngineCatalogCardsProps = Pick<
  EnginePanelProps,
  | 'articles'
  | 'backlinks'
  | 'categoryIndex'
  | 'redirectAlias'
  | 'redirects'
  | 'templateContent'
  | 'templateName'
  | 'templates'
  | 'onCreateRedirect'
  | 'onSaveTemplate'
  | 'onSelectArticle'
  | 'setRedirectAlias'
  | 'setTemplateContent'
  | 'setTemplateName'
>;

export const EngineCatalogCards = ({
  articles,
  backlinks,
  categoryIndex,
  redirectAlias,
  redirects,
  templateContent,
  templateName,
  templates,
  onCreateRedirect,
  onSaveTemplate,
  onSelectArticle,
  setRedirectAlias,
  setTemplateContent,
  setTemplateName,
}: EngineCatalogCardsProps) => (
  <>
    <FeatureCard>
      <FeatureCardTitle>리다이렉트</FeatureCardTitle>
      <FeatureCardMeta>별칭 문서를 현재 문서로 연결합니다.</FeatureCardMeta>
      <Form onSubmit={onCreateRedirect}>
        <FieldLabel>
          리다이렉트 별칭
          <TextInput
            onChange={(event) => setRedirectAlias(event.currentTarget.value)}
            placeholder="예: 대문 별칭"
            value={redirectAlias}
          />
        </FieldLabel>
        <ButtonRow>
          <PrimaryButton type="submit">리다이렉트 추가</PrimaryButton>
        </ButtonRow>
      </Form>
      <DocumentList>
        {Object.values(redirects).length > 0 ? (
          Object.values(redirects).map((redirect) => (
            <FeatureCardMeta key={redirect.aliasSlug}>
              {redirect.aliasTitle} → {findArticleTitle(articles, redirect.targetSlug)}
            </FeatureCardMeta>
          ))
        ) : (
          <EmptyState>등록된 리다이렉트가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>템플릿</FeatureCardTitle>
      <FeatureCardMeta>{'{{템플릿 이름}}'} 문법으로 내용을 전개합니다.</FeatureCardMeta>
      <Form onSubmit={onSaveTemplate}>
        <FieldLabel>
          템플릿 이름
          <TextInput
            onChange={(event) => setTemplateName(event.currentTarget.value)}
            placeholder="예: 교내 안내"
            value={templateName}
          />
        </FieldLabel>
        <FieldLabel>
          템플릿 내용
          <TextArea
            aria-label="템플릿 내용"
            onChange={(event) => setTemplateContent(event.currentTarget.value)}
            value={templateContent}
          />
        </FieldLabel>
        <ButtonRow>
          <PrimaryButton type="submit">템플릿 저장</PrimaryButton>
        </ButtonRow>
      </Form>
      <DocumentList>
        {templates.length > 0 ? (
          templates.map((template) => (
            <FeatureCardMeta key={template.id}>
              {template.name} · {template.updatedAt}
            </FeatureCardMeta>
          ))
        ) : (
          <EmptyState>저장된 템플릿이 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>분류 색인</FeatureCardTitle>
      <DocumentList>
        {categoryIndex.map(([category, categoryArticles]) => (
          <FeatureCardMeta key={category}>
            {category} · {categoryArticles.map((item) => item.title).join(', ')}
          </FeatureCardMeta>
        ))}
      </DocumentList>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>역링크</FeatureCardTitle>
      <DocumentList>
        {backlinks.length > 0 ? (
          backlinks.map((backlink) => (
            <RecentChangeRow
              key={backlink.slug}
              onClick={() => onSelectArticle(backlink.slug)}
              type="button"
            >
              <RecentChangeTitle>{backlink.title}</RecentChangeTitle>
              <RecentChangeTime>{backlink.category}</RecentChangeTime>
            </RecentChangeRow>
          ))
        ) : (
          <EmptyState>이 문서를 가리키는 문서가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>
  </>
);
