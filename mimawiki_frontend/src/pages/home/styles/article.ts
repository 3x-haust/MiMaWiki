import styled from 'styled-components';
import { screen, theme } from '../../../app/styles';

export const Article = styled.article`
  background-color: ${theme.white};
  border: 1px solid ${theme.border};
  border-radius: 6px;
  min-width: 0;
  min-height: calc(100dvh - 122px);
  padding: 32px;

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-4);
  }
`;

export const ArticleTools = styled.div`
  align-items: center;
  border-bottom: 1px solid ${theme.borderSubtle};
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: space-between;
  margin: calc(var(--space-2) * -1) 0 var(--space-5);
  padding-bottom: var(--space-4);
`;

export const ToolCluster = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

export const ToolButton = styled.button`
  border: 1px solid ${theme.border};
  border-radius: 4px;
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

export const ArticleCategory = styled.span`
  background-color: var(--category-bg);
  border: 1px solid ${theme.border};
  border-radius: 4px;
  color: var(--link-wiki);
  font-size: 12px;
  font-weight: 800;
  padding: var(--space-1) var(--space-2);
`;

export const ArticleTitle = styled.h1`
  color: ${theme.black};
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: var(--space-1);

  @media screen and (max-width: ${screen.phone}) {
    font-size: 34px;
  }
`;

export const ArticleSummary = styled.p`
  color: ${theme.textSecondary};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.7;
  margin-bottom: var(--space-5);
`;

export const ArticleMetrics = styled.dl`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: flex-end;
  margin-bottom: var(--space-5);

  @media screen and (max-width: ${screen.phone}) {
    justify-content: flex-start;
  }
`;

export const MetricItem = styled.div`
  align-items: center;
  border: 1px solid ${theme.border};
  border-radius: 999px;
  display: flex;
  gap: var(--space-2);
  min-width: 0;
  padding: 5px var(--space-3);
`;

export const MetricTerm = styled.dt`
  color: ${theme.textTertiary};
  font-size: 12px;
  font-weight: 800;
`;

export const MetricDescription = styled.dd`
  color: ${theme.black};
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const UtilityLinks = styled.nav`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
  padding: var(--space-3);
`;

export const UtilityButton = styled.button`
  color: var(--link-wiki);
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

export const InfoTable = styled.dl`
  border: 1px solid ${theme.border};
  display: grid;
  margin-bottom: var(--space-6);
`;

export const InfoRow = styled.div`
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

export const InfoTerm = styled.dt`
  align-items: center;
  background-color: var(--school-cell-bg);
  color: ${theme.black};
  display: flex;
  font-size: 13px;
  font-weight: 800;
  justify-content: center;
  line-height: 1.45;
  min-height: 42px;
  padding: var(--space-2);
  text-align: center;
`;

export const InfoDescription = styled.dd`
  align-items: center;
  color: ${theme.black};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
  min-width: 0;
  padding: var(--space-2) var(--space-3);
`;

export const CategoryLine = styled.div`
  border: 1px solid ${theme.border};
  border-radius: 4px;
  color: ${theme.textSecondary};
  font-size: 14px;
  font-weight: 700;
  margin-bottom: var(--space-5);
  padding: var(--space-2) var(--space-3);
`;

export const WikiLinkText = styled.span`
  color: var(--link-wiki);
`;
