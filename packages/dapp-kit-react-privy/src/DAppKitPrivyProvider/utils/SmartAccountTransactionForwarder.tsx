import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

export const randomTransactionUser = (() => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return {
        privateKey,
        account,
        address: account.address,
    };
})();
