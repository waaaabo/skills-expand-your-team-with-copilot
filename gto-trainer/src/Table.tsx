/**
 * Table Component - Displays the poker table with board and hand cards
 */

import React from 'react';
import Card from './Card';
import type { Card as CardType } from './gameUtils';

interface TableProps {
  board: CardType[];
  hand: CardType[];
}

const Table: React.FC<TableProps> = ({ board, hand }) => {
  return (
    <div className="table-container">
      <div className="board-section">
        <h3>公共牌</h3>
        <div className="card-row">
          {board.length > 0 ? (
            board.map((card, index) => <Card key={index} card={card} />)
          ) : (
            <div className="empty-board">翻前 - 暂无公共牌</div>
          )}
        </div>
      </div>
      
      <div className="hand-section">
        <h3>你的手牌</h3>
        <div className="card-row">
          {hand.map((card, index) => (
            <Card key={index} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
