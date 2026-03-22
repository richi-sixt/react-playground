# Simplify Journal Entry i18n — Remove 3-way English Duplication

## Context

English journal entry metadata (title, description, date, tags, etc.) is currently defined in **3 places**:
1. `page.en.mdx` — exports `entry` object
2. `page.tsx` — duplicates the same `entry` const + adds `slug`
3. `i18n/translations/en.ts` — duplicates title & description as translation keys

Goal: Make `page.en.mdx` the **single source of truth** for English metadata. German overrides stay in `de.ts`, falling back to English entry values when a German key isn't defined.

## Changes

### 1. `page.tsx` files — import from MDX instead of duplicating
**Files:** `src/app/journal/hydration-fix/page.tsx`, `src/app/journal/static-export-cpanel/page.tsx`

- Remove the duplicate `entry` const
- Import `{ entry }` from `./page.en.mdx`
- Create `entryWithSlug` by spreading entry + adding `slug`

### 2. Remove journal entry keys from `en.ts`
**File:** `src/i18n/translations/en.ts`

Remove these keys:
- `journal.hydration-fix.title`, `journal.hydration-fix.description`
- `journal.static-export-cpanel.title`, `journal.static-export-cpanel.description`
- `journal.private-submodules.title`, `journal.private-submodules.description`

Keep `journal.title` and `journal.description` (those are the journal listing page heading, not entry-specific).

### 3. Allow extra keys in `de.ts`
**File:** `src/i18n/translations/de.ts`

Change `const de: Record<keyof typeof en, string>` to use `satisfies`:
```typescript
const de = { ... } as const satisfies Record<keyof typeof en, string>
```
This ensures all `en` keys still exist in `de`, but allows `de` to have extra journal keys not in `en`.

### 4. Update `t()` to support fallback parameter
**File:** `src/i18n/index.tsx`

- Widen `t()` key parameter from `TranslationKey` to `string`
- Add optional 3rd `fallback` parameter
- Change translations type to `Record<string, string>` for flexibility
- Logic: `translations[locale][key] ?? translations['en'][key] ?? fallback ?? key`

### 5. Update components to use fallback
**Files:** `src/components/JournalLayout.tsx`, `src/components/JournalList.tsx`

Replace:
```typescript
t(`journal.${entry.slug}.title` as TranslationKey)
```
With:
```typescript
t(`journal.${entry.slug}.title`, undefined, entry.title)
```
Same for `.description`.

## How fallback works

| Locale | German key exists? | Result |
|--------|-------------------|--------|
| English | n/a | No key in `en.ts` → fallback → `entry.title` from `page.en.mdx` |
| German | Yes | Returns German translation from `de.ts` |
| German | No | No key in `de.ts` or `en.ts` → fallback → `entry.title` from `page.en.mdx` |

## Verification

- Run `npm run build` to verify static export still works
- Check journal listing page shows correct English titles
- Check journal detail page shows correct English title
- Toggle to German and verify German translations appear
- Preview both languages in browser
