/**
 * Game Utilities - Card generation and game state management
 */

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Suit = '♠' | '♥' | '♦' | '♣';

export interface Card {
  rank: Rank;
  suit: Suit;
}

const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const suits: Suit[] = ['♠', '♥', '♦', '♣'];

/**
 * Create a full deck of 52 cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate random hand (2 cards)
 */
export function generateRandomHand(): Card[] {
  const deck = shuffleDeck(createDeck());
  return [deck[0], deck[1]];
}

/**
 * Generate random board based on street
 */
export function generateRandomBoard(
  street: 'preflop' | 'flop' | 'turn' | 'river',
  usedCards: Card[]
): Card[] {
  const deck = shuffleDeck(createDeck());
  
  // Filter out used cards
  const availableDeck = deck.filter(
    (card) =>
      !usedCards.some((used) => used.rank === card.rank && used.suit === card.suit)
  );
  
  const cardCount = {
    preflop: 0,
    flop: 3,
    turn: 4,
    river: 5,
  }[street];
  
  return availableDeck.slice(0, cardCount);
}

/**
 * Check if two cards are suited
 */
export function isSuited(card1: Card, card2: Card): boolean {
  return card1.suit === card2.suit;
}

/**
 * Format card for display
 */
export function formatCard(card: Card): string {
  return `${card.rank}${card.suit}`;
}

/**
 * Get card color based on suit
 */
export function getCardColor(suit: Suit): 'red' | 'black' {
  return suit === '♥' || suit === '♦' ? 'red' : 'black';
}

/**
 * Simple board texture analysis
 */
export function analyzeBoardTexture(board: Card[]): string {
  if (board.length < 3) return 'none';
  
  // Check for flush draw
  const suitCounts = new Map<Suit, number>();
  board.forEach((card) => {
    suitCounts.set(card.suit, (suitCounts.get(card.suit) || 0) + 1);
  });
  const hasFlushDraw = Array.from(suitCounts.values()).some((count) => count >= 3);
  
  // Check for straight possibilities
  const rankValues = board.map((card) => ranks.indexOf(card.rank)).sort((a, b) => a - b);
  const hasConnectedCards = rankValues.some(
    (val, i) => i > 0 && val - rankValues[i - 1] <= 2
  );
  
  // Classify texture
  if (hasFlushDraw || hasConnectedCards) {
    return 'wet';
  }
  return 'dry';
}

/**
 * Generate scenario information
 */
export interface Scenario {
  position: string;
  potSize: number;
  effectiveStack: number;
  street: 'preflop' | 'flop' | 'turn' | 'river';
}

export function generateScenario(): Scenario {
  return {
    position: 'BTN vs BB',
    potSize: 100,
    effectiveStack: 1000,
    street: 'preflop', // Start with preflop
  };
}
