import { create } from "zustand";
import { Campaign, ProgramState, Transaction } from "@/utils/interfaces";

interface GlobalState {
  campaigns: Campaign[];
  donations: Transaction[];
  withdrawals: Transaction[];
  programState: ProgramState | null;
  delModal: string;
  withdrawModal: string;
  setCampaign: (campaign: Campaign) => void;
  setDonations: (donations: Transaction[]) => void;
  setWithdrawals: (withdrawals: Transaction[]) => void;
  setStates: (state: ProgramState) => void;
  setDelModal: (state: string) => void;
  setWithdrawModal: (state: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  campaigns: [],
  donations: [],
  withdrawals: [],
  programState: null,
  delModal: "scale-0",
  withdrawModal: "scale-0",
  setCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  setDonations: (donations) => set(() => ({ donations })),
  setWithdrawals: (withdrawals) => set(() => ({ withdrawals })),
  setStates: (state) => set(() => ({ programState: state })),
  setDelModal: (state) => set(() => ({ delModal: state })),
  setWithdrawModal: (state) => set(() => ({ withdrawModal: state })),
}));
