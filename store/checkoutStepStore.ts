import { create } from "zustand";

interface CheckoutStepState {
  step: number; 
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useCheckoutStepStore = create<CheckoutStepState>((set) => ({
  step: 1,

  goToStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 3),
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),
}));
