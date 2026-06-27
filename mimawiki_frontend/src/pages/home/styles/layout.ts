import styled from 'styled-components';
import { screen, theme } from '../../../app/styles';

export const Page = styled.div`
  background-color: ${theme.surface};
  min-height: calc(100dvh - 72px);
  padding: 18px 44px 32px;

  @media screen and (max-width: ${screen.tablet}) {
    padding: var(--space-4) var(--space-5) var(--space-6);
  }

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-4);
  }
`;

export const WikiShell = styled.div`
  display: grid;
  gap: var(--space-4);
  grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
  margin: 0 auto;
  max-width: 1784px;
  min-width: 0;

  @media screen and (max-width: ${screen.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const SidebarColumn = styled.div`
  align-content: start;
  display: grid;
  gap: var(--space-4);
  min-width: 0;
`;

export const Rail = styled.aside`
  background-color: ${theme.white};
  border: 1px solid ${theme.border};
  border-radius: 6px;
  min-width: 0;
  padding: var(--space-4);
`;

export const RailTitle = styled.h2`
  color: ${theme.black};
  font-size: 21px;
  font-weight: 800;
  line-height: 1.45;
  margin-bottom: var(--space-4);
`;

export const SearchGroup = styled.label`
  color: ${theme.textSecondary};
  display: grid;
  font-size: 12px;
  font-weight: 700;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
`;

export const SearchInput = styled.input`
  background-color: var(--control-bg);
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

export const DocumentList = styled.div`
  display: grid;
  gap: var(--space-2);
`;

export const DocumentButton = styled.button`
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
    color: ${theme.primary};
  }

  &:hover {
    background-color: ${theme.accentSoft};
    border-color: ${theme.primary};
  }
`;

export const DocumentTitle = styled.span`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
`;

export const DocumentMeta = styled.span`
  color: ${theme.textSecondary};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
`;
