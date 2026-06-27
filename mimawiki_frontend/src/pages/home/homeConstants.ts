export const getEditorName = () => '미림 편집자';

export const formatCount = (value: number) => value.toLocaleString('ko-KR');

export const realtimeKeywords = [
  '전공동아리',
  '프로젝트 발표회',
  '뉴미디어소프트웨어과',
  '미림 급식',
  '교내 해커톤',
] as const;

export const noticeRows = [
  {
    marker: '?',
    title: '미마위키에 처음 오셨나요?',
    text: '먼저 미마위키의 규칙과 자주 하는 실수, 도움말을 확인해 보세요.',
    links: ['미마위키 작성 규칙', '문서 토론'],
  },
  {
    marker: '▰',
    title: '미마위키 게시판',
    text: '공지, 그루터기, 편집 요청, 신고, 문의, 토론 문의를 한곳에서 확인합니다.',
    links: ['공지', '그루터기', '편집 요청', '신고', '문의', '토론 문의'],
  },
  {
    marker: '!',
    title: '권리침해 문의',
    text: '개인정보, 저작권, 초상권 관련 문서는 운영진에게 검토를 요청할 수 있습니다.',
    links: ['권리침해 도움말'],
  },
  {
    marker: '=',
    title: '중재 제도',
    text: '편집 방향이 충돌할 때는 문서 토론에서 근거와 함께 중재를 요청합니다.',
    links: ['게시판'],
  },
  {
    marker: 'V',
    title: '운영진 지원',
    text: '미마위키 운영진은 문서 정리, 신고 처리, 토론 정리를 함께 맡습니다.',
    links: ['지원 안내'],
  },
] as const;
