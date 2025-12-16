/**
 * GTO Engine - Strategy evaluation and scoring
 */

import { gtoStrategyData, type ActionType, type StrategyFrequency, getHandCategory } from './gtoData';

/**
 * Get GTO strategy for a given scenario
 */
export function getGtoStrategy(
  scenario: string,
  street: 'preflop' | 'flop' | 'turn' | 'river',
  card1Rank: string,
  card2Rank: string,
  suited: boolean,
  boardTexture?: string
): StrategyFrequency | null {
  // For preflop, determine hand category
  let handCategory: string;
  
  if (street === 'preflop') {
    handCategory = getHandCategory(card1Rank, card2Rank, suited);
  } else {
    // For postflop, we'd need more sophisticated logic
    // For this prototype, we'll use simplified categories
    handCategory = boardTexture || 'top_pair_plus';
  }

  // Find matching strategy
  const strategy = gtoStrategyData.find(
    (s) =>
      s.scenario === scenario &&
      s.street === street &&
      s.handCategory === handCategory
  );

  return strategy ? strategy.strategy : null;
}

/**
 * Evaluate player action and return score and feedback
 */
export function evaluateAction(
  strategy: StrategyFrequency,
  action: ActionType
): { score: number; comment: string; isOptimal: boolean } {
  const frequency = strategy[action];
  
  // Calculate score based on frequency (0-100)
  const score = Math.round(frequency * 100);
  
  // Find the highest frequency action(s)
  const actions = Object.entries(strategy) as [ActionType, number][];
  const maxFreq = Math.max(...actions.map(([_, freq]) => freq));
  const optimalActions = actions.filter(([_, freq]) => freq === maxFreq).map(([act]) => act);
  
  const isOptimal = optimalActions.includes(action);
  
  // Generate feedback
  let comment = '';
  if (frequency >= 0.4) {
    comment = '非常好！这是一个高频率的GTO决策。';
  } else if (frequency >= 0.2) {
    comment = '不错，这个决策在GTO范围内。';
  } else if (frequency > 0) {
    comment = '可接受，但这不是最常见的GTO决策。';
  } else {
    comment = '这个决策在GTO策略中频率为零，可能太激进或太保守。';
  }
  
  // Add comparison to optimal
  if (isOptimal) {
    comment += ' 这是最优决策之一！';
  } else {
    const optimalActionNames = optimalActions.map(formatActionName).join('或');
    comment += ` GTO最常建议: ${optimalActionNames}。`;
  }
  
  return { score, comment, isOptimal };
}

/**
 * Format action name for display
 */
export function formatActionName(action: ActionType): string {
  const names: Record<ActionType, string> = {
    fold: '弃牌',
    call: '跟注',
    raise_1_3: '加注 1/3 底池',
    raise_1_2: '加注 1/2 底池',
    raise_2_3: '加注 2/3 底池',
    all_in: '全下',
  };
  return names[action] || action;
}

/**
 * Get EV (Expected Value) estimate
 * This is a simplified calculation for demonstration
 */
export function getEVEstimate(strategy: StrategyFrequency, action: ActionType): number {
  // In a real implementation, this would calculate actual EV based on pot odds, equity, etc.
  // For this prototype, we use frequency as a proxy for EV
  return strategy[action];
}
