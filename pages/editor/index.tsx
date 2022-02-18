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
    let component = sourceItem;
    if (!component.id) {
      component = JSON.parse(JSON.stringify(component));
      component.id = uuidv4();
    }
    targetItem.children = targetItem.children || [];
    if (targetItem.children?.findIndex((it) => it.id === component.id) === -1) {
      targetItem.children = [...targetItem.children, component];
    }
    setRootComponent({ ...rootCompnent });
  };
  const [{ isOver }, drop] = useDrop<
    Partial<ComponentClass & ComponentInstance>,
    void,
    { isOver: boolean }
  >(() => {
    return {
      accept: [ItemTypes.COMPONENT_CLASS, ItemTypes.COMPONENT_INSTANCE],
      drop: (item, monitor) => {
        if (monitor.didDrop()) return;
        console.log('drop', item);
        let component = item;
        if (!component.id) {
          component = JSON.parse(JSON.stringify(component));
          component.id = uuidv4();
        }
        if (
          rootCompnent.children!.findIndex((it) => it.id === component.id) ===
          -1
        ) {
          setRootComponent((preRootComponent) => {
            if (
              preRootComponent.children!.findIndex(
                (it) => it.id === component.id
              ) === -1
            ) {
              return {
                ...preRootComponent,
                children: [
                  ...preRootComponent.children!,
                  component as ComponentInstance,
                ],
              };
            }
            return preRootComponent;
          });
        }
      },
      hover: (item) => {
        console.log('hover', item);
      },
      collect: (monitor) => {
        return { isOver: monitor.isOver({ shallow: true }) };
      },
    };
  });

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
            <DndWrapper
              key={component.id}
              item={component}
              type={ItemTypes.COMPONENT_INSTANCE}
              accept={[ItemTypes.COMPONENT_CLASS, ItemTypes.COMPONENT_INSTANCE]}
              onDrop={(item) => {
                moveComponent(item, component);
              }}
              render={({ item }) => {
                return (
                  <ComponentRender
                    component={item}
                    basePath={ComponentsBasePath}
                  />
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Editor;
