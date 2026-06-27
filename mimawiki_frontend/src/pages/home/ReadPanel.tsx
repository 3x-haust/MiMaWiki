import { MimaMark } from '../../features/wiki';
import { noticeRows } from './homeConstants';
import {
  CategoryLine,
  FrontDoor,
  FrontDoorCopy,
  FrontDoorIntro,
  FrontDoorTitle,
  InfoDescription,
  InfoRow,
  InfoTable,
  InfoTerm,
  NoticeBoard,
  NoticeContent,
  NoticeIcon,
  NoticeLinkButton,
  NoticeLinks,
  NoticeRow,
  NoticeText,
  NoticeTitle,
  UtilityButton,
  UtilityLinks,
  WikiLinkText,
} from './styles';
import type { WikiSnapshot } from './wikiStore';

type ReadPanelProps = {
  readonly article: WikiSnapshot;
  readonly isFrontPage: boolean;
  readonly onUtilityClick: (target: string) => void;
};

export const ReadPanel = ({
  article,
  isFrontPage,
  onUtilityClick,
}: ReadPanelProps) => (
  <>
    <CategoryLine>
      분류:<WikiLinkText>{article.category}</WikiLinkText>
    </CategoryLine>
    {isFrontPage ? (
      <FrontDoor aria-label="미마위키 대문">
        <FrontDoorIntro>
          <FrontDoorTitle>
            여러분이 가꾸어 나가는 <WikiLinkText>미림의 지식나무</WikiLinkText>
          </FrontDoorTitle>
          <FrontDoorCopy>
            <WikiLinkText>미마위키</WikiLinkText>는
            미림마이스터고등학교판 나무위키입니다. 검증되지 않았거나 편향된
            내용이 있을 수 있습니다.
          </FrontDoorCopy>
        </FrontDoorIntro>
        <NoticeBoard>
          {noticeRows.map((row) => (
            <NoticeRow key={row.title}>
              <NoticeIcon aria-hidden="true">{row.marker}</NoticeIcon>
              <NoticeContent>
                <NoticeTitle>{row.title}</NoticeTitle>
                <NoticeText>{row.text}</NoticeText>
                <NoticeLinks>
                  {row.links.map((link) => (
                    <NoticeLinkButton
                      key={`${row.title}-${link}`}
                      onClick={() => onUtilityClick(link)}
                      type="button"
                    >
                      {link}
                    </NoticeLinkButton>
                  ))}
                </NoticeLinks>
              </NoticeContent>
            </NoticeRow>
          ))}
        </NoticeBoard>
      </FrontDoor>
    ) : null}
    {article.quickLinks !== undefined ? (
      <UtilityLinks aria-label="빠른 문서 링크">
        {article.quickLinks.map((link) => (
          <UtilityButton
            key={`${link.name}-${link.content}`}
            onClick={() => onUtilityClick(link.content)}
            type="button"
          >
            {link.name}
          </UtilityButton>
        ))}
      </UtilityLinks>
    ) : null}
    {article.schoolInfo !== undefined ? (
      <InfoTable aria-label="학교 정보">
        {article.schoolInfo.map((row) => (
          <InfoRow key={row.name}>
            <InfoTerm>{row.name}</InfoTerm>
            <InfoDescription>{row.content}</InfoDescription>
          </InfoRow>
        ))}
      </InfoTable>
    ) : null}
    <MimaMark content={article.renderedContent} />
  </>
);
