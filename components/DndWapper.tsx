import { ItemTypes } from 'pages/constants/ItemTypes';
import React, { FC, CSSProperties, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const style: CSSProperties = {
  margin: '.5rem',
  padding: '1rem',
  border: '1px dashed gray',
  textAlign: 'center',
};

interface DndWrapperProps {
  type: string;
  item: any;
  accept?: string | string[];
  render: ({ item }: { item: any }) => JSX.Element;
  onDrop?: (item: any) => void;
}

const DndWrapper: FC<DndWrapperProps> = ({
  type,
  item,
  accept,
  render,
  onDrop,
}) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag(() => {
    return {
      type: type,
      item: item,
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    };
  });
  const [{ isOver, canDrop }, drop] = useDrop(() => {
    return {
      accept: accept || [],
      canDrop: () => item.isContainer,
      drop: (dragItem: any, monitor) => {
        if (monitor.didDrop()) return;
        console.log('drop', dragItem);
        if (dragItem.id === item.id) return;
        onDrop && onDrop(item);
      },
      hover: (item) => {
        console.log('hover', item);
      },
      collect: (monitor) => {
        return {
          isOver: monitor.isOver({ shallow: true }),
          canDrop: monitor.canDrop(),
        };
      },
    };
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: isOver && canDrop ? 'darkgreen' : 'transparent',
      }}
    >
      {render({ item })}
    </div>
  );
};

export default DndWrapper;
