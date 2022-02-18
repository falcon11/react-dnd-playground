import React, { memo, FC, useState, useMemo, useCallback } from 'react';
import GAppContext, { GAppContextStoreType } from './GAppContext';

const storeValue: GAppContextStoreType = {
  name: 'react-dnd-playground',
};

export const GAppProvider: FC = memo(function GAppProvider({ children }) {
  const [store, setStore] = useState({ ...storeValue });
  const contextSetStore = useCallback(
    (keyValues: Partial<GAppContextStoreType>) => {
      setStore((pre) => {
        return { ...pre, ...keyValues };
      });
    },
    [setStore]
  );
  return (
    <GAppContext.Provider
      value={{
        store: store,
        setStore: contextSetStore,
      }}
    >
      {children}
    </GAppContext.Provider>
  );
});
