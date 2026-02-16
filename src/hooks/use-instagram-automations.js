'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LIST_INSTAGRAM_AUTOMATIONS } from '@/lib/graphql/instagram-automations';

export function useInstagramAutomations({ filter, pagination, sort } = {}) {
  return useQuery({
    queryKey: ['instagram-automations', filter, pagination, sort],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: LIST_INSTAGRAM_AUTOMATIONS,
        variables: { filter, pagination, sort },
      });
      return data.listInstagramAutomations;
    },
  });
}
