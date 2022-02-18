import React, { FC } from 'react';
import styles from 'styles/Home.module.css';

interface CardProps {
  name: string;
}

const Card: FC<CardProps> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export default Card;
