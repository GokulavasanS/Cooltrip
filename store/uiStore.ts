import { create } from "zustand";

interface UIStore {
  isPassengerModalOpen: boolean;
  isMenuOpen: boolean;
  openPassengerModal: () => void;
  closePassengerModal: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isPassengerModalOpen: false,
  isMenuOpen: false,
  openPassengerModal: () => set({ isPassengerModalOpen: true }),
  closePassengerModal: () => set({ isPassengerModalOpen: false }),
  toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
}));
