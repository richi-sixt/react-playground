import { useTranslation, type TranslationKey } from '@/i18n'
import {
  GRID_SIZES,
  THEMES,
  getAvailableGridSizes,
  getThemeById,
} from '@/lib/memory-config'

interface MemorySettingsProps {
  gridSizeId: string
  themeId: string
  onGridSizeChange: (id: string) => void
  onThemeChange: (id: string) => void
  disabled?: boolean
}

export function MemorySettings({
  gridSizeId,
  themeId,
  onGridSizeChange,
  onThemeChange,
  disabled = false,
}: MemorySettingsProps) {
  const { t } = useTranslation()
  const theme = getThemeById(themeId)
  const availableGridSizes = getAvailableGridSizes(theme)

  function handleThemeChange(newThemeId: string) {
    onThemeChange(newThemeId)
    // If the current grid size is too large for the new theme, reset to the
    // largest available size.
    const newTheme = getThemeById(newThemeId)
    const newAvailable = getAvailableGridSizes(newTheme)
    if (!newAvailable.some((g) => g.id === gridSizeId)) {
      onGridSizeChange(newAvailable[newAvailable.length - 1].id)
    }
  }

  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t('memory.gridSize')}
        <select
          value={gridSizeId}
          onChange={(e) => onGridSizeChange(e.target.value)}
          disabled={disabled}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 disabled:opacity-50"
        >
          {GRID_SIZES.map((g) => (
            <option
              key={g.id}
              value={g.id}
              disabled={!availableGridSizes.some((a) => a.id === g.id)}
            >
              {t(g.labelKey as TranslationKey)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t('memory.theme')}
        <select
          value={themeId}
          onChange={(e) => handleThemeChange(e.target.value)}
          disabled={disabled}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 disabled:opacity-50"
        >
          {THEMES.map((th) => (
            <option key={th.id} value={th.id}>
              {t(th.labelKey as TranslationKey)}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
