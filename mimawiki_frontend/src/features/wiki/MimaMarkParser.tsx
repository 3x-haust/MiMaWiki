import { Fragment, type ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../app/styles';
import { ArrowIcon } from '../../shared/icons';

export interface MimaMarkProps {
  readonly content: string;
}

const INLINE_PATTERN =
  /\*\*\*(?<boldItalic>.+?)\*\*\*|\*\*(?<bold>.+?)\*\*|\*(?<italic>.+?)\*|__(?<underline>.+?)__|~~(?<strike>.+?)~~|\^\^(?<sup>.+?)\^\^|,,(?<sub>.+?),,|\{\{\{#(?<color>[a-fA-F0-9]{3,6}|[a-zA-Z]+)\s+(?<colorText>.+?)\}\}\}|\{\{\{(?<size>[+-]?[1-5])\s+(?<sizeText>.+?)\}\}\}|\[br\]/g;

const HEADING_PATTERN = /^(={2,6})\s+(.+?)\s+\1$/;
const HEADING_TAGS = ['h2', 'h3', 'h4', 'h5', 'h6'] as const;

const ArticleContent = styled.div`
  color: ${theme.black};
  font-size: 15px;
  line-height: 1.7;
`;

const Paragraph = styled.p`
  margin: 0 0 var(--space-4);
`;

const Spacer = styled.div`
  height: var(--space-2);
`;

const SectionHeading = styled.h2`
  align-items: center;
  border-bottom: 1px solid ${theme.border};
  color: ${theme.black};
  display: flex;
  font-size: 22px;
  font-weight: 800;
  gap: var(--space-2);
  line-height: 1.35;
  margin: var(--space-8) 0 var(--space-4);
  padding-bottom: var(--space-2);
`;

const HeadingNumber = styled.span`
  color: ${theme.primary};
  font-size: 13px;
  font-weight: 800;
`;

const BoldItalic = styled.strong`
  font-style: italic;
`;

const ColorText = styled.span<{ readonly color: string }>`
  color: ${(props) => props.color};
`;

const SizedText = styled.span<{ readonly scale: number }>`
  font-size: ${(props) => props.scale}em;
`;

const renderInline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index;
    const groups = match.groups;

    if (index === undefined || groups === undefined) {
      continue;
    }

    if (index > cursor) {
      nodes.push(
        <Fragment key={`text-${cursor}-${index}`}>
          {text.slice(cursor, index)}
        </Fragment>,
      );
    }

    const key = `${index}-${match[0]}`;
    if (groups.boldItalic !== undefined) {
      nodes.push(<BoldItalic key={key}>{groups.boldItalic}</BoldItalic>);
    } else if (groups.bold !== undefined) {
      nodes.push(<strong key={key}>{groups.bold}</strong>);
    } else if (groups.italic !== undefined) {
      nodes.push(<em key={key}>{groups.italic}</em>);
    } else if (groups.underline !== undefined) {
      nodes.push(<u key={key}>{groups.underline}</u>);
    } else if (groups.strike !== undefined) {
      nodes.push(<del key={key}>{groups.strike}</del>);
    } else if (groups.sup !== undefined) {
      nodes.push(<sup key={key}>{groups.sup}</sup>);
    } else if (groups.sub !== undefined) {
      nodes.push(<sub key={key}>{groups.sub}</sub>);
    } else if (groups.color !== undefined && groups.colorText !== undefined) {
      const color = /^[a-fA-F0-9]{3,6}$/.test(groups.color)
        ? `#${groups.color}`
        : groups.color;
      nodes.push(
        <ColorText color={color} key={key}>
          {groups.colorText}
        </ColorText>,
      );
    } else if (groups.size !== undefined && groups.sizeText !== undefined) {
      nodes.push(
        <SizedText key={key} scale={1 + Number(groups.size) * 0.1}>
          {groups.sizeText}
        </SizedText>,
      );
    } else {
      nodes.push(<br key={key} />);
    }

    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key={`text-${cursor}`}>{text.slice(cursor)}</Fragment>);
  }

  return nodes;
};

const renderHeadingNumber = (
  level: number,
  headingCounts: number[],
): string => {
  const depth = level - 2;

  for (let index = depth + 1; index < headingCounts.length; index += 1) {
    headingCounts[index] = 0;
  }

  headingCounts[depth] += 1;

  return headingCounts
    .slice(0, depth + 1)
    .filter((count) => count > 0)
    .join('.');
};

const renderContent = (content: string): ReactNode[] => {
  const headingCounts = [0, 0, 0, 0, 0];

  return content
    .trim()
    .split('\n')
    .map((rawLine, index) => {
      const line = rawLine.trim();

      if (line.length === 0) {
        return <Spacer key={`space-${index}`} />;
      }

      const heading = HEADING_PATTERN.exec(line);
      if (heading !== null) {
        const level = heading[1].length;
        const tag = HEADING_TAGS[level - 2] ?? 'h2';
        const numbering = renderHeadingNumber(level, headingCounts);

        return (
          <SectionHeading as={tag} key={`heading-${index}`}>
            <ArrowIcon
              direction="down"
              fill={theme.primary}
              height={12}
              width={12}
            />
            <HeadingNumber aria-hidden="true">{numbering}.</HeadingNumber>
            <span>{renderInline(heading[2])}</span>
          </SectionHeading>
        );
      }

      return <Paragraph key={`paragraph-${index}`}>{renderInline(line)}</Paragraph>;
    });
};

export const MimaMark = ({ content }: MimaMarkProps) => {
  return <ArticleContent>{renderContent(content)}</ArticleContent>;
};
