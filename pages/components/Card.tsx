import React, { FC } from 'react';
import { useDrag } from 'react-dnd';
import styles from '../../styles/Home.module.css';

interface CardProps {
  name: string;
}

interface DropResult {
  name: string;
}

const Card: FC<CardProps> = ({ children, name }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (item && dropResult) {
        alert(`You drop ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });
  return (
    <div
      role={'Handle'}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={styles.card}
    >
      {children}
    </div>
  );
};

export default Card;
