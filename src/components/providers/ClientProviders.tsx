'use client';

import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <MantineProvider>{children}</MantineProvider>
    </Provider>
  );
}