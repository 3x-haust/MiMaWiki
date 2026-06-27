import styled from 'styled-components';
import { screen, theme } from '../../../app/styles';

export const Panel = styled.section`
  display: grid;
  gap: var(--space-4);
`;

export const PanelTitle = styled.h2`
  border-bottom: 1px solid ${theme.border};
  color: ${theme.black};
  font-size: 22px;
  font-weight: 800;
  line-height: 1.35;
  padding-bottom: var(--space-2);
`;

export const Form = styled.form`
  display: grid;
  gap: var(--space-3);
`;

export const TextArea = styled.textarea`
  background-color: var(--control-bg);
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

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: flex-end;
`;

export const FieldGrid = styled.div`
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FieldLabel = styled.label`
  color: ${theme.textSecondary};
  display: grid;
  font-size: 13px;
  font-weight: 800;
  gap: var(--space-2);
`;

export const TextInput = styled.input`
  background-color: var(--control-bg);
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 15px;
  min-height: 40px;
  padding: 0 var(--space-3);
  width: 100%;
`;

export const PrimaryButton = styled.button`
  background-color: ${theme.primary};
  border: 1px solid ${theme.primary};
  border-radius: 6px;
  color: ${theme.white};
  font-size: 13px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-4);
`;

export const DangerButton = styled.button`
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 13px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-4);
`;

export const SecondaryButton = styled.button`
  border: 1px solid ${theme.border};
  border-radius: 6px;
  color: ${theme.black};
  font-size: 13px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-4);
`;

export const Timeline = styled.div`
  display: grid;
  gap: var(--space-3);
`;

export const TimelineItem = styled.div`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 4px;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-3);
`;

export const TimelineHeader = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: space-between;
`;

export const TimelineTitle = styled.strong`
  color: ${theme.black};
  font-size: 14px;
  line-height: 1.4;
`;

export const TimelineMeta = styled.span`
  color: ${theme.textSecondary};
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
`;

export const DiffBox = styled.div`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  display: grid;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: hidden;
`;

export const DiffLine = styled.pre<{
  readonly $tone: 'added' | 'removed' | 'same';
}>`
  background-color: ${(props) =>
    props.$tone === 'added'
      ? 'rgba(0, 129, 86, 0.12)'
      : props.$tone === 'removed'
        ? 'rgba(190, 18, 60, 0.1)'
        : theme.surfaceSecondary};
  color: ${(props) =>
    props.$tone === 'added'
      ? theme.primary
      : props.$tone === 'removed'
        ? 'var(--diff-removed)'
        : theme.textSecondary};
  margin: 0;
  overflow-wrap: anywhere;
  padding: var(--space-2) var(--space-3);
  white-space: pre-wrap;
`;

export const EmptyState = styled.p`
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  color: ${theme.textSecondary};
  font-size: 13px;
  line-height: 1.5;
  padding: var(--space-3);
`;

export const FeatureGrid = styled.div`
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media screen and (max-width: ${screen.phone}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const FeatureCard = styled.div`
  align-content: start;
  border: 1px solid ${theme.borderSubtle};
  border-radius: 6px;
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  padding: var(--space-4);
`;

export const FeatureCardTitle = styled.h3`
  color: ${theme.black};
  font-size: 18px;
  font-weight: 800;
  line-height: 1.4;
`;

export const FeatureCardMeta = styled.p`
  color: ${theme.textSecondary};
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
`;

export const RankingList = styled.ol`
  display: grid;
  gap: var(--space-2);
`;
