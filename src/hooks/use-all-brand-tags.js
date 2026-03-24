'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LIST_BRANDS } from '@/lib/graphql/brands';

export function useAllBrandTags() {
  return useQuery({
    queryKey: ['all-brand-tags'],
    queryFn: async () => {
      const data = await apiClient.graphql({
        query: LIST_BRANDS,
        variables: {
          filter: {},
          pagination: { page: 1, limit: 1000 },
          sort: { sortBy: 'createdAt', sortOrder: 'DESC' },
        },
      });

      // Extract unique tags from all brands
      const allTags = new Set();
      data.listBrands.data.forEach((brand) => {
        brand.tags?.forEach((tag) => allTags.add(tag));
      });

      // Return sorted array of unique tags
      return Array.from(allTags).sort();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
