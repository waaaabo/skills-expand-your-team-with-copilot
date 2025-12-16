/**
 * GTO Strategy Data
 * This file contains simplified GTO strategy data for the poker trainer
 */

export type ActionType = 'fold' | 'call' | 'raise_1_3' | 'raise_1_2' | 'raise_2_3' | 'all_in';

export interface StrategyFrequency {
  fold: number;
  call: number;
  raise_1_3: number;
  raise_1_2: number;
  raise_2_3: number;
  all_in: number;
}

export interface GTOStrategy {
  scenario: string;
  street: 'preflop' | 'flop' | 'turn' | 'river';
  handCategory: string;
  boardTexture?: string;
  strategy: StrategyFrequency;
}

/**
 * Sample GTO strategy database
 * In a real application, this would be a comprehensive database
 * For this prototype, we use simplified sample data
 */
export const gtoStrategyData: GTOStrategy[] = [
  // Preflop - BTN vs BB scenario
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'preflop',
    handCategory: 'premium', // AA, KK, QQ, AKs, AKo
    strategy: {
      fold: 0,
      call: 0,
      raise_1_3: 0.3,
      raise_1_2: 0.5,
      raise_2_3: 0.2,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'preflop',
    handCategory: 'strong', // JJ-TT, AQs, AQo, AJs, KQs
    strategy: {
      fold: 0,
      call: 0.2,
      raise_1_3: 0.4,
      raise_1_2: 0.3,
      raise_2_3: 0.1,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'preflop',
    handCategory: 'medium', // 99-77, AJo, KQo, A9s-A2s, KJs-K9s
    strategy: {
      fold: 0.1,
      call: 0.5,
      raise_1_3: 0.3,
      raise_1_2: 0.1,
      raise_2_3: 0,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'preflop',
    handCategory: 'weak', // Low pairs, suited connectors, weak Ax
    strategy: {
      fold: 0.4,
      call: 0.4,
      raise_1_3: 0.2,
      raise_1_2: 0,
      raise_2_3: 0,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'preflop',
    handCategory: 'trash', // Low offsuit cards, weak hands
    strategy: {
      fold: 0.8,
      call: 0.1,
      raise_1_3: 0.1,
      raise_1_2: 0,
      raise_2_3: 0,
      all_in: 0,
    },
  },
  // Flop strategies
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'flop',
    handCategory: 'top_pair_plus', // Top pair or better
    boardTexture: 'dry',
    strategy: {
      fold: 0,
      call: 0.2,
      raise_1_3: 0.4,
      raise_1_2: 0.3,
      raise_2_3: 0.1,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'flop',
    handCategory: 'draw', // Flush or straight draw
    boardTexture: 'wet',
    strategy: {
      fold: 0.1,
      call: 0.5,
      raise_1_3: 0.2,
      raise_1_2: 0.2,
      raise_2_3: 0,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'flop',
    handCategory: 'weak_pair', // Weak pair or underpair
    boardTexture: 'dry',
    strategy: {
      fold: 0.3,
      call: 0.5,
      raise_1_3: 0.2,
      raise_1_2: 0,
      raise_2_3: 0,
      all_in: 0,
    },
  },
  {
    scenario: 'HU_BTN_vs_BB',
    street: 'flop',
    handCategory: 'air', // Nothing - high card
    boardTexture: 'dry',
    strategy: {
      fold: 0.7,
      call: 0.2,
      raise_1_3: 0.1,
      raise_1_2: 0,
      raise_2_3: 0,
      all_in: 0,
    },
  },
];

/**
 * Get hand category based on hole cards
 */
export function getHandCategory(card1Rank: string, card2Rank: string, suited: boolean): string {
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const getValue = (rank: string) => ranks.indexOf(rank);
  
  const val1 = getValue(card1Rank);
  const val2 = getValue(card2Rank);
  const isPair = val1 === val2;
  const highCard = Math.max(val1, val2);
  const lowCard = Math.min(val1, val2);
  
  // Normalize card order for comparisons (higher card first)
  const [highRank, lowRank] = val1 > val2 ? [card1Rank, card2Rank] : [card2Rank, card1Rank];
  
  // Premium hands
  if (isPair && val1 >= ranks.indexOf('Q')) return 'premium'; // QQ+
  if (highRank === 'A' && lowRank === 'K') return 'premium'; // AK
  
  // Strong hands
  if (isPair && val1 >= ranks.indexOf('T')) return 'strong'; // TT-JJ
  if (highRank === 'A' && (lowRank === 'Q' || lowRank === 'J')) return 'strong'; // AQ, AJ
  if (highRank === 'K' && lowRank === 'Q' && suited) return 'strong'; // KQs
  
  // Medium hands
  if (isPair && val1 >= ranks.indexOf('7')) return 'medium'; // 77-99
  if (highRank === 'A' && suited && lowCard >= ranks.indexOf('2')) return 'medium'; // Any Axs
  if (highRank === 'K' && suited && lowCard >= ranks.indexOf('9')) return 'medium'; // K9s+
  
  // Weak hands
  if (suited && Math.abs(val1 - val2) <= 2 && highCard >= ranks.indexOf('8')) return 'weak'; // Suited connectors
  if (isPair) return 'weak'; // Small pairs
  
  return 'trash';
}
