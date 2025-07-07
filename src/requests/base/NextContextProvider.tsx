'use client';

import React, { JSX, useEffect, useState, lazy, Suspense } from 'react';
import {
  QueryClientProvider as DataProvider,
  QueryClient,
} from '@tanstack/react-query';

const DevTools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const queryClient = new QueryClient();

const NextContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DataProvider client={queryClient}>
      {children}
      {isClient && (
        <Suspense fallback={null}>
          <DevTools initialIsOpen={false} />
        </Suspense>
      )}
    </DataProvider>
  );
};

export default NextContextProvider;
