'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { GET_CREATOR_ANALYTICS } from '@/lib/graphql/creators';

export function useCreatorAnalytics(cognitoId, options = {}) {
  return useQuery({
    queryKey: ['creator-analytics', cognitoId],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: GET_CREATOR_ANALYTICS,
        variables: { cognitoId },
      });
      return data.getCreatorAnalytics;
    },
    enabled: !!cognitoId && options.enabled !== false,
    staleTime: 30000, // 30 seconds - analytics don't change frequently
    ...options,
  });
}
