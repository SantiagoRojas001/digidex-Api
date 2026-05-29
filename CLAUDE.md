# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:4200
npm run build      # Production build → dist/
npm test           # Unit tests via Karma/Jasmine
npm run watch      # Dev build in watch mode
```

The dev server proxies `/api` requests to `https://digimon-api.com` via `proxy.conf.json` to avoid CORS issues locally.

## Architecture

Angular 17 + Ionic 7 single-page app. Mobile-first, dark-themed Digimon encyclopedia.

**Data flow**: `DataService` fetches from `/api/v1/digimon?pageSize=50` → `HomeComponent` displays paginated/filtered list → navigates to `/detail/:name` → `DetailComponent` shows full entry.

**Key files:**
- [src/app/servicios/data.service.ts](src/app/servicios/data.service.ts) — sole HTTP service; returns `Observable<Digimon[]>` with `{name, img, level}`
- [src/app/pages/home/](src/app/pages/home/) — list view with search (by name or level), pull-to-refresh, skeleton loading, color-coded level badges
- [src/app/pages/detail/](src/app/pages/detail/) — detail view; receives Digimon name via route param
- [src/app/app-routing.module.ts](src/app/app-routing.module.ts) — two routes: `/home` and `/detail/:name`

**Level → Ionic color mapping** (used across both pages):
Fresh→success, In Training→tertiary, Rookie→primary, Champion→warning, Ultimate→danger, Mega→dark, Ultra→medium, Armor→secondary

## Language

UI text and in-code comments are in Spanish. Match this convention when adding or editing user-facing strings and comments.
