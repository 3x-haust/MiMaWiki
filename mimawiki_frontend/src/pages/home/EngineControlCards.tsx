import type { EnginePanelProps } from './EnginePanelTypes';
import { findArticleTitle } from './EnginePanelTypes';
import {
  ButtonRow,
  DangerButton,
  DocumentList,
  EmptyState,
  FeatureCard,
  FeatureCardMeta,
  FeatureCardTitle,
  FieldGrid,
  FieldLabel,
  Form,
  PrimaryButton,
  RecentChangeTitle,
  SecondaryButton,
  TextInput,
  TimelineHeader,
  TimelineItem,
} from './styles';

type EngineControlCardsProps = Pick<
  EnginePanelProps,
  | 'article'
  | 'articles'
  | 'attachmentDescription'
  | 'attachmentName'
  | 'attachments'
  | 'deletedArticles'
  | 'isProtected'
  | 'isWatched'
  | 'moveTitle'
  | 'watchlistSlugs'
  | 'onAddAttachment'
  | 'onDeleteArticle'
  | 'onMoveArticle'
  | 'onRestoreArticle'
  | 'onToggleProtection'
  | 'onToggleWatchlist'
  | 'setAttachmentDescription'
  | 'setAttachmentName'
  | 'setMoveTitle'
>;

export const EngineControlCards = ({
  article,
  articles,
  attachmentDescription,
  attachmentName,
  attachments,
  deletedArticles,
  isProtected,
  isWatched,
  moveTitle,
  watchlistSlugs,
  onAddAttachment,
  onDeleteArticle,
  onMoveArticle,
  onRestoreArticle,
  onToggleProtection,
  onToggleWatchlist,
  setAttachmentDescription,
  setAttachmentName,
  setMoveTitle,
}: EngineControlCardsProps) => (
  <>
    <FeatureCard>
      <FeatureCardTitle>첨부</FeatureCardTitle>
      <Form onSubmit={onAddAttachment}>
        <FieldGrid>
          <FieldLabel>
            첨부 이름
            <TextInput
              onChange={(event) => setAttachmentName(event.currentTarget.value)}
              placeholder="예: 회의록.pdf"
              value={attachmentName}
            />
          </FieldLabel>
          <FieldLabel>
            첨부 설명
            <TextInput
              onChange={(event) => setAttachmentDescription(event.currentTarget.value)}
              placeholder="예: 운영 회의 자료"
              value={attachmentDescription}
            />
          </FieldLabel>
        </FieldGrid>
        <ButtonRow>
          <PrimaryButton type="submit">첨부 추가</PrimaryButton>
        </ButtonRow>
      </Form>
      <DocumentList>
        {attachments.length > 0 ? (
          attachments.map((attachment) => (
            <FeatureCardMeta key={attachment.id}>
              {attachment.name} · {attachment.description || '설명 없음'}
            </FeatureCardMeta>
          ))
        ) : (
          <EmptyState>이 문서에 첨부가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>보호</FeatureCardTitle>
      <FeatureCardMeta>
        {isProtected ? '이 문서는 보호되어 있습니다.' : '현재 누구나 편집할 수 있습니다.'}
      </FeatureCardMeta>
      <ButtonRow>
        <SecondaryButton onClick={onToggleProtection} type="button">
          {isProtected ? '보호 해제' : '문서 보호'}
        </SecondaryButton>
      </ButtonRow>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>감시 목록</FeatureCardTitle>
      <FeatureCardMeta>
        {article.title} {isWatched ? '감시 중' : '감시 안 함'}
      </FeatureCardMeta>
      <ButtonRow>
        <SecondaryButton onClick={onToggleWatchlist} type="button">
          {isWatched ? '감시 해제' : '감시 추가'}
        </SecondaryButton>
      </ButtonRow>
      <DocumentList>
        {watchlistSlugs.length > 0 ? (
          watchlistSlugs.map((slug) => (
            <FeatureCardMeta key={slug}>
              {findArticleTitle(articles, slug)} 감시 중
            </FeatureCardMeta>
          ))
        ) : (
          <EmptyState>감시 중인 문서가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>문서 이동</FeatureCardTitle>
      <Form onSubmit={onMoveArticle}>
        <FieldLabel>
          새 문서명
          <TextInput
            onChange={(event) => setMoveTitle(event.currentTarget.value)}
            placeholder="예: 미마위키:새 대문"
            value={moveTitle}
          />
        </FieldLabel>
        <ButtonRow>
          <PrimaryButton type="submit">문서 이동</PrimaryButton>
        </ButtonRow>
      </Form>
    </FeatureCard>

    <FeatureCard>
      <FeatureCardTitle>삭제/복구</FeatureCardTitle>
      <ButtonRow>
        <DangerButton onClick={onDeleteArticle} type="button">
          문서 삭제
        </DangerButton>
      </ButtonRow>
      <DocumentList>
        {deletedArticles.length > 0 ? (
          deletedArticles.map((deletedArticle) => (
            <TimelineItem key={deletedArticle.slug}>
              <TimelineHeader>
                <RecentChangeTitle>{deletedArticle.title}</RecentChangeTitle>
                <SecondaryButton
                  aria-label={`${deletedArticle.title} 복구`}
                  onClick={() => onRestoreArticle(deletedArticle.slug)}
                  type="button"
                >
                  복구
                </SecondaryButton>
              </TimelineHeader>
            </TimelineItem>
          ))
        ) : (
          <EmptyState>삭제된 문서가 없습니다.</EmptyState>
        )}
      </DocumentList>
    </FeatureCard>
  </>
);
