import DndWrapper from '@/components/DndWapper';
import { v4 as uuidv4 } from 'uuid';
import { ComponentClass, ComponentInstance } from 'interfaces/Component';
import React, { FC, CSSProperties, useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../constants/ItemTypes';
import ComponentRender from '@/components/ComponentRender';

const pageStyle: CSSProperties = {};

const componentsAreaStyle: CSSProperties = {
  float: 'left',
  border: '1px solid black',
};

const editorLayerStyle: CSSProperties = {
  marginLeft: '5rem',
  float: 'left',
  width: '20.8rem',
  height: '37.1rem',
  backgroundColor: 'white',
  border: '1px dashed black',
};

const ComponentsBasePath = 'components';

const Components = [
  {
    name: 'Card',
    path: `Card`,
    isContainer: true,
  },
  {
    name: 'Text',
    path: `Text`,
    isContainer: false,
  },
];

function findComponentParent(
  component: ComponentInstance,
  rootComponent: ComponentInstance
): ComponentInstance | null {
  let parent: ComponentInstance | null = rootComponent;
  if (parent && parent.children && parent.children?.length > 0) {
    if (parent.children.some((child) => child.id === component.id)) {
      return parent;
    }
    for (let i = 0; i < parent!.children!.length; i++) {
      let nextParent: ComponentInstance | null = parent!.children![i];
      nextParent = findComponentParent(component, nextParent);
      if (nextParent) {
        return nextParent;
      }
    }
  }
  return null;
}

function removeComponent(
  component: ComponentInstance,
  rootCompnent: ComponentInstance
) {
  const parent = findComponentParent(component, rootCompnent);
  if (parent && Array.isArray(parent.children)) {
    parent.children = parent.children!.filter(
      (child) => child.id !== component.id
    );
  }
}

interface EditorProps {}

const Editor: FC<EditorProps> = () => {
  const [rootCompnent, setRootComponent] = useState<ComponentInstance>({
    id: uuidv4(),
    name: 'root',
    path: '',
    isContainer: true,
    children: [],
  });
  const moveComponent = (
    sourceItem: ComponentClass & ComponentInstance,
    targetItem: ComponentInstance
  ) => {
    console.log('moveComponent', sourceItem, targetItem);
    let component = sourceItem;
    if (!component.id) {
      component = JSON.parse(JSON.stringify(component));
      component.id = uuidv4();
    }
    targetItem.children = targetItem.children || [];
    if (targetItem.children?.findIndex((it) => it.id === component.id) === -1) {
      removeComponent(component, rootCompnent);
      targetItem.children = [...targetItem.children, component];
    }
    console.log('root Components', rootCompnent);
    setRootComponent(JSON.parse(JSON.stringify(rootCompnent)));
  };
  const [{ isOver }, drop] = useDrop<
    ComponentClass & ComponentInstance,
    void,
    { isOver: boolean }
  >(() => {
    return {
      accept: [ItemTypes.COMPONENT_CLASS, ItemTypes.COMPONENT_INSTANCE],
      drop: (item, monitor) => {
        if (monitor.didDrop()) return;
        console.log('drop item', item);
        moveComponent(item, rootCompnent);
        return;
      },
      hover: (item) => {
        console.log('hover', item);
      },
      collect: (monitor) => {
        return { isOver: monitor.isOver({ shallow: true }) };
      },
    };
  }, [rootCompnent]);

  return (
    <div style={{ ...pageStyle }}>
      <div style={componentsAreaStyle}>
        <h3>Components</h3>
        {Components.map((component) => {
          return (
            <DndWrapper
              key={`${ComponentsBasePath}/${component.name}`}
              type={ItemTypes.COMPONENT_CLASS}
              item={component}
              render={({ item }) => {
                return (
                  <div
                    style={{
                      padding: '1rem',
                      border: '1px dashed gray',
                      margin: '0.5rem',
                      textAlign: 'center',
                    }}
                  >
                    {item.name}
                  </div>
                );
              }}
            />
          );
        })}
      </div>
      <div
        ref={drop}
        style={{
          ...editorLayerStyle,
          backgroundColor: isOver ? 'darkgreen' : 'transparent',
        }}
      >
        {rootCompnent.children!.map((component) => {
          return (
            <ComponentRender
              key={component.id}
              component={component}
              basePath={ComponentsBasePath}
              moveComponent={moveComponent}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Editor;
