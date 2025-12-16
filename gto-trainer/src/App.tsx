/**
 * Main App Component - GTO Poker Strategy Trainer
 */

import React, { useState, useEffect } from 'react';
import Table from './Table';
import Controls from './Controls';
import InfoPanel from './InfoPanel';
import { generateRandomHand, generateRandomBoard, isSuited, type Card, generateScenario, type Scenario } from './gameUtils';
import { getGtoStrategy, evaluateAction, type ActionType, type StrategyFrequency } from './gtoEngine';
import './App.css';

interface GameState {
  hand: Card[];
  board: Card[];
  scenario: Scenario;
  gtoStrategy: StrategyFrequency | null;
  feedback: {
    score: number;
    comment: string;
    isOptimal: boolean;
  } | null;
  actionMade: boolean;
}

interface Stats {
  totalHands: number;
  totalScore: number;
  recentScores: number[];
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    hand: [],
    board: [],
    scenario: generateScenario(),
    gtoStrategy: null,
    feedback: null,
    actionMade: false,
  });

  const [stats, setStats] = useState<Stats>({
    totalHands: 0,
    totalScore: 0,
    recentScores: [],
  });

  // Initialize first hand on mount
  useEffect(() => {
    startNewHand();
  }, []);

  const startNewHand = () => {
    const hand = generateRandomHand();
    const scenario = generateScenario();
    const board = generateRandomBoard(scenario.street, hand);

    // Get GTO strategy
    const suited = isSuited(hand[0], hand[1]);
    const strategy = getGtoStrategy(
      'HU_BTN_vs_BB',
      scenario.street,
      hand[0].rank,
      hand[1].rank,
      suited
    );

    setGameState({
      hand,
      board,
      scenario,
      gtoStrategy: strategy,
      feedback: null,
      actionMade: false,
    });
  };

  const handleAction = (action: ActionType) => {
    if (gameState.actionMade || !gameState.gtoStrategy) return;

    // Evaluate the action
    const evaluation = evaluateAction(gameState.gtoStrategy, action);

    // Update stats
    const newRecentScores = [...stats.recentScores, evaluation.score].slice(-5);
    setStats({
      totalHands: stats.totalHands + 1,
      totalScore: stats.totalScore + evaluation.score,
      recentScores: newRecentScores,
    });

    // Update game state with feedback
    setGameState({
      ...gameState,
      feedback: evaluation,
      actionMade: true,
    });
  };

  const calculateStats = () => {
    const averageScore = stats.totalHands > 0 ? stats.totalScore / stats.totalHands : 0;
    const recentAverage =
      stats.recentScores.length > 0
        ? stats.recentScores.reduce((a, b) => a + b, 0) / stats.recentScores.length
        : 0;

    return {
      totalHands: stats.totalHands,
      averageScore,
      recentAverage,
    };
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>德州扑克 GTO 策略练习器</h1>
        <div className="header-info">
          <span className="mode-badge">练习模式</span>
          <button
            className="next-hand-btn"
            onClick={startNewHand}
          >
            {gameState.actionMade ? '下一手' : '重新开始'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="game-area">
          <Table board={gameState.board} hand={gameState.hand} />
          <Controls
            onAction={handleAction}
            disabled={gameState.actionMade}
          />
        </div>

        <InfoPanel
          scenario={gameState.scenario}
          gtoStrategy={gameState.gtoStrategy}
          feedback={gameState.feedback}
          stats={calculateStats()}
        />
      </main>
    </div>
  );
}

export default App;
