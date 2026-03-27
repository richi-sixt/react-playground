import { useTranslation } from '@/i18n'
import type { Difficulty, GameMode } from '@/lib/tic-tac-toe-ai'

interface TicTacToeSettingsProps {
  mode: GameMode
  difficulty: Difficulty
  onModeChange: (mode: GameMode) => void
  onDifficultyChange: (difficulty: Difficulty) => void
  disabled?: boolean
}

export function TicTacToeSettings({
  mode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  disabled = false,
}: TicTacToeSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {t('ttt.mode')}
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as GameMode)}
          disabled={disabled}
          className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 disabled:opacity-50"
        >
          <option value="local">{t('ttt.vsPlayer')}</option>
          <option value="computer">{t('ttt.vsComputer')}</option>
        </select>
      </label>

      {mode === 'computer' && (
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t('ttt.difficulty')}
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            disabled={disabled}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 disabled:opacity-50"
          >
            <option value="easy">{t('ttt.difficulty.easy')}</option>
            <option value="medium">{t('ttt.difficulty.medium')}</option>
            <option value="hard">{t('ttt.difficulty.hard')}</option>
          </select>
        </label>
      )}
    </div>
  )
}
