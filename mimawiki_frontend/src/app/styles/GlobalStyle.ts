import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  :root {
    --surface-primary: #FFFFFF;
    --surface-secondary: #F7F8F6;
    --surface-elevated: #FFFFFF;
    --text-primary: #17211D;
    --text-secondary: #5D6964;
    --text-tertiary: #8A9691;
    --border-default: #DDE5E0;
    --border-subtle: #EDF2EF;
    --accent-primary: #008156;
    --accent-hover: #006E49;
    --accent-soft: #E7F4EF;
    --status-warning: #8A5A00;
    --status-error: #B42318;
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
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
