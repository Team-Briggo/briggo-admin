'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LIST_CREATORS } from '@/lib/graphql/creators';

export function useCreators({ filter, pagination, sort } = {}) {
  return useQuery({
    queryKey: ['creators', filter, pagination, sort],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: LIST_CREATORS,
        variables: { filter, pagination, sort },
      });
      return data.listCreators;
    },
  });
}
