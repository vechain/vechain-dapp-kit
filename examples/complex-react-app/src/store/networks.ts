import { create } from 'zustand';

export type NetworkStore = {
    selectedNetwork: null | string;
    setSelectedNetwork: (network: string) => void;
};

export const useNetworkStore = create<NetworkStore>((set) => ({
    selectedNetwork: 'test',
    setSelectedNetwork: (network: string) => set({ selectedNetwork: network }),
}));
