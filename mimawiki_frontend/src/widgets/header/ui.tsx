import { useEffect, useState, type FormEvent } from "react";
import { useMirimOAuth } from "mirim-oauth-react";
import { styled } from "styled-components";
import { theme, screen } from "../../app/styles";
import { hasMirimOAuthConfig } from "../../features/auth/mirimOAuthConfig";
import { MyPageIcon } from "../../shared/icons";

const Container = styled.header`
  width: 100%;
  min-height: 72px;
  padding: 0 44px;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.white};

  @media screen and (max-width: ${screen.tablet}) {
    padding: var(--space-3) var(--space-5);
    align-items: flex-start;
    gap: var(--space-3);
    flex-direction: column;
  }

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-3) var(--space-4);
  }
`;

const NavigationList = styled.ul`
  display: flex;
  align-items: center;
  gap: var(--space-5);

  @media screen and (max-width: ${screen.tablet}) {
    flex-wrap: wrap;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: 23px;
  font-weight: 800;
  color: var(--header-text);
  letter-spacing: 0;
`;

const LogoMeta = styled.span`
  color: color-mix(in srgb, var(--header-text) 82%, var(--accent-primary));
  font-size: 12px;
  font-weight: 800;
`;

const HeaderNavButton = styled.button`
  border-radius: 6px;
  color: var(--header-text);
  font-size: 16px;
  font-weight: 800;
  min-height: 42px;
  padding: 0 var(--space-2);

  &:hover {
    background-color: color-mix(in srgb, var(--header-text) 12%, transparent);
  }
`;

const UtilityBox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  @media screen and (max-width: ${screen.phone}) {
    align-items: stretch;
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }
`;

const UserName = styled.span`
  color: var(--header-text);
  font-size: 13px;
  font-weight: 600;
`;

const SearchForm = styled.form`
  align-items: center;
  background-color: var(--control-bg);
  border: 1px solid var(--header-border);
  border-radius: 6px;
  display: flex;
  height: 52px;
  overflow: hidden;
  width: min(430px, 34vw);

  @media screen and (max-width: ${screen.tablet}) {
    width: min(520px, 100%);
  }

  @media screen and (max-width: ${screen.phone}) {
    width: 100%;
  }
`;

const HeaderSearchInput = styled.input`
  background-color: var(--control-bg);
  color: ${theme.black};
  flex: 1;
  font-size: 16px;
  min-width: 0;
  padding: 0 var(--space-4);

  &::placeholder {
    color: var(--placeholder-text);
  }
`;

const NavigationButton = styled.button`
  min-height: 42px;
  padding: 0 var(--space-3);
  border: 1px solid color-mix(in srgb, var(--header-text) 36%, transparent);
  border-radius: 6px;
  color: var(--header-text);
  font-size: 13px;
  font-weight: 700;
  gap: var(--space-2);
  align-items: center;
  display: flex;
  transition: background-color 120ms ease-out, border-color 120ms ease-out;

  &:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--header-text) 12%, transparent);
    border-color: color-mix(in srgb, var(--header-text) 60%, transparent);
  }

  &:disabled {
    color: color-mix(in srgb, var(--header-text) 72%, transparent);
    cursor: not-allowed;
    background-color: color-mix(in srgb, var(--header-text) 8%, transparent);
  }

  @media screen and (max-width: ${screen.phone}) {
    justify-content: center;
    white-space: nowrap;
    width: 100%;
  }
`;

const SearchButton = styled(NavigationButton)`
  border: 0;
  border-left: 1px solid var(--header-border);
  border-radius: 0;
  color: ${theme.black};
  min-height: 52px;
  padding: 0 var(--space-4);

  &:hover:not(:disabled) {
    background-color: var(--accent-soft);
    border-color: var(--header-border);
  }

  @media screen and (max-width: ${screen.phone}) {
    width: auto;
  }
`;

const ThemeToggleButton = styled(NavigationButton)`
  font-weight: 800;
`;

type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'mimawiki:theme-mode';

const readStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
};

const dispatchWikiMode = (mode: 'recent' | 'discussion' | 'coin') => {
  window.dispatchEvent(new CustomEvent('mimawiki:mode', { detail: mode }));
};

export const Header = () => {
  const { currentUser, isLoggedIn, isLoading, logIn, logOut } = useMirimOAuth();
  const canUseOAuth = hasMirimOAuthConfig();
  const [headerQuery, setHeaderQuery] = useState('');
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredTheme);
  const nextThemeMode = themeMode === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const handleLogin = () => {
    if (canUseOAuth) {
      void logIn();
    }
  };

  const handleLogout = () => {
    void logOut();
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.dispatchEvent(
      new CustomEvent('mimawiki:search', { detail: headerQuery.trim() }),
    );
  };

  return (
    <Container>
      <NavigationList>
        <Logo>
          미마위키
          <LogoMeta>Mirim Meister wiki</LogoMeta>
        </Logo>
        <HeaderNavButton
          onClick={() => dispatchWikiMode('recent')}
          type="button"
        >
          최근 변경
        </HeaderNavButton>
        <HeaderNavButton
          onClick={() => dispatchWikiMode('discussion')}
          type="button"
        >
          최근 토론
        </HeaderNavButton>
        <HeaderNavButton onClick={() => dispatchWikiMode('coin')} type="button">
          특수 기능 ▾
        </HeaderNavButton>
      </NavigationList>
      <UtilityBox>
        <SearchForm onSubmit={handleSearch}>
          <HeaderSearchInput
            aria-label="상단 문서 검색"
            onChange={(event) => setHeaderQuery(event.currentTarget.value)}
            placeholder="여기에서 검색"
            type="search"
            value={headerQuery}
          />
          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>
        <ThemeToggleButton
          onClick={() => setThemeMode(nextThemeMode)}
          type="button"
        >
          {themeMode === 'dark' ? '라이트 모드' : '다크 모드'}
        </ThemeToggleButton>
        {isLoggedIn ? (
          <>
            <UserName>{currentUser?.nickname ?? currentUser?.email}</UserName>
            <NavigationButton type="button" onClick={handleLogout}>
              로그아웃
            </NavigationButton>
          </>
        ) : (
          <NavigationButton
            type="button"
            disabled={!canUseOAuth || isLoading}
            onClick={handleLogin}
            title="미림 OAuth 로그인"
          >
            <MyPageIcon />
            {isLoading ? '확인 중' : '미림 OAuth 로그인'}
          </NavigationButton>
        )}
      </UtilityBox>
    </Container>
  );
}
