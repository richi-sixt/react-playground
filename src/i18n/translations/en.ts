const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.journal': 'Journal',
  'nav.menu': 'Menu',
  'nav.navigation': 'Navigation',

  // Home page
  'home.title': 'React Playground',
  'home.description':
    'A collection of apps, games, experiments, and demos built with React. Explore different React patterns and features.',
  'home.apps': 'Apps',

  // App list
  'filter.all': 'All',
  'filter.games': 'Games',
  'filter.misc': 'Misc',
  'card.readMore': 'Read more',

  // App detail layout
  'appDetail.goToApp': 'Go to app',
  'appDetail.viewOnGithub': 'View on GitHub',
  'appDetail.relatedJournal': 'Related Journal Entries',

  // Journal
  'journal.title': 'Journal',
  'journal.description':
    'Documenting my learnings and journey with React. Notes on patterns, bugs, and discoveries along the way.',

  // Footer
  'footer.builtWith': 'Built with Next.js & React.',

  // 404
  'notFound.title': 'Page not found',
  'notFound.description':
    "Sorry, we couldn't find the page you're looking for.",
  'notFound.goHome': 'Go back home',

  // App detail titles & descriptions
  'app.tic-tac-toe.title': 'Tic Tac Toe',
  'app.tic-tac-toe.description':
    'Classic two-player game with move history and time travel. Built following the official React tutorial.',
  'app.memory-game.title': 'Memory Game',
  'app.memory-game.description':
    'A card-matching memory game with flip animations. Find all 6 matching pairs in as few moves as possible.',

  // Journal detail titles & descriptions
  'journal.hydration-fix.title': 'Fixing Hydration Mismatch in Memory Game',
  'journal.hydration-fix.description':
    'How Math.random() causes SSR hydration errors and the solution using the mounted pattern.',
  'journal.static-export-cpanel.title': 'From Standalone to Static Export: Solving cPanel Process Limits',
  'journal.static-export-cpanel.description':
    'How a Next.js standalone server hit process limits on shared hosting and why static export was the right solution.',

  // Tic Tac Toe (solo)
  'ttt.title': 'Tic Tac Toe',
  'ttt.description':
    'Classic two-player game with move history and time travel. Built following the official React tutorial.',
  'ttt.playMultiplayer': 'Play Multiplayer',
  'ttt.winner': 'Winner: {{mark}}',
  'ttt.nextPlayer': 'Next player: {{mark}}',
  'ttt.goToMove': 'Go to move #{{move}}',
  'ttt.restart': 'Restart game',
  'ttt.moveHistory': 'Move History',

  // Memory Game (solo)
  'memory.title': 'Memory Game',
  'memory.description':
    'Flip cards to find matching pairs. Match all 6 pairs in as few moves as possible.',
  'memory.playMultiplayer': 'Play Multiplayer',
  'memory.moves': 'Moves: {{count}}',
  'memory.pairs': 'Pairs: {{matched}} / {{total}}',
  'memory.newGame': 'New Game',
  'memory.youWon': 'You won in {{moves}} moves!',

  // Multiplayer shared
  'mp.multiplayer': 'Multiplayer',
  'mp.newRoom': 'New Room',
  'mp.creating': 'Creating\u2026',
  'mp.joinRoom': 'Join Room',
  'mp.enterCode': 'Enter code',
  'mp.join': 'Join',
  'mp.joining': 'Joining\u2026',
  'mp.back': '\u2190 Back',
  'mp.shareCode': 'Share this code with your opponent',
  'mp.copied': '\u2713 Copied',
  'mp.copy': 'Copy',
  'mp.waitingForPlayer': 'Waiting for opponent\u2026',
  'mp.youWin': 'You win! \uD83C\uDF89',
  'mp.opponentWins': 'Opponent wins!',
  'mp.draw': 'Draw!',
  'mp.yourTurn': 'Your turn',
  'mp.opponentsTurn': "Opponent's turn\u2026",
  'mp.you': 'You:',
  'mp.opponent': 'Opponent:',

  // Multiplayer errors
  'mp.error.createRoom': 'Could not create room. Please try again.',
  'mp.error.invalidCode': 'Please enter a 6-digit code.',
  'mp.error.roomNotFound': 'Room not found. Check the code.',
  'mp.error.wrongGame': 'This room is for a different game.',
  'mp.error.roomFull':
    'This room is already full or the game has started.',
  'mp.error.joinFailed': 'Failed to join. Please try again.',

  // Multiplayer Tic Tac Toe
  'mp.ttt.title': 'Tic Tac Toe',
  'mp.ttt.description':
    'Play Tic Tac Toe against a friend in real time. Create a room and share the code \u2014 or join an existing room.',
  'mp.ttt.yourTurnMark': 'Your turn ({{mark}})',

  // Multiplayer Memory
  'mp.memory.title': 'Memory Game',
  'mp.memory.description':
    'Play Memory against a friend in real time. Find the most pairs to win!',
  'mp.memory.noMatch': 'No match\u2026',
  'mp.memory.moves': 'Moves: {{count}}',
  'mp.memory.pairs': 'Pairs: {{matched}}/{{total}}',
} as const

export default en
