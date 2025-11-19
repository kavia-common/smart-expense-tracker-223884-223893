# Product Requirements Document (PRD)

## Overview

Ocean Expenses is a modern, web-based expense tracking application focused on personal finance management. It provides users with tools to monitor spending, manage budgets, upload receipts, and gain actionable insights—all powered by a secure Supabase backend and styled with the Ocean Professional theme.

## Target Users

- Individuals and professionals seeking personal budget control.
- Users who prefer real-time analytics and receipt management.
- Users who value privacy and modern, accessible UIs.

## Problem Statement

Managing day-to-day spending and understanding financial health is often fragmented. Users need a centralized place to record expenses, track budget adherence, visualize trends, and securely store supporting receipts.

## Goals

- Simple, secure expense entry and editing.
- Clear visibility into budget utilization and overspending.
- Analytics (category breakdown, timeline trends).
- Paperless receipt upload and management.
- Accessibility and quick response.

## Core Features

- **Authentication & Security**
  - Sign up, login, sign out (email/password via Supabase).
  - Authenticated-only data access; RBAC/Row-Level Security.

- **Expense Management**
  - Add, edit, delete, and filter expenses.
  - Details: amount, category, merchant, date, notes, receipt.
  - Files upload: images/PDF receipts.

- **Budgeting**
  - Set monthly budgets (overall and/or per category).
  - Visualize utilization with progress bars and color cues.

- **Analytics & Insights**
  - Category pie chart, daily/weekly timeline (charts).
  - KPIs: Total spent, remaining budget, recent expenses.

- **Dashboard Experience**
  - Quick-add modals for new expenses and budgets.
  - Recent and high-variance items surfaced automatically.
  - Dashboard blocks and responsive layouts.

- **Accessibility & Usability**
  - Keyboard navigation and labels.
  - Consistent, readable font sizes and color contrast.

- **Theming & UI**
  - Modern Ocean Professional palette (see Style Guide).
  - Responsive sidebar dashboard layout.

- **Preview/Testing**
  - Test data hooks, functional and UI testing support.

## Out-of-Scope (MVP)

- Multi-currency support.
- Team/shared budgets.
- Automated expense import (bank sync).
- Advanced reporting/exports.

## Success Metrics

- Completed onboarding and expense entry in <5 minutes.
- ≥90% of actions available keyboard first.
- Zero PII/secret leakage (static/dynamic analysis).
- >80% unit test coverage.

---
Sources:  
- src/pages, src/services, theme files, supabase SQL docs
