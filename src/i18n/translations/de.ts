import type en from './en'

const de: Record<keyof typeof en, string> = {
  // Navigation
  'nav.home': 'Startseite',
  'nav.journal': 'Journal',
  'nav.menu': 'Men\u00FC',
  'nav.navigation': 'Navigation',

  // Home page
  'home.title': 'React Playground',
  'home.description':
    'Eine Sammlung von Apps, Spielen, Experimenten und Demos mit React. Entdecke verschiedene React-Patterns und Features.',
  'home.apps': 'Apps',

  // App list
  'filter.all': 'Alle',
  'filter.games': 'Spiele',
  'filter.misc': 'Sonstiges',
  'card.readMore': 'Weiterlesen',

  // App detail layout
  'appDetail.goToApp': 'Zur App',
  'appDetail.viewOnGithub': 'Auf GitHub ansehen',
  'appDetail.relatedJournal': 'Verwandte Journal-Eintr\u00E4ge',

  // Journal
  'journal.title': 'Journal',
  'journal.description':
    'Dokumentation meiner Lernreise mit React. Notizen zu Patterns, Bugs und Entdeckungen.',

  // Footer
  'footer.builtWith': 'Gebaut mit Next.js & React.',

  // 404
  'notFound.title': 'Seite nicht gefunden',
  'notFound.description':
    'Die gesuchte Seite konnte leider nicht gefunden werden.',
  'notFound.goHome': 'Zur Startseite',

  // Tic Tac Toe (solo)
  'ttt.title': 'Tic Tac Toe',
  'ttt.description':
    'Klassisches Zwei-Spieler-Spiel mit Zughistorie und Zeitreise. Erstellt nach dem offiziellen React-Tutorial.',
  'ttt.playMultiplayer': 'Multiplayer spielen',
  'ttt.winner': 'Gewinner: {{mark}}',
  'ttt.nextPlayer': 'N\u00E4chster Spieler: {{mark}}',
  'ttt.goToMove': 'Zu Zug #{{move}}',
  'ttt.restart': 'Neues Spiel',
  'ttt.moveHistory': 'Zughistorie',

  // Memory Game (solo)
  'memory.title': 'Memory',
  'memory.description':
    'Decke Karten auf und finde passende Paare. Finde alle 6 Paare in so wenigen Z\u00FCgen wie m\u00F6glich.',
  'memory.playMultiplayer': 'Multiplayer spielen',
  'memory.moves': 'Z\u00FCge: {{count}}',
  'memory.pairs': 'Paare: {{matched}} / {{total}}',
  'memory.newGame': 'Neues Spiel',
  'memory.youWon': 'Gewonnen in {{moves}} Z\u00FCgen!',

  // Multiplayer shared
  'mp.multiplayer': 'Multiplayer',
  'mp.newRoom': 'Neuer Raum',
  'mp.creating': 'Erstelle\u2026',
  'mp.joinRoom': 'Raum beitreten',
  'mp.enterCode': 'Code eingeben',
  'mp.join': 'Beitreten',
  'mp.joining': 'Trete bei\u2026',
  'mp.back': '\u2190 Zur\u00FCck',
  'mp.shareCode': 'Teile diesen Code mit deinem Mitspieler',
  'mp.copied': '\u2713 Kopiert',
  'mp.copy': 'Kopieren',
  'mp.waitingForPlayer': 'Warte auf Mitspieler\u2026',
  'mp.youWin': 'Du gewinnst! \uD83C\uDF89',
  'mp.opponentWins': 'Gegner gewinnt!',
  'mp.draw': 'Unentschieden!',
  'mp.yourTurn': 'Dein Zug',
  'mp.opponentsTurn': 'Gegner ist dran\u2026',
  'mp.you': 'Du:',
  'mp.opponent': 'Gegner:',

  // Multiplayer errors
  'mp.error.createRoom':
    'Raum konnte nicht erstellt werden. Bitte versuche es erneut.',
  'mp.error.invalidCode': 'Bitte gib einen 6-stelligen Code ein.',
  'mp.error.roomNotFound': 'Raum nicht gefunden. \u00DCberpr\u00FCfe den Code.',
  'mp.error.wrongGame': 'Dieser Raum ist f\u00FCr ein anderes Spiel.',
  'mp.error.roomFull':
    'Dieser Raum ist bereits voll oder das Spiel hat begonnen.',
  'mp.error.joinFailed':
    'Beitreten fehlgeschlagen. Bitte versuche es erneut.',

  // Multiplayer Tic Tac Toe
  'mp.ttt.title': 'Tic Tac Toe',
  'mp.ttt.description':
    'Spiele Tic Tac Toe gegen einen Freund in Echtzeit. Erstelle einen Raum und teile den Code \u2014 oder tritt einem bestehenden Raum bei.',
  'mp.ttt.yourTurnMark': 'Dein Zug ({{mark}})',

  // Multiplayer Memory
  'mp.memory.title': 'Memory',
  'mp.memory.description':
    'Spiele Memory gegen einen Freund in Echtzeit. Finde die meisten Paare, um zu gewinnen!',
  'mp.memory.noMatch': 'Kein Paar\u2026',
  'mp.memory.moves': 'Z\u00FCge: {{count}}',
  'mp.memory.pairs': 'Paare: {{matched}}/{{total}}',
}

export default de
