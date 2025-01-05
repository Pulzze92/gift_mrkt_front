import { create } from 'zustand';

// import Router from '../api/Router';

const useAppStore = create((set) => ({
  referralCode: null,
  setReferralCode: (code: string | null) => set({ referralCode: code }),
}));

export default {
  useAppStore,
};
