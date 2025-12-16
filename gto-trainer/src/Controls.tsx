/**
 * Controls Component - Action buttons for poker decisions
 */

import type { ActionType } from './gtoData';

interface ControlsProps {
  onAction: (action: ActionType) => void;
  disabled: boolean;
}

const Controls = ({ onAction, disabled }: ControlsProps) => {
  const actions: { action: ActionType; label: string; className: string }[] = [
    { action: 'fold', label: '弃牌 (Fold)', className: 'btn-fold' },
    { action: 'call', label: '跟注 (Call)', className: 'btn-call' },
    { action: 'raise_1_3', label: '加注 1/3 底池', className: 'btn-raise' },
    { action: 'raise_1_2', label: '加注 1/2 底池', className: 'btn-raise' },
    { action: 'raise_2_3', label: '加注 2/3 底池', className: 'btn-raise' },
    { action: 'all_in', label: '全下 (All-in)', className: 'btn-allin' },
  ];

  return (
    <div className="controls-container">
      <h3>选择你的行动</h3>
      <div className="action-buttons">
        {actions.map(({ action, label, className }) => (
          <button
            key={action}
            className={`action-btn ${className}`}
            onClick={() => onAction(action)}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Controls;
