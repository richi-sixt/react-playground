export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'local' | 'computer'

const DIFFICULTY_RANDOM_CHANCE: Record<Difficulty, number> = {
  easy: 0.6,
  medium: 0.2,
  hard: 0.0,
}

export function calculateWinner(squares: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export function isBoardFull(squares: (string | null)[]): boolean {
  return squares.every((s) => s !== null)
}

function getEmptySquares(squares: (string | null)[]): number[] {
  return squares.reduce<number[]>((acc, val, idx) => {
    if (val === null) acc.push(idx)
    return acc
  }, [])
}

function minimax(
  squares: (string | null)[],
  isMaximizing: boolean,
  depth: number,
): number {
  const winner = calculateWinner(squares)
  if (winner === 'O') return 10 - depth
  if (winner === 'X') return depth - 10
  if (isBoardFull(squares)) return 0

  const empty = getEmptySquares(squares)

  if (isMaximizing) {
    let best = -Infinity
    for (const idx of empty) {
      const next = squares.slice()
      next[idx] = 'O'
      best = Math.max(best, minimax(next, false, depth + 1))
    }
    return best
  } else {
    let best = Infinity
    for (const idx of empty) {
      const next = squares.slice()
      next[idx] = 'X'
      best = Math.min(best, minimax(next, true, depth + 1))
    }
    return best
  }
}

function getBestMove(squares: (string | null)[]): number {
  const empty = getEmptySquares(squares)
  let bestScore = -Infinity
  let bestMove = empty[0]

  for (const idx of empty) {
    const next = squares.slice()
    next[idx] = 'O'
    const score = minimax(next, false, 0)
    if (score > bestScore) {
      bestScore = score
      bestMove = idx
    }
  }

  return bestMove
}

export function getComputerMove(
  squares: (string | null)[],
  difficulty: Difficulty,
): number {
  const empty = getEmptySquares(squares)
  if (empty.length === 0) throw new Error('No empty squares')

  const randomChance = DIFFICULTY_RANDOM_CHANCE[difficulty]
  if (Math.random() < randomChance) {
    return empty[Math.floor(Math.random() * empty.length)]
  }

  return getBestMove(squares)
}
