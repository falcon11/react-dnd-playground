import { ComponentInstance } from 'interfaces/Component';
import React, { FC, useEffect, useState, useRef } from 'react';
import {} from 'next';

interface ComponentRenderProps {
  basePath: string;
  component: ComponentInstance;
}

const ComponentRender: FC<ComponentRenderProps> = ({ basePath, component }) => {
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
    <Component>
      {children &&
        children.map((child) => (
          <ComponentRender
            key={child.id}
            basePath={basePath}
            component={child}
          />
        ))}
    </Component>
  );
};

export default ComponentRender;
