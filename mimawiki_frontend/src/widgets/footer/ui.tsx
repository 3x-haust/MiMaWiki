import { styled } from "styled-components";
import { theme } from "../../app/styles";

const FooterBar = styled.footer`
  border-top: 1px solid ${theme.border};
  color: ${theme.textSecondary};
  font-size: 12px;
  padding: var(--space-4) var(--space-8);

  @media screen and (max-width: 768px) {
    padding: var(--space-4);
  }
`;

export const Footer = () => {
  return (
    <FooterBar>MiMaWiki · Mirim Meister High School archive</FooterBar>
  );
}
