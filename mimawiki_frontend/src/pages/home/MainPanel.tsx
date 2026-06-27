import { initialArticles } from './articles';
import { CreatePanel, MyPagePanel } from './BumaPanels';
import {
  DiscussionPanel,
  EditPanel,
  HistoryPanel,
  RecentPanel,
} from './DocumentPanels';
import { EnginePanel } from './EnginePanel';
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
        isProtected={model.isProtected}
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

  if (model.viewMode === 'engine') {
    return (
      <EnginePanel
        article={model.selectedArticle}
        articles={model.articles}
        attachmentDescription={model.attachmentDescription}
        attachmentName={model.attachmentName}
        attachments={model.selectedAttachments}
        backlinks={model.backlinks}
        categoryIndex={model.categoryIndex}
        deletedArticles={model.deletedArticles}
        isProtected={model.isProtected}
        isWatched={model.isWatched}
        moveTitle={model.moveTitle}
        onAddAttachment={model.handleAddAttachment}
        onCreateRedirect={model.handleCreateRedirect}
        onDeleteArticle={model.handleDeleteArticle}
        onMoveArticle={model.handleMoveArticle}
        onRestoreArticle={model.handleRestoreArticle}
        onSaveTemplate={model.handleSaveTemplate}
        onSelectArticle={model.selectArticle}
        onToggleProtection={model.handleToggleProtection}
        onToggleWatchlist={model.handleToggleWatchlist}
        redirectAlias={model.redirectAlias}
        redirects={model.storedState.redirects}
        setAttachmentDescription={model.setAttachmentDescription}
        setAttachmentName={model.setAttachmentName}
        setMoveTitle={model.setMoveTitle}
        setRedirectAlias={model.setRedirectAlias}
        setTemplateContent={model.setTemplateContent}
        setTemplateName={model.setTemplateName}
        templateContent={model.templateContent}
        templateName={model.templateName}
        templates={model.storedState.templates}
        watchlistSlugs={model.storedState.watchlistSlugs}
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
