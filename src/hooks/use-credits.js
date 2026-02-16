'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LIST_TRANSACTIONS } from '@/lib/graphql/credits';

export function useCredits({ filter, pagination, sort } = {}) {
  return useQuery({
    queryKey: ['credits', filter, pagination, sort],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: LIST_TRANSACTIONS,
        variables: { filter, pagination, sort },
      });
      return data.listTransactions;
    },
  });
}
