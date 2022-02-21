import { ComponentInstance } from 'interfaces/Component';
import React, { FC, useEffect, useState, useRef } from 'react';
import {} from 'next';
import DndWrapper from './DndWapper';
import { ItemTypes } from 'pages/constants/ItemTypes';

interface ComponentRenderProps {
  basePath: string;
  component: ComponentInstance;
  moveComponent: (
    sourceItem: ComponentInstance,
    targetItem: ComponentInstance
  ) => void;
}

const ComponentRender: FC<ComponentRenderProps> = ({
  basePath,
  component,
  moveComponent,
}) => {
  const { path, children } = component;
  const [loaded, setLoaded] = useState(false);
  const componentRef = useRef<any>(null);
  useEffect(() => {
    import(`${basePath}/${path}`).then((module) => {
      componentRef.current = module.default;
      setLoaded(true);
    });
  }, [basePath, path]);
  if (!loaded) return null;
  const Component = componentRef.current;
  return (
    <DndWrapper
      type={ItemTypes.COMPONENT_INSTANCE}
      item={component}
      accept={[ItemTypes.COMPONENT_CLASS, ItemTypes.COMPONENT_INSTANCE]}
      onDrop={(item) => {
        moveComponent(item, component);
      }}
      render={({ item }) => {
        return (
          <Component>
            {children &&
              children.map((child) => (
                <ComponentRender
                  key={child.id}
                  basePath={basePath}
                  component={child}
                  moveComponent={moveComponent}
                />
              ))}
          </Component>
        );
      }}
    ></DndWrapper>
  );
};

export default ComponentRender;
