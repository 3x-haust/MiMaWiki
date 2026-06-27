import { initialArticles } from './articles';
import { CreatePanel, MyPagePanel } from './BumaPanels';
import {
  DiscussionPanel,
  EditPanel,
  HistoryPanel,
  RecentPanel,
} from './DocumentPanels';
import { ReadPanel } from './ReadPanel';
import type { HomePageModel } from './useHomePageModel';

type MainPanelProps = {
  readonly model: HomePageModel;
};

export const MainPanel = ({ model }: MainPanelProps) => {
  if (model.viewMode === 'edit') {
    return (
      <EditPanel
        draftContent={model.draftContent}
        onCancel={() => model.setViewMode('read')}
        onDraftChange={model.setDraftContent}
        onSave={model.handleSave}
      />
    );
  }

  if (model.viewMode === 'history') {
    return <HistoryPanel revisionFrames={model.revisionFrames} />;
  }

  if (model.viewMode === 'discussion') {
    return (
      <DiscussionPanel
        comments={model.articleComments}
        draft={model.discussionDraft}
        onDraftChange={model.setDiscussionDraft}
        onSubmit={model.handleDiscussionSubmit}
      />
    );
  }

  if (model.viewMode === 'recent') {
    return <RecentPanel articles={model.articles} revisions={model.recentChanges} />;
  }

  if (model.viewMode === 'create') {
    return (
      <CreatePanel
        category={model.createCategory}
        content={model.createContent}
        onCategoryChange={model.setCreateCategory}
        onContentChange={model.setCreateContent}
        onSubmit={model.handleCreateArticle}
        onSummaryChange={model.setCreateSummary}
        onTitleChange={model.setCreateTitle}
        summary={model.createSummary}
        title={model.createTitle}
      />
    );
  }

  if (model.viewMode === 'mypage') {
    return (
      <MyPagePanel
        articles={model.articles}
        contributedArticles={model.contributedArticles}
        likedSlugs={model.storedState.likedSlugs}
        onSelectArticle={model.selectArticle}
      />
    );
  }

  return (
    <ReadPanel
      article={model.selectedArticle}
      isFrontPage={model.selectedArticle.slug === initialArticles[0].slug}
      onUtilityClick={model.handleUtilityClick}
    />
  );
};
