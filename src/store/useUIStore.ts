'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewMode, SortOption, ModalType, FilterState } from '@/types/filters';
import { DEFAULT_FILTERS } from '@/types/filters';

interface UIStore {
  viewMode: ViewMode;
  searchQuery: string;
  sortBy: SortOption;
  filters: FilterState;
  openModal: ModalType;
  selectedPollinatorId: string | null;
  theme: 'light' | 'dark';
  showFilters: boolean;

  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  setOpenModal: (modal: ModalType) => void;
  selectPollinator: (id: string | null) => void;
  toggleTheme: () => void;
  toggleFilters: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      viewMode: 'list',
      searchQuery: '',
      sortBy: 'name-asc',
      filters: DEFAULT_FILTERS,
      openModal: null,
      selectedPollinatorId: null,
      theme: 'light',
      showFilters: false,

      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      setOpenModal: (modal) => set({ openModal: modal }),
      selectPollinator: (id) => set({ selectedPollinatorId: id }),
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', next);
          }
          return { theme: next };
        }),
      toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),
    }),
    {
      name: 'pollinators-ui-v1',
      partialize: (state) => ({ theme: state.theme, viewMode: state.viewMode }),
    }
  )
);
