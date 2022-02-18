import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GAppProvider } from './core/GAppProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GAppProvider>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </GAppProvider>
  );
}

export default MyApp;
