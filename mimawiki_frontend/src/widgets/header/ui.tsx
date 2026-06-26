import { useState, type FormEvent } from "react";
import { useMirimOAuth } from "mirim-oauth-react";
import { styled } from "styled-components";
import { theme, screen } from "../../app/styles";
import { hasMirimOAuthConfig } from "../../features/auth/mirimOAuthConfig";
import { MyPageIcon } from "../../shared/icons";

const Container = styled.header`
  width: 100%;
  min-height: 56px;
  padding: 0 var(--space-8);
  background-color: ${theme.primary};
  border-bottom: 1px solid ${theme.primaryHover};
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.white};

  @media screen and (max-width: ${screen.phone}) {
    padding: var(--space-3) var(--space-4);
    align-items: flex-start;
    gap: var(--space-3);
    flex-direction: column;
  }
`;

const NavigationList = styled.ul`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  @media screen and (max-width: ${screen.tablet}) {
    flex-wrap: wrap;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  font-size: 20px;
  font-weight: 800;
  color: ${theme.white};
`;

const LogoMeta = styled.span`
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 600;
`;

const HeaderNavButton = styled.button`
  border-radius: 6px;
  color: ${theme.white};
  font-size: 14px;
  font-weight: 800;
  min-height: 36px;
  padding: 0 var(--space-2);

  &:hover {
    background-color: rgba(255, 255, 255, 0.16);
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
  color: ${theme.white};
  font-size: 13px;
  font-weight: 600;
`;

const SearchForm = styled.form`
  align-items: center;
  background-color: ${theme.white};
  border-radius: 6px;
  display: flex;
  height: 40px;
  overflow: hidden;
  width: min(360px, 34vw);

  @media screen and (max-width: ${screen.tablet}) {
    width: 260px;
  }

  @media screen and (max-width: ${screen.phone}) {
    width: 100%;
  }
`;

const HeaderSearchInput = styled.input`
  color: ${theme.black};
  flex: 1;
  font-size: 14px;
  min-width: 0;
  padding: 0 var(--space-3);

  &::placeholder {
    color: ${theme.textTertiary};
  }
`;

const NavigationButton = styled.button`
  min-height: 36px;
  padding: 0 var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  color: ${theme.white};
  font-size: 13px;
  font-weight: 700;
  gap: var(--space-2);
  align-items: center;
  display: flex;
  transition: background-color 120ms ease-out, border-color 120ms ease-out;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.16);
    border-color: ${theme.white};
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.72);
    cursor: not-allowed;
    background-color: rgba(255, 255, 255, 0.08);
  }

  @media screen and (max-width: ${screen.phone}) {
    justify-content: center;
    white-space: nowrap;
    width: 100%;
  }
`;

const SearchButton = styled(NavigationButton)`
  border: 0;
  border-left: 1px solid ${theme.borderSubtle};
  border-radius: 0;
  color: ${theme.primary};
  min-height: 40px;

  &:hover:not(:disabled) {
    background-color: ${theme.accentSoft};
    border-color: ${theme.borderSubtle};
  }

  @media screen and (max-width: ${screen.phone}) {
    width: auto;
  }
`;

const dispatchWikiMode = (mode: 'recent' | 'discussion') => {
  window.dispatchEvent(new CustomEvent('mimawiki:mode', { detail: mode }));
};

export const Header = () => {
  const { currentUser, isLoggedIn, isLoading, logIn, logOut } = useMirimOAuth();
  const canUseOAuth = hasMirimOAuthConfig();
  const [headerQuery, setHeaderQuery] = useState('');

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
          <LogoMeta>Mirimi archive</LogoMeta>
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
