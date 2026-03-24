'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LIST_BRANDS } from '@/lib/graphql/brands';

export function useBrands({ filter, pagination, sort } = {}) {
  return useQuery({
    queryKey: ['brands', filter, pagination, sort],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: LIST_BRANDS,
        variables: { filter, pagination, sort },
      });
      return data.listBrands;
    },
  });
}
