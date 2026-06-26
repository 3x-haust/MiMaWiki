import { useEffect, useMemo, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { screen, theme } from '../../app/styles';
import { MimaMark } from '../../features/wiki';
import { initialArticles } from './articles';
import {
  buildRevisionFrames,
  buildSnapshots,
  createDiscussionComment,
  createRevision,
  getChangedText,
  loadWikiState,
  saveWikiState,
  summarizePatch,
  type StoredWikiState,
} from './wikiStore';

type ViewMode = 'read' | 'edit' | 'history' | 'discussion' | 'recent';

const Page = styled.div`
  background-color: ${theme.surfaceSecondary};
  min-height: calc(100dvh - 104px);
  padding: var(--space-6) var(--space-8) var(--space-8);

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-4);
  }
`;

const WikiShell = styled.div`
  display: grid;
  gap: var(--space-4);
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr) minmax(220px, 260px);
  margin: 0 auto;
  max-width: 1440px;
  min-width: 0;

  @media screen and (max-width: ${screen.tablet}) {
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  }

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Rail = styled.aside`
  background-color: ${theme.white};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  min-width: 0;
  padding: var(--space-4);
`;

const RailTitle = styled.h2`
  color: ${theme.black};
  font-size: 18px;
  font-weight: 800;
  line-height: 1.45;
  margin-bottom: var(--space-3);
`;

const SearchGroup = styled.label`
  color: ${theme.textSecondary};
  display: grid;
  font-size: 12px;
  font-weight: 700;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`;

const SearchInput = styled.input`
  background-color: ${theme.surfaceSecondary};
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 15px;
  min-height: 40px;
  padding: 0 var(--space-3);
  width: 100%;

  &::placeholder {
    color: ${theme.textTertiary};
  }
`;

const DocumentList = styled.div`
  display: grid;
  gap: var(--space-2);
`;

const DocumentButton = styled.button`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  color: ${theme.black};
  display: grid;
  gap: var(--space-1);
  min-height: 76px;
  padding: var(--space-3);
  text-align: left;
  transition: background-color 120ms ease-out, border-color 120ms ease-out;
  width: 100%;

  &[aria-pressed='true'] {
    background-color: ${theme.accentSoft};
    border-color: ${theme.primary};
  }

  &:hover {
    background-color: ${theme.accentSoft};
    border-color: ${theme.primary};
  }
`;

const DocumentTitle = styled.span`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
`;

const DocumentMeta = styled.span`
  color: ${theme.textSecondary};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
`;

const Article = styled.article`
  background-color: ${theme.white};
  border: 1px solid ${theme.border};
  border-radius: 8px;
  min-width: 0;
  padding: var(--space-6);

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-4);
  }
`;

const ArticleTools = styled.div`
  align-items: center;
  border-bottom: 1px solid ${theme.borderSubtle};
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: space-between;
  margin: calc(var(--space-2) * -1) 0 var(--space-5);
  padding-bottom: var(--space-4);
`;

const ToolCluster = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

const ToolButton = styled.button`
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 13px;
  font-weight: 700;
  min-height: 34px;
  padding: 0 var(--space-3);
  transition: background-color 120ms ease-out, border-color 120ms ease-out;

  &[aria-pressed='true'] {
    background-color: ${theme.accentSoft};
    border-color: ${theme.primary};
    color: ${theme.primary};
  }

  &:hover {
    background-color: ${theme.accentSoft};
    border-color: ${theme.primary};
  }
`;

const ArticleCategory = styled.span`
  background-color: ${theme.accentSoft};
  border-radius: 6px;
  color: ${theme.primary};
  font-size: 12px;
  font-weight: 800;
  padding: var(--space-1) var(--space-2);
`;

const ArticleTitle = styled.h1`
  color: ${theme.black};
  font-size: 28px;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: var(--space-3);
`;

const ArticleSummary = styled.p`
  color: ${theme.textSecondary};
  font-size: 17px;
  line-height: 1.7;
  margin-bottom: var(--space-6);
`;

const ArticleMetrics = styled.dl`
  border-bottom: 1px solid ${theme.borderSubtle};
  border-top: 1px solid ${theme.borderSubtle};
  display: grid;
  gap: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: var(--space-5);

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const MetricItem = styled.div`
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  padding: var(--space-3);

  & + & {
    border-left: 1px solid ${theme.borderSubtle};
  }

  @media screen and (max-width: ${screen.phone}) {
    & + & {
      border-left: 0;
      border-top: 1px solid ${theme.borderSubtle};
    }
  }
`;

const MetricTerm = styled.dt`
  color: ${theme.textTertiary};
  font-size: 12px;
  font-weight: 800;
`;

const MetricDescription = styled.dd`
  color: ${theme.black};
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

const UtilityLinks = styled.nav`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  padding: var(--space-3);
`;

const UtilityButton = styled.button`
  color: ${theme.primary};
  font-size: 14px;
  font-weight: 800;
  min-height: 32px;
  padding: 0 var(--space-2);
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    background-color: ${theme.accentSoft};
  }
`;

const InfoTable = styled.dl`
  border: 2px solid ${theme.border};
  display: grid;
  margin-bottom: var(--space-6);
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: minmax(92px, 18%) minmax(0, 1fr);
  min-width: 0;

  & + & {
    border-top: 1px solid ${theme.border};
  }

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const InfoTerm = styled.dt`
  align-items: center;
  background-color: ${theme.primary};
  color: ${theme.white};
  display: flex;
  font-size: 13px;
  font-weight: 800;
  justify-content: center;
  line-height: 1.45;
  min-height: 42px;
  padding: var(--space-2);
  text-align: center;
`;

const InfoDescription = styled.dd`
  align-items: center;
  color: ${theme.black};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
  min-width: 0;
  padding: var(--space-2) var(--space-3);
`;

const Panel = styled.section`
  display: grid;
  gap: var(--space-4);
`;

const PanelTitle = styled.h2`
  border-bottom: 1px solid ${theme.border};
  color: ${theme.black};
  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  padding-bottom: var(--space-2);
`;

const Form = styled.form`
  display: grid;
  gap: var(--space-3);
`;

const TextArea = styled.textarea`
  background-color: ${theme.surfaceSecondary};
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font: inherit;
  line-height: 1.7;
  min-height: 280px;
  padding: var(--space-3);
  resize: vertical;
  width: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  background-color: ${theme.primary};
  border: 1px solid ${theme.primary};
  border-radius: 6px;
  color: ${theme.white};
  font-size: 13px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-4);
`;

const SecondaryButton = styled.button`
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 13px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-4);
`;

const Timeline = styled.div`
  display: grid;
  gap: var(--space-3);
`;

const TimelineItem = styled.div`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3);
`;

const TimelineHeader = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: space-between;
`;

const TimelineTitle = styled.strong`
  color: ${theme.black};
  font-size: 14px;
  line-height: 1.4;
`;

const TimelineMeta = styled.span`
  color: ${theme.textSecondary};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
`;

const DiffBox = styled.div`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  display: grid;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
`;

const DiffLine = styled.pre<{ readonly tone: 'added' | 'removed' | 'same' }>`
  background-color: ${(props) =>
    props.tone === 'added'
      ? 'rgba(0, 129, 86, 0.12)'
      : props.tone === 'removed'
        ? 'rgba(190, 18, 60, 0.1)'
        : theme.surfaceSecondary};
  color: ${(props) =>
    props.tone === 'added'
      ? theme.primary
      : props.tone === 'removed'
        ? '#be123c'
        : theme.textSecondary};
  margin: 0;
  overflow-wrap: anywhere;
  padding: var(--space-2) var(--space-3);
  white-space: pre-wrap;
`;

const MetadataList = styled.dl`
  display: grid;
  gap: var(--space-3);
`;

const MetadataRow = styled.div`
  border-top: 1px solid ${theme.borderSubtle};
  display: grid;
  gap: var(--space-1);
  padding-top: var(--space-3);
`;

const MetadataTerm = styled.dt`
  color: ${theme.textTertiary};
  font-size: 12px;
  font-weight: 700;
`;

const MetadataDescription = styled.dd`
  color: ${theme.black};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
`;

const EmptyState = styled.p`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  color: ${theme.textSecondary};
  font-size: 13px;
  line-height: 1.5;
  padding: var(--space-3);
`;

const getEditorName = () => '미림 편집자';

const formatCount = (value: number) => value.toLocaleString('ko-KR');

export const HomePage = () => {
  const [storedState, setStoredState] = useState<StoredWikiState>(() =>
    loadWikiState(),
  );
  const [selectedSlug, setSelectedSlug] = useState(initialArticles[0].slug);
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('read');
  const [draftContent, setDraftContent] = useState(initialArticles[0].content);
  const [discussionDraft, setDiscussionDraft] = useState('');

  const articles = useMemo(() => buildSnapshots(storedState), [storedState]);
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return articles;
    }

    return articles.filter((article) =>
      `${article.title} ${article.category} ${article.summary}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [articles, query]);

  const selectedArticle =
    articles.find((article) => article.slug === selectedSlug) ?? articles[0];
  const seedArticle =
    initialArticles.find((article) => article.slug === selectedArticle.slug) ??
    initialArticles[0];
  const articleRevisions = useMemo(
    () => storedState.revisions[selectedArticle.slug] ?? [],
    [selectedArticle.slug, storedState.revisions],
  );
  const articleComments = storedState.discussions[selectedArticle.slug] ?? [];
  const revisionFrames = useMemo(
    () => buildRevisionFrames(seedArticle, articleRevisions),
    [articleRevisions, seedArticle],
  );
  const latestFrame =
    revisionFrames.length > 0
      ? revisionFrames[revisionFrames.length - 1]
      : undefined;
  const contributorNames = useMemo(
    () =>
      Array.from(
        new Set([
          ...selectedArticle.contributors,
          ...articleRevisions.map((revision) => revision.editor),
        ]),
      ),
    [articleRevisions, selectedArticle.contributors],
  );
  const recentChanges = useMemo(
    () =>
      Object.values(storedState.revisions)
        .flat()
        .sort((left, right) => right.editedAt.localeCompare(left.editedAt)),
    [storedState.revisions],
  );
  const pageTitle = `미마위키 - ${selectedArticle.title}`;
  const pageDescription = `${selectedArticle.title}: ${selectedArticle.summary}`;

  useEffect(() => {
    document.title = pageTitle;

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (description !== null) {
      description.content = pageDescription;
    }
  }, [pageDescription, pageTitle]);

  useEffect(() => {
    setDraftContent(selectedArticle.content);
    setDiscussionDraft('');
    setViewMode((currentMode) => (currentMode === 'edit' ? 'read' : currentMode));
  }, [selectedArticle.content, selectedArticle.slug]);

  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const queryText =
        event instanceof CustomEvent && typeof event.detail === 'string'
          ? event.detail
          : '';

      setQuery(queryText);
      setViewMode('read');
    };
    const handleHeaderMode = (event: Event) => {
      if (
        event instanceof CustomEvent &&
        (event.detail === 'recent' || event.detail === 'discussion')
      ) {
        setViewMode(event.detail);
      }
    };

    window.addEventListener('mimawiki:search', handleHeaderSearch);
    window.addEventListener('mimawiki:mode', handleHeaderMode);

    return () => {
      window.removeEventListener('mimawiki:search', handleHeaderSearch);
      window.removeEventListener('mimawiki:mode', handleHeaderMode);
    };
  }, []);

  const updateStoredState = (nextState: StoredWikiState) => {
    setStoredState(nextState);
    saveWikiState(nextState);
  };

  const handleModeChange = (nextMode: ViewMode) => {
    if (nextMode === 'edit') {
      setDraftContent(selectedArticle.content);
    }
    setViewMode(nextMode);
  };

  const handleUtilityClick = (target: string) => {
    if (target === '문서 토론') {
      setViewMode('discussion');
      return;
    }

    const nextArticle = articles.find((article) => article.title === target);
    if (nextArticle !== undefined) {
      setSelectedSlug(nextArticle.slug);
      setViewMode('read');
    }
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContent = draftContent.trimEnd();

    if (nextContent === selectedArticle.content) {
      setViewMode('read');
      return;
    }

    const revision = createRevision(selectedArticle, nextContent, getEditorName());
    const nextState = {
      ...storedState,
      revisions: {
        ...storedState.revisions,
        [selectedArticle.slug]: [...articleRevisions, revision],
      },
    };

    updateStoredState(nextState);
    setViewMode('history');
  };

  const handleDiscussionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = discussionDraft.trim();

    if (content.length === 0) {
      return;
    }

    const comment = createDiscussionComment(
      selectedArticle.slug,
      getEditorName(),
      content,
    );
    const nextState = {
      ...storedState,
      discussions: {
        ...storedState.discussions,
        [selectedArticle.slug]: [...articleComments, comment],
      },
    };

    updateStoredState(nextState);
    setDiscussionDraft('');
  };

  const renderMainPanel = () => {
    if (viewMode === 'edit') {
      return (
        <Panel aria-label="문서 편집">
          <PanelTitle>문서 편집</PanelTitle>
          <Form onSubmit={handleSave}>
            <TextArea
              aria-label="문서 내용"
              onChange={(event) => setDraftContent(event.currentTarget.value)}
              value={draftContent}
            />
            <ButtonRow>
              <SecondaryButton onClick={() => setViewMode('read')} type="button">
                취소
              </SecondaryButton>
              <PrimaryButton type="submit">저장</PrimaryButton>
            </ButtonRow>
          </Form>
        </Panel>
      );
    }

    if (viewMode === 'history') {
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
                    <DiffLine tone="same">
                      @ {latestFrame.revision.patch.start}
                    </DiffLine>
                    {change.removed.length > 0 ? (
                      <DiffLine tone="removed">- {change.removed}</DiffLine>
                    ) : null}
                    {change.added.length > 0 ? (
                      <DiffLine tone="added">+ {change.added}</DiffLine>
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
    }

    if (viewMode === 'discussion') {
      return (
        <Panel aria-label="문서 토론">
          <PanelTitle>문서 토론</PanelTitle>
          <Form onSubmit={handleDiscussionSubmit}>
            <TextArea
              aria-label="토론 내용"
              onChange={(event) => setDiscussionDraft(event.currentTarget.value)}
              value={discussionDraft}
            />
            <ButtonRow>
              <PrimaryButton type="submit">등록</PrimaryButton>
            </ButtonRow>
          </Form>
          <Timeline>
            {articleComments.length > 0 ? (
              [...articleComments].reverse().map((comment) => (
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
    }

    if (viewMode === 'recent') {
      return (
        <Panel aria-label="최근 변경">
          <PanelTitle>최근 변경</PanelTitle>
          <Timeline>
            {recentChanges.length > 0 ? (
              recentChanges.map((revision) => {
                const article = articles.find(
                  (item) => item.slug === revision.articleSlug,
                );

                return (
                  <TimelineItem key={revision.id}>
                    <TimelineHeader>
                      <TimelineTitle>
                        {article?.title ?? revision.articleSlug} r
                        {revision.version}
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
    }

    return (
      <>
        {selectedArticle.quickLinks !== undefined ? (
          <UtilityLinks aria-label="빠른 문서 링크">
            {selectedArticle.quickLinks.map((link) => (
              <UtilityButton
                key={`${link.name}-${link.content}`}
                onClick={() => handleUtilityClick(link.content)}
                type="button"
              >
                {link.name}
              </UtilityButton>
            ))}
          </UtilityLinks>
        ) : null}
        {selectedArticle.schoolInfo !== undefined ? (
          <InfoTable aria-label="학교 정보">
            {selectedArticle.schoolInfo.map((row) => (
              <InfoRow key={row.name}>
                <InfoTerm>{row.name}</InfoTerm>
                <InfoDescription>{row.content}</InfoDescription>
              </InfoRow>
            ))}
          </InfoTable>
        ) : null}
        <MimaMark content={selectedArticle.content} />
      </>
    );
  };

  return (
    <Page>
      <WikiShell data-testid="wiki-shell">
        <Rail aria-label="최근 문서" data-testid="document-rail">
          <RailTitle>최근 문서</RailTitle>
          <SearchGroup>
            문서 검색
            <SearchInput
              onChange={(event) => setQuery(event.currentTarget.value)}
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
                  onClick={() => {
                    setSelectedSlug(article.slug);
                    setViewMode('read');
                  }}
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

        <Article>
          <ArticleTools aria-label="문서 도구">
            <ArticleCategory>{selectedArticle.category}</ArticleCategory>
            <ToolCluster>
              {(
                [
                  ['read', '읽기'],
                  ['edit', '편집'],
                  ['history', '역사'],
                  ['discussion', '토론'],
                  ['recent', '최근변경'],
                ] as const
              ).map(([mode, label]) => (
                <ToolButton
                  aria-pressed={viewMode === mode}
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  type="button"
                >
                  {label}
                </ToolButton>
              ))}
            </ToolCluster>
          </ArticleTools>
          <ArticleTitle>{selectedArticle.title}</ArticleTitle>
          <ArticleSummary>{selectedArticle.summary}</ArticleSummary>
          <ArticleMetrics aria-label="문서 지표">
            <MetricItem>
              <MetricTerm>조회수</MetricTerm>
              <MetricDescription>
                {formatCount(selectedArticle.viewCount + articleRevisions.length)}
              </MetricDescription>
            </MetricItem>
            <MetricItem>
              <MetricTerm>추천</MetricTerm>
              <MetricDescription>
                {formatCount(selectedArticle.likeCount)}
              </MetricDescription>
            </MetricItem>
            <MetricItem>
              <MetricTerm>기여자</MetricTerm>
              <MetricDescription>{contributorNames.length}명</MetricDescription>
            </MetricItem>
          </ArticleMetrics>
          {renderMainPanel()}
        </Article>

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
                {formatCount(selectedArticle.viewCount + articleRevisions.length)}
              </MetadataDescription>
            </MetadataRow>
            <MetadataRow>
              <MetadataTerm>대표 색상</MetadataTerm>
              <MetadataDescription>#008156</MetadataDescription>
            </MetadataRow>
          </MetadataList>
        </Rail>
      </WikiShell>
    </Page>
  );
};
