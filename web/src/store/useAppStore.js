import { create } from 'zustand';

export const useAppStore = create((set) => ({
  isSidebarOpen: false,
  isChatbotOpen: false,
  studioInitialQuery: null,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
  setChatbotOpen: (isOpen) => set({ isChatbotOpen: isOpen }),
  
  setStudioQuery: (query) => set({ studioInitialQuery: query }),
}));
