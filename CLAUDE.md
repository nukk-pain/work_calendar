# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

진료 스케줄러 (Medical Schedule Scheduler) - A PC-only web application for managing hospital doctor schedules with automatic monthly schedule generation and A4 PDF export support. Korean language only, light mode only.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **State Management**: Zustand with persist middleware (localStorage)
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **PDF**: jsPDF + html2canvas
- **Auth**: Google OAuth 2.0 with Google Drive API for data storage
- **Font**: Pretendard (loaded via CDN)

## Architecture

### Routing (`/src/app`)
- `/` - Redirects to current month
- `/[year]/[month]` - Calendar view for specific month (e.g., `/2026/01`)
- `/privacy` - Privacy policy page

### State Management (`/src/stores`)
Three Zustand stores with localStorage persistence:
- `useConfigStore` - Hospital settings, doctors, default schedules, recurring rules, hospital holidays
- `useScheduleStore` - Monthly schedule data with per-day doctor schedules
- `useAuthStore` - Google authentication state

### Key Types (`/src/types/index.ts`)
- `Doctor` - Doctor info with id, name, color, order, active status
- `WeeklySchedule` - Default work hours per day of week
- `RecurringRule` - Recurring off patterns (weekly, biweekly, monthly)
- `MonthSchedule` - Generated monthly schedule with per-day data
- `DoctorDaySchedule` - Daily status (work/off/morning/afternoon) with optional manual edit flag

### Core Logic (`/src/utils`)
- `scheduleGenerator.ts` - Generates monthly schedules from config + recurring rules. Respects `isManualEdit` flag to preserve user edits during regeneration.
- `calendar.ts` - Calendar date calculations
- `holidays.ts` - Public holiday data loading
- `pdfThemes.ts` - PDF export themes (simple, minimal, fancy)
- `googleAuth.ts` / `googleDrive.ts` - Google API integration

### Components (`/src/components`)
- `Calendar.tsx` / `CalendarCell.tsx` - Main calendar grid with inline editing
- `SettingsSidebar.tsx` - Collapsible settings panel with tabs
- `SetupWizard.tsx` - First-time setup flow
- `PdfExportModal.tsx` - PDF export with theme selection
- `ContextMenu.tsx` - Right-click menu for schedule editing
- Settings components in `/settings/` subdirectory

### Static Data (`/src/data`)
- `holidays.json` - Korean public holidays 2024-2028

## Key Concepts

- **Manual Edit Lock**: When a schedule is manually edited (`isManualEdit: true`), it's preserved when regenerating from master patterns
- **Recurring Rules**: Support weekly, biweekly (with reference date), and monthly nth-weekday patterns
- **Time Format**: `HH:MM` with 5-minute increments
- **Non-logged-in Mode**: Uses sessionStorage instead of Google Drive

## Environment Variables

```
GOOGLE_CLIENT_ID=xxx
GOOGLE_API_KEY=xxx
```
