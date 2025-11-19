# UI Style Guide: Ocean Professional Theme

## Visual Theme

- **Name:** Ocean Professional
- **Theme:** Modern, dashboard layout
- **Style highlights:**  
  - Clean, minimalist backgrounds
  - Subtle gradients and soft drop shadows
  - Rounded borders for cards and modals
  - Responsive and mobile-friendly

## Color Palette

| Role      | Color     |
|-----------|-----------|
| Primary   | #2563EB   |
| Secondary | #F59E0B   |
| Success   | #10b981   |
| Error     | #EF4444   |
| Background| #f9fafb   |
| Surface   | #ffffff   |
| Text      | #111827   |
| Muted     | #6b7280   |

Background gradients as per `global.css`:

`linear-gradient(135deg, rgba(59,130,246,0.12), rgba(249,250,251,1))`

## Layout 

- **Sidebar:** Fixed, left-aligned, showing logo and main sections in a vertical list.
- **Topbar:** Sticky for context and quick actions/logout.
- **Main Panel:** Grid blocks for KPIs and quick actions.
- **Modals:** Centrally positioned for data entry.

## Components

- Use `.btn`, `.btn.secondary`, and `.btn.ghost` for actions.
- Consistent `.card` style for panels, with subtle border and shadow.
- Form fields use `.input`, `.select`, `.label` for clarity and accessibility.

## Font & Typography

- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', ...`
- Large, bold headings; subdued, muted notes for helper text.

## Accessibility

- All fields labeled.
- Contrast conforms to WCAG AA+.
- Keyboard navigation supported for all actions.

## Source References

- `src/theme/global.css` (CSS custom properties)
- `src/theme/theme.js` (theme object)
- Live use in `src/pages/`, `src/components/`

---

> For any new component, follow these conventions:  
> - Adhere to color roles (e.g. use `var(--primary)`)
> - Use existing classes for cards, buttons, input fields
> - Ensure sufficient contrast and focus indication
> - Prefer readable sizes (min 14px body, 18px headings)
> - Test on multiple devices/screen sizes

---
Sources:  
- theme/global.css, theme.js, style guide in project context, layout in AppRouter/pages/components, README.md
