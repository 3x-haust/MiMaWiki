# MiMaWiki Design System

## 1. Atmosphere & Identity

MiMaWiki follows a NamuWiki-like dark document desk: black canvas, dense bordered panels, compact controls, and Mirim identity through restrained green accents. The signature is a wiki main page with school-local content, not a marketing site.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #F2F3F5 | #000000 | Main canvas |
| Surface/secondary | --surface-secondary | #E9ECEF | #111214 | Header, page bands |
| Surface/elevated | --surface-elevated | #FFFFFF | #1B1C1F | Article body, sidebar cards |
| Text/primary | --text-primary | #242629 | #E7E7E7 | Headlines, body |
| Text/secondary | --text-secondary | #555D66 | #A7A7A7 | Metadata, secondary labels |
| Text/tertiary | --text-tertiary | #818892 | #777777 | Disabled, quiet notes |
| Border/default | --border-default | #CCD1D7 | #3B3C40 | Panel borders, dividers |
| Border/subtle | --border-subtle | #E0E4E8 | #2C2D30 | Soft row separators |
| Accent/primary | --accent-primary | #008156 | #008156 | Mirim action, selected state, focus |
| Accent/hover | --accent-hover | #006E49 | #006E49 | Hover state |
| Accent/soft | --accent-soft | #E7F4EF | #0B2A20 | Selected rows, tags |
| Link/wiki | --link-wiki | #B87500 | #F0A000 | NamuWiki-like links |
| Header/background | --header-bg | #008156 | #111214 | Top navigation |
| Header/border | --header-border | #006E49 | #2C2D30 | Header and search separator |
| Header/text | --header-text | #FFFFFF | #E7E7E7 | Top navigation text |
| Control/background | --control-bg | #FFFFFF | #050505 | Search, inputs, textareas |
| Control/hover | --control-hover | #E7F4EF | #232427 | Compact control hover state |
| Category/background | --category-bg | #F6F7F8 | #101112 | Article badges |
| Notice/icon | --notice-icon-bg | #F0F2F4 | #26272A | Main-page notice icon cells |
| School/cell | --school-cell-bg | #DFF1EA | #0D3A2B | Mirim school info table term cells |
| Board/link | --board-link | #008156 | #19C44A | Board-style links |
| Diff/removed | --diff-removed | #B42318 | #FF8A80 | Removed diff text |
| Placeholder/text | --placeholder-text | #818892 | #696969 | Input placeholders |
| Status/warning | --status-warning | #9A6700 | #F0A000 | Caution copy |
| Status/error | --status-error | #B42318 | #FF8A80 | Error copy |

### Rules

- The Mirim green is interactive and identity-bearing.
- Wiki links use --link-wiki when the surface should read like NamuWiki.
- Panels are separated by borders and tonal shifts. No ornamental gradients.
- New colors must be added here before use.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 36px | 800 | 1.2 | 0 | Product title |
| H1 | 42px | 800 | 1.2 | 0 | Article title |
| H2 | 22px | 700 | 1.35 | 0 | Article sections |
| H3 | 18px | 700 | 1.45 | 0 | Panel headings |
| Body/lg | 17px | 400 | 1.7 | 0 | Lead article text |
| Body | 15px | 400 | 1.7 | 0 | Default UI and article text |
| Body/sm | 13px | 500 | 1.5 | 0 | Metadata, buttons |
| Caption | 12px | 600 | 1.4 | 0 | Labels, timestamps |

### Font Stack

- Primary: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace

### Rules

- Body text never drops below 13px.
- Article headings use weight before size for hierarchy.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight icon-to-label |
| --space-2 | 8px | Compact row gap |
| --space-3 | 12px | Input padding |
| --space-4 | 16px | Standard panel padding |
| --space-5 | 20px | Dense section padding |
| --space-6 | 24px | Article padding |
| --space-8 | 32px | Page gutters |
| --space-10 | 40px | Major vertical rhythm |

### Grid

- Max content width: 1784px
- Layout: fluid article plus 360px right sidebar stack
- Breakpoints: phone 768px, tablet 1024px

### Rules

- Wiki controls stay compact and stable.
- Mobile stacks rails above the article; no horizontal scroll.

## 5. Components

### Wiki Shell
- **Structure**: dark header, central article/editor, right sidebar cards for realtime keywords, recent changes, document info, and recent documents.
- **Spacing**: --space-4 for rails, --space-6 for article content.
- **States**: selected document uses --accent-soft; actions use --accent-primary.
- **Accessibility**: native buttons and inputs, visible focus ring.
- **Motion**: hover and focus transitions only.

### BumaWiki-Inspired Function Surfaces
- **Document creation**: compact create form in the article area, saved into the local wiki state.
- **Likes and popularity**: article like toggle updates the selected article and right-side popular ranking.
- **My page**: shows local contributions and liked documents.
- **Wiki engine**: exposes redirect, category index, templates, backlinks, attachments, protection, watchlist, move, delete, and restore controls.

### Document Row
- **Structure**: button containing title, category, timestamp.
- **Spacing**: --space-3 internal padding with --space-2 text gap.
- **States**: default, hover, selected, focus.
- **Accessibility**: active document has aria-pressed.
- **Motion**: background and border color transition over 150ms.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 120ms | ease-out | Button hover, row hover |
| Standard | 180ms | ease-in-out | Mode switch, panel state |

### Rules

- Animate only color, background, border-color, opacity, and transform.
- Respect native reduced motion by keeping transitions non-essential.

## 7. Depth & Surface

### Strategy

borders-only

| Type | Value | Usage |
|------|-------|-------|
| Default | 1px solid var(--border-default) | Panels, buttons, inputs |
| Subtle | 1px solid var(--border-subtle) | Dividers, table rows |

No box-shadow for page structure.
