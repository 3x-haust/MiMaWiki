export type WikiInfoRow = {
  readonly name: string;
  readonly content: string;
};

export type WikiArticle = {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly updatedAt: string;
  readonly editor: string;
  readonly summary: string;
  readonly viewCount: number;
  readonly likeCount: number;
  readonly contributors: readonly string[];
  readonly quickLinks?: readonly WikiInfoRow[];
  readonly schoolInfo?: readonly WikiInfoRow[];
  readonly content: string;
};

export const initialArticles: readonly WikiArticle[] = [
  {
    slug: 'mirim-meister-high-school',
    title: '미마위키:대문',
    category: '미마위키',
    updatedAt: '2026-06-26 16:09:45',
    editor: '학생회 기록팀',
    summary: '미림마이스터고등학교판 나무위키.',
    viewCount: 8156,
    likeCount: 156,
    contributors: ['학생회 기록팀', '소프트웨어과 편집자', '디자인과 편집자'],
    quickLinks: [
      { name: '업데이트 내역', content: '미마위키 작성 규칙' },
      { name: '방명록', content: '문서 토론' },
      { name: '전공동아리', content: '전공동아리' },
    ],
    schoolInfo: [
      { name: '교훈', content: '성실, 창의, 협동' },
      { name: '유형', content: '마이스터고등학교' },
      { name: '분야', content: '뉴미디어소프트웨어, 뉴미디어웹솔루션, 뉴미디어디자인' },
      { name: '성별', content: '여학교' },
      { name: '주소', content: '서울특별시 관악구 호암로 546' },
      { name: '대표 색상', content: '#008156' },
    ],
    content: `== 개요 ==
미마위키는 미림마이스터고등학교의 수업, 동아리, 학교 생활, 프로젝트 기록을 모으는 학교판 나무위키다.

== 안내 ==
미마위키는 미림 학생이라면 누구나 기여할 수 있는 학교 위키다. 검증되지 않았거나 편향된 내용이 있을 수 있으므로, 문서를 읽고 편집할 때는 출처와 맥락을 함께 확인한다.

== 미마위키에서의 표기 ==
공식 명칭은 **미림마이스터고등학교**로 적고, 문서 제목에는 줄임말보다 전체 이름을 우선한다.

== 관련 문서 ==
전공동아리, 프로젝트 발표회, 학교 생활 문서와 함께 읽으면 좋다.`,
  },
  {
    slug: 'major-clubs',
    title: '전공동아리',
    category: '생활',
    updatedAt: '2026.06.21',
    editor: '동아리 연합',
    summary: '프로젝트, 디자인, 개발 문화를 만드는 학생 주도 활동.',
    viewCount: 3204,
    likeCount: 88,
    contributors: ['동아리 연합', '프론트엔드 편집자'],
    quickLinks: [
      { name: '학교 대문', content: '미마위키:대문' },
      { name: '작성 규칙', content: '미마위키 작성 규칙' },
    ],
    content: `== 개요 ==
전공동아리는 수업 밖에서 프로젝트를 만들고 발표하는 미림의 핵심 문화다.

== 운영 방식 ==
동아리마다 모집 시기와 활동 방식이 다르므로 최신 공지는 각 동아리 문서에 적는다.

== 작성 규칙 ==
홍보 문구보다 활동 기록, 산출물, 사용 기술을 우선한다.`,
  },
  {
    slug: 'mimawiki-rules',
    title: '미마위키 작성 규칙',
    category: '운영',
    updatedAt: '2026.06.18',
    editor: '운영진',
    summary: '학교 위키답게 검증 가능한 기록만 남기는 규칙.',
    viewCount: 1092,
    likeCount: 42,
    contributors: ['운영진', '검수 담당'],
    quickLinks: [
      { name: '학교 대문', content: '미마위키:대문' },
      { name: '전공동아리', content: '전공동아리' },
    ],
    content: `== 기본 원칙 ==
미마위키는 학교 생활을 오래 남기는 기록장이다. 소문, 개인정보, 확인되지 않은 평가는 적지 않는다.

== 문체 ==
문장은 짧게 쓴다. 정보는 표제어, 개요, 관련 문서 순서로 정리한다.

== 색상 문법 ==
강조가 필요하면 {{{#008156 미림 초록}}}을 사용한다.`,
  },
];
