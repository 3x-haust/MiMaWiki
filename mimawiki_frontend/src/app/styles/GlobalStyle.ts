import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  :root {
    --surface-primary: #000000;
    --surface-secondary: #111214;
    --surface-elevated: #1B1C1F;
    --text-primary: #E7E7E7;
    --text-secondary: #A7A7A7;
    --text-tertiary: #777777;
    --border-default: #3B3C40;
    --border-subtle: #2C2D30;
    --accent-primary: #008156;
    --accent-hover: #006E49;
    --accent-soft: #0B2A20;
    --link-wiki: #F0A000;
    --header-bg: #111214;
    --header-border: #2C2D30;
    --header-text: #E7E7E7;
    --control-bg: #050505;
    --control-hover: #232427;
    --category-bg: #101112;
    --notice-icon-bg: #26272A;
    --school-cell-bg: #0D3A2B;
    --board-link: #19C44A;
    --diff-removed: #FF8A80;
    --placeholder-text: #696969;
    --status-warning: #F0A000;
    --status-error: #FF8A80;
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    color-scheme: dark;
  }

  html[data-theme='light'] {
    --surface-primary: #F2F3F5;
    --surface-secondary: #E9ECEF;
    --surface-elevated: #FFFFFF;
    --text-primary: #242629;
    --text-secondary: #555D66;
    --text-tertiary: #818892;
    --border-default: #CCD1D7;
    --border-subtle: #E0E4E8;
    --accent-primary: #008156;
    --accent-hover: #006E49;
    --accent-soft: #E7F4EF;
    --link-wiki: #B87500;
    --header-bg: #008156;
    --header-border: #006E49;
    --header-text: #FFFFFF;
    --control-bg: #FFFFFF;
    --control-hover: #E7F4EF;
    --category-bg: #F6F7F8;
    --notice-icon-bg: #F0F2F4;
    --school-cell-bg: #DFF1EA;
    --board-link: #008156;
    --diff-removed: #B42318;
    --placeholder-text: #818892;
    --status-warning: #9A6700;
    --status-error: #B42318;
    color-scheme: light;
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    margin: 0;
    padding: 0;
    min-width: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-primary);
    background-color: var(--surface-primary);
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: ${theme.primary};
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: 'Pretendard', sans-serif;
  }

  p {
    margin: 0;
    font-family: 'Pretendard', sans-serif;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  button, input, textarea {
    font-family: 'Pretendard', sans-serif;
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  main {
    min-width: 0;
  }

  a:focus {
    outline: 2px solid ${theme.primary};
    outline-offset: 2px;
  }

  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible {
    outline: 2px solid ${theme.primary};
    outline-offset: 2px;
  }

  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Thin.ttf') format('truetype');
    font-weight: 100;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-ExtraLight.ttf') format('truetype');
    font-weight: 200;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Bold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-ExtraBold.ttf') format('truetype');
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/Pretendard-Black.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }
`;

export default GlobalStyles;
