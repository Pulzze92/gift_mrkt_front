import { create } from 'zustand';

const useAppStore = create((set) => ({
  referralCode: null,
  setReferralCode: (code: string | null) => set({ referralCode: code }),
}));

export default {
  useAppStore,
};
