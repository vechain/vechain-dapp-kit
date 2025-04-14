import { HttpClient } from '@vechain/sdk-network';

export const mockedHttpClient: HttpClient = {
    baseURL: 'https://testnet.vechain.org',
    get: async () => {
        return {
            id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        };
    },
    post: async () => {
        return {};
    },
    http: async () => {
        return {
            id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        };
    },
};
