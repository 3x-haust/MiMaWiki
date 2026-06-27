import { ArticleHeader } from './ArticleHeader';
import { MainPanel } from './MainPanel';
import { SidebarRails } from './SidebarRails';
import { Article, Page, WikiShell } from './styles';
import { useHomePageModel } from './useHomePageModel';

export const HomePage = () => {
  const model = useHomePageModel();

  return (
    <Page>
      <WikiShell data-testid="wiki-shell">
        <Article>
          <ArticleHeader
            article={model.selectedArticle}
            contributorCount={model.contributorNames.length}
            isLiked={model.isLiked}
            likeCount={model.selectedLikeCount}
            onModeChange={model.handleModeChange}
            onToggleLike={model.handleToggleLike}
            revisionCount={model.articleRevisions.length}
            viewMode={model.viewMode}
          />
          <MainPanel model={model} />
        </Article>
        <SidebarRails
          contributorNames={model.contributorNames}
          filteredArticles={model.filteredArticles}
          likedSlugs={model.storedState.likedSlugs}
          onQueryChange={model.updateQuery}
          onSelectArticle={model.selectArticle}
          popularArticles={model.popularArticles}
          query={model.query}
          recentChanges={model.sidebarRecentChanges}
          revisionCount={model.articleRevisions.length}
          selectedArticle={model.selectedArticle}
        />
      </WikiShell>
    </Page>
  );
};
