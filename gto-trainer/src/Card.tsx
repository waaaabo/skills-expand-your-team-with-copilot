/**
 * Card Component - Displays a single poker card
 */

import type { Card as CardType } from './gameUtils';
import { getCardColor } from './gameUtils';

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  const color = getCardColor(card.suit);
  
  return (
    <div className="card">
      <div className="card-rank" style={{ color: color === 'red' ? '#ff4444' : '#333' }}>
        {card.rank}
      </div>
      <div className="card-suit" style={{ color: color === 'red' ? '#ff4444' : '#333' }}>
        {card.suit}
      </div>
    </div>
  );
};

export default Card;
