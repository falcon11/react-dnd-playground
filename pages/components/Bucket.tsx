import React, { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';

const style: CSSProperties = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

const Bucket = () => {
  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: 'card',
      drop: () => {
        return { name: 'Dustbin' };
      },
      collect: (monitor) => {
        return { isOver: monitor.isOver(), canDrop: monitor.canDrop() };
      },
    };
  });

  const isActive = canDrop && isOver;
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }
  return (
    <div ref={drop} role="Dustbin" style={{ backgroundColor, ...style }}>
      {isActive ? 'Release to drop' : 'Drag a box here'}
    </div>
  );
};

export default Bucket;
