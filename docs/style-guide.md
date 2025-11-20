# Style Guide: Ocean Professional

## Theme

- Name: Ocean Professional
- Aesthetic: Modern dashboard with blue and amber accents, rounded corners, subtle shadows, smooth transitions, and subtle gradients
- Layout: Sidebar navigation, sticky top bar, responsive grid content area, modal dialogs for data entry

## Palette

- Primary: #2563EB
- Secondary: #F59E0B
- Error: #EF4444
- Background: #f9fafb
- Surface: #ffffff
- Text: #111827
- Muted: #6b7280

CSS tokens are defined in src/theme/global.css, and a theme object is in src/theme/theme.js.

## Components

- Buttons: .btn (primary), .btn.secondary, .btn.ghost
- Forms: .label, .input, .select, .textarea
- Cards: .card with border and soft shadow
- Progress and skeleton classes for loading and utilization displays
- Toast notifications for user feedback (success/error)

## Accessibility

- Provide labels for all inputs
- Maintain WCAG AA contrast
- Provide keyboard focus styles and test keyboard navigation

---

Sources:
- expense_tracker_frontend/docs/STYLE_GUIDE.md
- expense_tracker_frontend/src/theme/global.css
- expense_tracker_frontend/src/theme/theme.js
