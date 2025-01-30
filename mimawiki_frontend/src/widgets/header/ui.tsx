import { styled } from "styled-components";
import { theme, screen } from "../../app/styles";
import { MyPageIcon } from "../../shared/icons";
import { useAuthStore } from "../../features/auth";
import { useState } from "react";
import { AuthModal } from "../../features/auth/user";

const Container = styled.header`
  width: 100%;
  height: 54px;
  padding: 0 4vw;
  background-color: ${theme.primary};
  position: "fixed";
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${theme.white};

  @media screen and (max-width: ${screen.phone}) {
    width: 100vw;
    font-size: 0px;
  }
`;

const NavigationList = styled.ul`
  gap: 4.5vw;
  display: flex;
  align-items: center;
  justify-content: horizontal;

  @media screen and (max-width: ${screen.tablet}) {
    gap: 3vw;
  }

  @media screen and (max-width: ${screen.phone}) {
    gap: 2vw;
  }
`;

const Logo = styled.div`
  cursor: pointer;

  @media screen and (max-width: ${screen.phone}) {
    width: 100%;
  }
`;

const UtilityBox = styled.div`
  display: flex;
  justify-content: horizontal;
  display: flex;
  align-items: center;
  gap: 24px;

  @media screen and (max-width: ${screen.phone}) {
    gap: 10px;
  }
`;


const NavigationButton = styled.div`
    color: ${theme.white};
    font-weight: 600;
    gap: 6px;
    justify-content: vertical;
    align-items: center;
    display: flex;
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  `;


export const Header = () => {
  const { isLoggedIn } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Container>
      <NavigationList>
        <Logo>
          미마위키 로고
        </Logo>
      </NavigationList>
      <UtilityBox>
        {isLoggedIn ? (
            <>
              
            </>
          ) : (
            <>
              <NavigationButton onClick={() => setIsAuthModalOpen(true)}>
                <MyPageIcon />
                로그인
              </NavigationButton>
              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)} />
            </>
          )}
      </UtilityBox>
    </Container>
  );
}