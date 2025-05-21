import { memo, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
    },
  },
});

export const ProvideQuery = memo<{ children: ReactNode }>(({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
));

export type QueryKeyFactory<
  Args extends Array<unknown> = Array<unknown>,
  QueryKey extends Array<unknown> = Array<unknown>,
> = {
  key: (...args: Args) => QueryKey;
  invalidate: (...args: Args) => void;
  reset: (...args: Args) => void;
};

export function queryKeyFactory<
  Args extends Array<unknown> = Array<unknown>,
  QueryKey extends Array<unknown> = Array<unknown>,
>(key: (...args: Args) => QueryKey): QueryKeyFactory<Args, QueryKey> {
  return {
    key,
    invalidate: (...args) =>
      queryClient.invalidateQueries({ queryKey: key(...args) }),
    reset: (...args) => queryClient.resetQueries({ queryKey: key(...args) }),
  };
}

import * as rq from '@tanstack/react-query';

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
export { rq };
