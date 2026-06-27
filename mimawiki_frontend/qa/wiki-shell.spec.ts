import { expect, test, type Page } from '@playwright/test';

const blockedCopy = [
  'ULTRAWORK',
  'WORKING',
  'do not edit files',
  'prompt constraints',
  'Must NOT',
  'failing-first proof',
] as const;

const removedFeatureCopy = [
  '\uCF54\uC778',
  '\uBBF8\uB9C8\uCF54\uC778',
  'MI' + 'MA',
  '\uC9C0\uAC11',
  '\uCD9C\uC11D \uBCF4\uC0C1',
] as const;

const expectRemovedFeatureCopyAbsent = async (page: Page) => {
  const bodyText = await page.locator('body').innerText();
  for (const text of removedFeatureCopy) {
    expect(bodyText).not.toContain(text);
  }
};

const routeWikiStateApi = async (
  page: Page,
  onPersist?: (payload: unknown) => void,
) => {
  await page.route('https://api-mimawiki.mmhs.app/wiki/state', async (route) => {
    if (route.request().method() === 'PUT') {
      onPersist?.(route.request().postDataJSON());
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          data: route.request().postDataJSON(),
          message: '위키 상태 저장 성공',
        }),
      });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          revisions: {},
          discussions: {},
          createdArticles: [],
          likedSlugs: [],
          redirects: {},
          templates: [],
          attachments: [],
          protectedSlugs: [],
          deletedSlugs: [],
          watchlistSlugs: [],
          searchKeywords: { 서버검색어: 7 },
        },
        message: '위키 상태 조회 성공',
      }),
    });
  });
};

test.describe('MiMaWiki shell', () => {
  for (const viewport of [
    { width: 375, height: 812 },
    { width: 768, height: 1024 },
    { width: 1280, height: 900 },
  ] as const) {
    test(`renders responsive wiki shell at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');

      await expect(page).toHaveTitle(/미마위키/);
      await expect(page.getByTestId('wiki-shell')).toBeVisible();
      await expect(page.getByTestId('document-rail')).toContainText('최근 문서');
      await expect(page.getByRole('heading', { name: '미마위키:대문' })).toBeVisible();
      await expect(
        page.getByLabel('미마위키 대문').getByText(/미림마이스터고등학교판 나무위키/),
      ).toBeVisible();
      await expect(page.getByLabel('실시간 검색어')).toContainText('전공동아리');
      await expect(page.getByLabel('최근 변경').last()).toContainText('방금 전');
      await expect(page.getByLabel('미마위키 대문')).toContainText('미마위키 게시판');
      await expect(page.getByLabel('학교 정보')).toContainText('뉴미디어소프트웨어');
      await expect(page.getByLabel('빠른 문서 링크')).toContainText('업데이트 내역');
      await expect(page.getByLabel('문서 지표')).toContainText('조회수');
      await expect(page.getByTestId('metadata-rail')).toContainText('문서 정보');
      await expect(page.getByRole('button', { name: '편집', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: '최근변경' })).toBeVisible();
      await expect(page.getByRole('button', { name: '미림 OAuth 로그인' })).toBeDisabled();
      await expect(page.getByRole('button', { name: '라이트 모드' })).toBeVisible();
      await expect(page.getByLabel('상단 문서 검색')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);

      const bodyText = await page.locator('body').innerText();
      for (const text of blockedCopy) {
        expect(bodyText).not.toContain(text);
      }
      for (const text of removedFeatureCopy) {
        expect(bodyText).not.toContain(text);
      }
    });
  }

  test('document selection updates the article', async ({ page }) => {
    await page.goto('/');

    const documentRail = page.getByTestId('document-rail');
    await documentRail.getByRole('button', { name: /전공동아리/ }).click();

    await expect(page.getByRole('heading', { name: '전공동아리' })).toBeVisible();
    await expect(documentRail.getByRole('button', { name: /전공동아리/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('theme toggle switches to light mode and persists', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: '라이트 모드' })).toBeVisible();
    await page.getByRole('button', { name: '라이트 모드' }).click();
    await expect(page.getByRole('button', { name: '다크 모드' })).toBeVisible();

    const lightState = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      bodyBg: getComputedStyle(document.body).backgroundColor,
    }));
    expect(lightState).toEqual({ theme: 'light', bodyBg: 'rgb(242, 243, 245)' });

    await page.reload();
    await expect(page.getByRole('button', { name: '다크 모드' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '미마위키:대문' })).toBeVisible();
  });

  test('front page utility links move between wiki surfaces', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '방명록' }).click();
    await expect(page.getByRole('heading', { name: '문서 토론' })).toBeVisible();

    await page.getByRole('button', { name: '읽기' }).click();
    await page
      .getByLabel('빠른 문서 링크')
      .getByRole('button', { name: '전공동아리' })
      .click();
    await expect(page.getByRole('heading', { name: '전공동아리' })).toBeVisible();
  });

  test('BumaWiki-style create, like, and mypage surfaces work locally', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '생성' }).click();
    await page.getByLabel('문서 제목').fill('프로젝트 발표회');
    await page.getByLabel('분류').fill('행사');
    await page.getByLabel('설명').fill('미림 프로젝트 발표 기록');
    await page
      .getByLabel('새 문서 내용')
      .fill('== 개요 ==\n미림 프로젝트 발표회 문서입니다.');
    await page.getByRole('button', { name: '문서 생성' }).click();
    await expect(page.getByRole('heading', { name: '프로젝트 발표회' })).toBeVisible();

    await page.getByRole('button', { name: '편집', exact: true }).click();
    await page
      .getByLabel('문서 내용')
      .fill('== 개요 ==\n미림 프로젝트 발표회 문서입니다.\n\n== 기록 ==\n수정 메모');
    await page.getByRole('button', { name: '저장' }).click();
    await expect(page.getByRole('heading', { name: '문서 역사' })).toBeVisible();
    await expect(page.getByTestId('diff-viewer')).toContainText('수정 메모');
    await expect(page.getByTestId('diff-viewer')).not.toContainText(
      '미림마이스터고등학교의 수업',
    );
    await page.getByRole('button', { name: '읽기' }).click();

    await page.getByRole('button', { name: '좋아요' }).click();
    await expect(page.getByRole('button', { name: '좋아요 취소' })).toBeVisible();

    await page.getByRole('button', { name: '마이페이지' }).click();
    await expect(page.getByLabel('마이페이지')).toContainText('내 기여 문서');
    await expect(page.getByLabel('마이페이지')).toContainText('프로젝트 발표회');
    await expect(page.getByLabel('마이페이지')).toContainText('좋아요 문서');
    await expectRemovedFeatureCopyAbsent(page);
  });

  test('editing creates history, diff, discussion, and recent changes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '편집', exact: true }).click();
    await page.getByLabel('문서 내용').fill(
      `== 개요 ==\n미마위키는 미림마이스터고등학교의 첫 대문이다.\n\n== 변경 기록 ==\n테스트 편집 내용`,
    );
    await page.getByRole('button', { name: '저장' }).click();

    await expect(page.getByRole('heading', { name: '문서 역사' })).toBeVisible();
    await expect(page.getByTestId('diff-viewer')).toContainText('+');
    await expect(page.getByLabel('문서 역사').getByText(/r2/)).toBeVisible();

    await page.getByRole('button', { name: '읽기' }).click();
    await expect(page.getByText('테스트 편집 내용')).toBeVisible();

    await page
      .getByTestId('wiki-shell')
      .getByRole('button', { exact: true, name: '토론' })
      .click();
    await page.getByLabel('토론 내용').fill('문서 보강 의견');
    await page.getByRole('button', { name: '등록' }).click();
    await expect(page.getByText('문서 보강 의견')).toBeVisible();

    await page.getByRole('button', { name: '최근변경' }).click();
    await expect(page.getByRole('region', { name: '최근 변경' })).toBeVisible();
    await expect(
      page.getByRole('region', { name: '최근 변경' }).getByText(/미마위키:대문 r2/),
    ).toBeVisible();
  });

  test('header search and navigation controls are wired to the wiki', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('상단 문서 검색').fill('전공');
    await page.getByRole('button', { name: '검색' }).click();
    await expect(
      page.getByTestId('document-rail').getByRole('button', { name: /전공동아리/ }),
    ).toBeVisible();

    await page.getByRole('button', { name: '최근 변경' }).click();
    await expect(page.getByRole('region', { name: '최근 변경' })).toBeVisible();

    await page.getByRole('button', { name: '최근 토론' }).click();
    await expect(page.getByRole('heading', { name: '문서 토론' })).toBeVisible();

    await page.getByRole('button', { name: '특수 기능 ▾' }).click();
    await expect(page.getByRole('heading', { name: '위키 엔진' })).toBeVisible();
    await expectRemovedFeatureCopyAbsent(page);
  });

  test('wiki state loads and persists through the backend api', async ({ page }) => {
    const persistedPayloads: unknown[] = [];
    await routeWikiStateApi(page, (payload) => persistedPayloads.push(payload));

    await page.goto('/');
    await expect(page.getByLabel('실시간 검색어')).toContainText('서버검색어');
    await expect(page.getByTestId('metadata-rail')).toContainText('서버 연결됨');

    await page.getByRole('button', { name: '편집', exact: true }).click();
    await page
      .getByLabel('문서 내용')
      .fill('== 개요 ==\n백엔드 저장 확인 문서입니다.');
    await page.getByRole('button', { name: '저장' }).click();

    await expect.poll(() => persistedPayloads.length).toBeGreaterThan(0);
    expect(JSON.stringify(persistedPayloads[persistedPayloads.length - 1])).toContain(
      '백엔드 저장 확인',
    );
  });

  test('wiki engine functions work from the engine surface', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '엔진' }).click();
    await expect(page.getByRole('heading', { name: '위키 엔진' })).toBeVisible();
    await expect(page.getByLabel('위키 엔진')).toContainText('리다이렉트');
    await expect(page.getByLabel('위키 엔진')).toContainText('분류 색인');
    await expect(page.getByLabel('위키 엔진')).toContainText('템플릿');
    await expect(page.getByLabel('위키 엔진')).toContainText('역링크');
    await expect(page.getByLabel('위키 엔진')).toContainText('첨부');
    await expect(page.getByLabel('위키 엔진')).toContainText('보호');
    await expect(page.getByLabel('위키 엔진')).toContainText('삭제/복구');
    await expect(page.getByLabel('위키 엔진')).toContainText('감시 목록');

    await page.getByLabel('리다이렉트 별칭').fill('대문 별칭');
    await page.getByRole('button', { name: '리다이렉트 추가' }).click();
    await expect(page.getByLabel('위키 엔진')).toContainText('대문 별칭 → 미마위키:대문');

    await page.getByLabel('템플릿 이름').fill('교내 안내');
    await page.getByLabel('템플릿 내용').fill('미림 템플릿 출력');
    await page.getByRole('button', { name: '템플릿 저장' }).click();
    await expect(page.getByLabel('위키 엔진')).toContainText('교내 안내');

    await page.getByLabel('첨부 이름').fill('회의록.pdf');
    await page.getByLabel('첨부 설명').fill('운영 회의 자료');
    await page.getByRole('button', { name: '첨부 추가' }).click();
    await expect(page.getByLabel('위키 엔진')).toContainText('회의록.pdf');

    await page.getByRole('button', { name: '감시 추가' }).click();
    await expect(page.getByLabel('위키 엔진')).toContainText('미마위키:대문 감시 중');

    await page.getByRole('button', { name: '문서 보호' }).click();
    await page.getByRole('button', { name: '편집', exact: true }).click();
    await expect(page.getByRole('heading', { name: '보호된 문서' })).toBeVisible();
    await page.getByRole('button', { name: '엔진' }).click();
    await page.getByRole('button', { name: '보호 해제' }).click();

    await page.getByLabel('새 문서명').fill('미마위키:새 대문');
    await page.getByRole('button', { name: '문서 이동' }).click();
    await expect(page.getByRole('heading', { name: '미마위키:새 대문' })).toBeVisible();

    await page.getByRole('button', { name: '생성' }).click();
    await page.getByLabel('문서 제목').fill('템플릿 테스트');
    await page.getByLabel('분류').fill('검증');
    await page.getByLabel('설명').fill('템플릿 전개 확인');
    await page.getByLabel('새 문서 내용').fill('== 개요 ==\n{{교내 안내}}');
    await page.getByRole('button', { name: '문서 생성' }).click();
    await expect(page.getByText('미림 템플릿 출력')).toBeVisible();

    await page.getByRole('button', { name: '엔진' }).click();
    await page.getByRole('button', { name: '문서 삭제' }).click();
    await expect(page.getByLabel('위키 엔진')).toContainText('템플릿 테스트');
    await page.getByRole('button', { name: '템플릿 테스트 복구' }).click();
    await expect(page.getByRole('heading', { name: '템플릿 테스트' })).toBeVisible();
  });
});
