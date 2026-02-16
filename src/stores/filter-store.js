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

const defaultCreditFilters = {
  status: 'SUCCESS',
};

export const useFilterStore = create((set) => ({
  creatorFilters: defaultCreatorFilters,
  automationFilters: defaultAutomationFilters,
  creditFilters: defaultCreditFilters,
  setCreatorFilters: (filters) =>
    set((state) => ({
      creatorFilters: { ...state.creatorFilters, ...filters },
    })),
  setAutomationFilters: (filters) =>
    set((state) => ({
      automationFilters: { ...state.automationFilters, ...filters },
    })),
  setCreditFilters: (filters) =>
    set((state) => ({
      creditFilters: { ...state.creditFilters, ...filters },
    })),
  resetCreatorFilters: () => set({ creatorFilters: defaultCreatorFilters }),
  resetAutomationFilters: () => set({ automationFilters: defaultAutomationFilters }),
  resetCreditFilters: () => set({ creditFilters: defaultCreditFilters }),
}));
