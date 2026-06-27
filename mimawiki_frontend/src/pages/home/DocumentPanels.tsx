import type { FormEvent } from 'react';
import {
  getChangedText,
  summarizePatch,
  type DiscussionComment,
  type RevisionFrame,
  type WikiRevision,
  type WikiSnapshot,
} from './wikiStore';
import {
  ButtonRow,
  DiffBox,
  DiffLine,
  DocumentMeta,
  EmptyState,
  Form,
  Panel,
  PanelTitle,
  PrimaryButton,
  SecondaryButton,
  TextArea,
  Timeline,
  TimelineHeader,
  TimelineItem,
  TimelineMeta,
  TimelineTitle,
} from './styles';

type EditPanelProps = {
  readonly draftContent: string;
  readonly isProtected: boolean;
  readonly onDraftChange: (content: string) => void;
  readonly onSave: (event: FormEvent<HTMLFormElement>) => void;
  readonly onCancel: () => void;
};

export const EditPanel = ({
  draftContent,
  isProtected,
  onDraftChange,
  onSave,
  onCancel,
}: EditPanelProps) => (
  <Panel aria-label="문서 편집">
    {isProtected ? (
      <>
        <PanelTitle>보호된 문서</PanelTitle>
        <EmptyState>이 문서는 보호되어 편집할 수 없습니다.</EmptyState>
        <ButtonRow>
          <SecondaryButton onClick={onCancel} type="button">
            읽기로 돌아가기
          </SecondaryButton>
        </ButtonRow>
      </>
    ) : (
      <>
        <PanelTitle>문서 편집</PanelTitle>
        <Form onSubmit={onSave}>
          <TextArea
            aria-label="문서 내용"
            onChange={(event) => onDraftChange(event.currentTarget.value)}
            value={draftContent}
          />
          <ButtonRow>
            <SecondaryButton onClick={onCancel} type="button">
              취소
            </SecondaryButton>
            <PrimaryButton type="submit">저장</PrimaryButton>
          </ButtonRow>
        </Form>
      </>
    )}
  </Panel>
);

type HistoryPanelProps = {
  readonly revisionFrames: readonly RevisionFrame[];
};

export const HistoryPanel = ({ revisionFrames }: HistoryPanelProps) => {
  const latestFrame =
    revisionFrames.length > 0 ? revisionFrames[revisionFrames.length - 1] : undefined;
  const change = latestFrame === undefined ? null : getChangedText(latestFrame);

  return (
    <Panel aria-label="문서 역사">
      <PanelTitle>문서 역사</PanelTitle>
      {revisionFrames.length > 0 ? (
        <>
          <Timeline>
            {[...revisionFrames].reverse().map((frame) => (
              <TimelineItem key={frame.revision.id}>
                <TimelineHeader>
                  <TimelineTitle>r{frame.revision.version}</TimelineTitle>
                  <TimelineMeta>
                    {frame.revision.editedAt} · {frame.revision.editor} ·{' '}
                    {summarizePatch(frame.revision.patch)}
                  </TimelineMeta>
                </TimelineHeader>
              </TimelineItem>
            ))}
          </Timeline>
          {latestFrame !== undefined && change !== null ? (
            <Panel aria-label="변경 비교">
              <PanelTitle>변경 비교</PanelTitle>
              <DiffBox data-testid="diff-viewer">
                <DiffLine $tone="same">@ {latestFrame.revision.patch.start}</DiffLine>
                {change.removed.length > 0 ? (
                  <DiffLine $tone="removed">- {change.removed}</DiffLine>
                ) : null}
                {change.added.length > 0 ? (
                  <DiffLine $tone="added">+ {change.added}</DiffLine>
                ) : null}
              </DiffBox>
            </Panel>
          ) : null}
        </>
      ) : (
        <EmptyState>아직 편집 기록이 없습니다.</EmptyState>
      )}
    </Panel>
  );
};

type DiscussionPanelProps = {
  readonly comments: readonly DiscussionComment[];
  readonly draft: string;
  readonly onDraftChange: (content: string) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const DiscussionPanel = ({
  comments,
  draft,
  onDraftChange,
  onSubmit,
}: DiscussionPanelProps) => (
  <Panel aria-label="문서 토론">
    <PanelTitle>문서 토론</PanelTitle>
    <Form onSubmit={onSubmit}>
      <TextArea
        aria-label="토론 내용"
        onChange={(event) => onDraftChange(event.currentTarget.value)}
        value={draft}
      />
      <ButtonRow>
        <PrimaryButton type="submit">등록</PrimaryButton>
      </ButtonRow>
    </Form>
    <Timeline>
      {comments.length > 0 ? (
        [...comments].reverse().map((comment) => (
          <TimelineItem key={comment.id}>
            <TimelineHeader>
              <TimelineTitle>{comment.author}</TimelineTitle>
              <TimelineMeta>{comment.createdAt}</TimelineMeta>
            </TimelineHeader>
            <DocumentMeta>{comment.content}</DocumentMeta>
          </TimelineItem>
        ))
      ) : (
        <EmptyState>열린 토론이 없습니다.</EmptyState>
      )}
    </Timeline>
  </Panel>
);

type RecentPanelProps = {
  readonly articles: readonly WikiSnapshot[];
  readonly revisions: readonly WikiRevision[];
};

export const RecentPanel = ({ articles, revisions }: RecentPanelProps) => (
  <Panel aria-label="최근 변경">
    <PanelTitle>최근 변경</PanelTitle>
    <Timeline>
      {revisions.length > 0 ? (
        revisions.map((revision) => {
          const article = articles.find((item) => item.slug === revision.articleSlug);

          return (
            <TimelineItem key={revision.id}>
              <TimelineHeader>
                <TimelineTitle>
                  {article?.title ?? revision.articleSlug} r{revision.version}
                </TimelineTitle>
                <TimelineMeta>
                  {revision.editedAt} · {revision.editor} ·{' '}
                  {summarizePatch(revision.patch)}
                </TimelineMeta>
              </TimelineHeader>
            </TimelineItem>
          );
        })
      ) : (
        <EmptyState>최근 변경된 문서가 없습니다.</EmptyState>
      )}
    </Timeline>
  </Panel>
);
