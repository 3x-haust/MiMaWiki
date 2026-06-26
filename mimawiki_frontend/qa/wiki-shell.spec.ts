import { expect, test } from '@playwright/test';

const blockedCopy = [
  'ULTRAWORK',
  'WORKING',
  'do not edit files',
  'prompt constraints',
  'Must NOT',
  'failing-first proof',
] as const;

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
      await expect(page.getByRole('heading', { name: '미림마이스터고등학교' })).toBeVisible();
      await expect(page.getByLabel('학교 정보')).toContainText('뉴미디어소프트웨어');
      await expect(page.getByLabel('빠른 문서 링크')).toContainText('업데이트 내역');
      await expect(page.getByLabel('문서 지표')).toContainText('조회수');
      await expect(page.getByTestId('metadata-rail')).toContainText('문서 정보');
      await expect(page.getByRole('button', { name: '편집' })).toBeVisible();
      await expect(page.getByRole('button', { name: '최근변경' })).toBeVisible();
      await expect(page.getByRole('button', { name: '미림 OAuth 로그인' })).toBeDisabled();
      await expect(page.getByLabel('상단 문서 검색')).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);

      const bodyText = await page.locator('body').innerText();
      for (const text of blockedCopy) {
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

  test('editing creates history, diff, discussion, and recent changes', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '편집' }).click();
    await page.getByLabel('문서 내용').fill(
      `== 개요 ==\n미림마이스터고등학교는 미마위키의 첫 문서다.\n\n== 변경 기록 ==\n테스트 편집 내용`,
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
    await expect(page.getByRole('heading', { name: '최근 변경' })).toBeVisible();
    await expect(page.getByText(/미림마이스터고등학교 r2/)).toBeVisible();
  });

  test('header search and navigation controls are wired to the wiki', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('상단 문서 검색').fill('전공');
    await page.getByRole('button', { name: '검색' }).click();
    await expect(
      page.getByTestId('document-rail').getByRole('button', { name: /전공동아리/ }),
    ).toBeVisible();

    await page.getByRole('button', { name: '최근 변경' }).click();
    await expect(page.getByRole('heading', { name: '최근 변경' })).toBeVisible();

    await page.getByRole('button', { name: '최근 토론' }).click();
    await expect(page.getByRole('heading', { name: '문서 토론' })).toBeVisible();
  });
});
