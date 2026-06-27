import styled from 'styled-components';
import { screen, theme } from '../../../app/styles';

export const FrontDoor = styled.section`
  border-top: 1px solid ${theme.borderSubtle};
  margin-top: var(--space-5);
  padding-top: var(--space-5);
`;

export const FrontDoorIntro = styled.div`
  display: grid;
  gap: var(--space-2);
  justify-items: center;
  margin: var(--space-4) 0 var(--space-6);
  text-align: center;
`;

export const FrontDoorTitle = styled.h2`
  color: ${theme.black};
  font-size: 28px;
  font-weight: 800;
  line-height: 1.35;

  @media screen and (max-width: ${screen.phone}) {
    font-size: 23px;
  }
`;

export const FrontDoorCopy = styled.p`
  color: ${theme.textSecondary};
  font-size: 17px;
  font-weight: 700;
  line-height: 1.65;
`;

export const NoticeBoard = styled.div`
  border: 1px solid ${theme.borderSubtle};
  display: grid;
  margin-bottom: var(--space-5);
`;

export const NoticeRow = styled.div`
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  min-width: 0;

  & + & {
    border-top: 1px solid ${theme.borderSubtle};
  }

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const NoticeIcon = styled.div`
  align-items: center;
  background-color: var(--notice-icon-bg);
  border-right: 1px solid ${theme.borderSubtle};
  color: ${theme.black};
  display: flex;
  font-size: 52px;
  font-weight: 900;
  justify-content: center;
  min-height: 96px;

  @media screen and (max-width: ${screen.phone}) {
    border-bottom: 1px solid ${theme.borderSubtle};
    border-right: 0;
    min-height: 68px;
  }
`;

export const NoticeContent = styled.div`
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-4);
`;

export const NoticeTitle = styled.h3`
  color: ${theme.black};
  font-size: 24px;
  font-weight: 800;
  line-height: 1.35;
`;

export const NoticeText = styled.p`
  color: ${theme.textSecondary};
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
`;

export const NoticeLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
`;

export const NoticeLinkButton = styled.button`
  color: var(--board-link);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.5;
  text-decoration: underline;
  text-underline-offset: 3px;
`;
