import styled from 'styled-components';
import { theme } from '../../../app/styles';

export const MetadataList = styled.dl`
  display: grid;
  gap: var(--space-3);
`;

export const MetadataRow = styled.div`
  border-top: 1px solid ${theme.borderSubtle};
  display: grid;
  gap: var(--space-1);
  padding-top: var(--space-3);
`;

export const MetadataTerm = styled.dt`
  color: ${theme.textTertiary};
  font-size: 12px;
  font-weight: 700;
`;

export const MetadataDescription = styled.dd`
  color: ${theme.black};
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
`;

export const SidebarList = styled.ol`
  display: grid;
  gap: var(--space-3);
`;

export const SidebarListItem = styled.li`
  align-items: baseline;
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 28px minmax(0, 1fr);
  min-width: 0;
`;

export const SidebarRank = styled.span`
  color: ${theme.black};
  font-size: 16px;
  font-weight: 800;
  text-align: center;
`;

export const SidebarLinkButton = styled.button`
  color: var(--link-wiki);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.45;
  min-width: 0;
  overflow-wrap: anywhere;
  text-align: left;
`;

export const RecentChangeRow = styled.button`
  align-items: center;
  display: grid;
  gap: var(--space-2);
  grid-template-columns: minmax(0, 1fr) max-content;
  min-width: 0;
  text-align: left;
`;

export const RecentChangeTitle = styled.span`
  color: var(--link-wiki);
  font-size: 16px;
  font-weight: 800;
  line-height: 1.5;
  min-width: 0;
  overflow-wrap: anywhere;
`;

export const RecentChangeTime = styled.span`
  color: ${theme.textSecondary};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;
