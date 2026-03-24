'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { UPDATE_BRAND } from '@/lib/graphql/brands';
import { useToast } from '@/hooks/use-toast';

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, input }) => {
      const data = await apiClient.graphql({
        query: UPDATE_BRAND,
        variables: { id, input },
      });
      return data.updateBrand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update brand',
        variant: 'destructive',
      });
    },
  });
}
