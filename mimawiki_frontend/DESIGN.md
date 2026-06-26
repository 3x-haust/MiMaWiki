# MiMaWiki Design System

## 1. Atmosphere & Identity

MiMaWiki feels like a school archive desk: fast to scan, plain enough for daily edits, and unmistakably Mirim through one restrained green accent. The signature is document-first density with crisp dividers and small operational controls.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
|------|-------|-------|------|-------|
| Surface/primary | --surface-primary | #FFFFFF | #111513 | Main canvas |
| Surface/secondary | --surface-secondary | #F7F8F6 | #171D1A | Sidebars, quiet panels |
| Surface/elevated | --surface-elevated | #FFFFFF | #1C241F | Header, article body, popovers |
| Text/primary | --text-primary | #17211D | #F3F7F4 | Headlines, body |
| Text/secondary | --text-secondary | #5D6964 | #B5C0BA | Metadata, secondary labels |
| Text/tertiary | --text-tertiary | #8A9691 | #7E8A84 | Disabled, quiet notes |
| Border/default | --border-default | #DDE5E0 | #2B3731 | Panel borders, dividers |
| Border/subtle | --border-subtle | #EDF2EF | #202A25 | Soft row separators |
| Accent/primary | --accent-primary | #008156 | #00A06B | Primary action, links, focus |
| Accent/hover | --accent-hover | #006E49 | #22B884 | Hover state |
| Accent/soft | --accent-soft | #E7F4EF | #102D23 | Selected rows, tags |
| Status/warning | --status-warning | #8A5A00 | #F0B429 | Caution copy |
| Status/error | --status-error | #B42318 | #FF8A80 | Error copy |

### Rules

- The Mirim green is interactive, not decorative.
- Panels are separated by borders and tonal shifts. No ornamental gradients.
- New colors must be added here before use.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| Display | 32px | 800 | 1.2 | 0 | Product title |
| H1 | 28px | 800 | 1.25 | 0 | Article title |
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

- Max content width: 1440px
- Layout: 280px left rail, fluid article, 260px right rail
- Breakpoints: phone 768px, tablet 1024px

### Rules

- Wiki controls stay compact and stable.
- Mobile stacks rails above the article; no horizontal scroll.

## 5. Components

### Wiki Shell
- **Structure**: header, left document rail, central article/editor, right metadata rail.
- **Spacing**: --space-4 for rails, --space-6 for article content.
- **States**: selected document uses --accent-soft; actions use --accent-primary.
- **Accessibility**: native buttons and inputs, visible focus ring.
- **Motion**: hover and focus transitions only.

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
