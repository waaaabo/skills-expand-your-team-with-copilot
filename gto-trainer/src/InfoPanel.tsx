/**
 * InfoPanel Component - Displays game info, GTO strategy, and statistics
 */

import type { StrategyFrequency } from './gtoData';
import { formatActionName } from './gtoEngine';
import type { Scenario } from './gameUtils';

interface InfoPanelProps {
  scenario: Scenario;
  gtoStrategy: StrategyFrequency | null;
  feedback: {
    score: number;
    comment: string;
    isOptimal: boolean;
  } | null;
  stats: {
    totalHands: number;
    averageScore: number;
    recentAverage: number;
  };
}

const InfoPanel = ({ scenario, gtoStrategy, feedback, stats }: InfoPanelProps) => {
  return (
    <div className="info-panel">
      <div className="info-section">
        <h3>当前局面</h3>
        <div className="info-item">
          <span className="label">位置:</span>
          <span className="value">{scenario.position}</span>
        </div>
        <div className="info-item">
          <span className="label">街次:</span>
          <span className="value">{formatStreet(scenario.street)}</span>
        </div>
        <div className="info-item">
          <span className="label">底池:</span>
          <span className="value">{scenario.potSize} BB</span>
        </div>
        <div className="info-item">
          <span className="label">有效筹码:</span>
          <span className="value">{scenario.effectiveStack} BB</span>
        </div>
      </div>

      {gtoStrategy && (
        <div className="info-section gto-section">
          <h3>GTO 策略建议</h3>
          <div className="strategy-frequencies">
            {Object.entries(gtoStrategy).map(([action, freq]) => (
              freq > 0 && (
                <div key={action} className="frequency-item">
                  <div className="frequency-label">
                    {formatActionName(action as keyof StrategyFrequency)}:
                  </div>
                  <div className="frequency-bar-container">
                    <div
                      className="frequency-bar"
                      style={{ width: `${freq * 100}%` }}
                    />
                    <span className="frequency-value">{Math.round(freq * 100)}%</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div className="info-section feedback-section">
          <h3>本手反馈</h3>
          <div className="score-display">
            <span className="score-label">得分:</span>
            <span className={`score-value ${feedback.isOptimal ? 'optimal' : ''}`}>
              {feedback.score}
            </span>
          </div>
          <div className="feedback-comment">{feedback.comment}</div>
        </div>
      )}

      <div className="info-section stats-section">
        <h3>练习统计</h3>
        <div className="stat-item">
          <span className="stat-label">总题数:</span>
          <span className="stat-value">{stats.totalHands}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">平均分:</span>
          <span className="stat-value">{stats.averageScore.toFixed(1)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">最近5手平均:</span>
          <span className="stat-value">{stats.recentAverage.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

function formatStreet(street: string): string {
  const streets: Record<string, string> = {
    preflop: '翻前',
    flop: '翻牌',
    turn: '转牌',
    river: '河牌',
  };
  return streets[street] || street;
}

export default InfoPanel;
