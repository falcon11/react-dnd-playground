import { createContext } from 'react';

export interface GAppContextStoreType {
  name?: string;
}

export interface GAppContextType {
  store: GAppContextStoreType;
  setStore: (keyValues: Partial<GAppContextStoreType>) => void;
}

const GAppContext = createContext<GAppContextType>({
  store: { name: undefined },
  setStore: () => {},
});

export default GAppContext;
