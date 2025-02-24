import { create } from "zustand";
import { Campaign, ProgramState, Transaction } from "@/utils/interfaces";

interface GlobalState {
  campaigns: Campaign[];
  donations: Transaction[];
  withdrawals: Transaction[];
  programState: ProgramState | null;
  setCampaign: (campaign: Campaign) => void;
  setDonations: (donations: Transaction[]) => void;
  setWithdrawals: (withdrawals: Transaction[]) => void;
  setStates: (state: ProgramState) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  campaigns: [],
  donations: [],
  withdrawals: [],
  programState: null,
  setCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  setDonations: (donations) => set(() => ({ donations })),
  setWithdrawals: (withdrawals) => set(() => ({ withdrawals })),
  setStates: (state) => set(() => ({ programState: state })),
}));
