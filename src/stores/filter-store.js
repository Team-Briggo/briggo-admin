import { create } from 'zustand';

const defaultCreatorFilters = {
  searchQuery: '',
  profileStatus: null,
  dateRange: { from: null, to: null },
};

const defaultAutomationFilters = {
  searchQuery: '',
  status: null,
  automationType: null,
};

export const useFilterStore = create((set) => ({
  creatorFilters: defaultCreatorFilters,
  automationFilters: defaultAutomationFilters,
  setCreatorFilters: (filters) =>
    set((state) => ({
      creatorFilters: { ...state.creatorFilters, ...filters },
    })),
  setAutomationFilters: (filters) =>
    set((state) => ({
      automationFilters: { ...state.automationFilters, ...filters },
    })),
  resetCreatorFilters: () => set({ creatorFilters: defaultCreatorFilters }),
  resetAutomationFilters: () => set({ automationFilters: defaultAutomationFilters }),
}));
