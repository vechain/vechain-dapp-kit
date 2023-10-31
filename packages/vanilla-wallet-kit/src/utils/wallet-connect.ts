// import {createWeb3Modal, defaultConfig} from '@web3modal/ethers5';

// // 1. Get projectId
// const projectId = 'f1c07ceecbc6115eaa26b2221c2e43cd';

// // 2. Set chains
// const mainnet = {
//   chainId: 1,
//   name: 'Ethereum',
//   currency: 'ETH',
//   explorerUrl: 'https://etherscan.io',
//   rpcUrl: 'https://cloudflare-eth.com',
// };

// // 3. Create modal
// const metadata = {
//   name: 'My Website',
//   description: 'My Website description',
//   url: 'https://mywebsite.com',
//   icons: ['https://avatars.mywebsite.com/'],
// };

// const modal = createWeb3Modal({
//   ethersConfig: defaultConfig({metadata}),
//   chains: [mainnet],
//   projectId,
// });

// const openConnectModalBtn = document.getElementById('open-vwk-connect-modal');
// const openNetworkModalBtn = document.getElementById('open-network-modal');

// openConnectModalBtn?.addEventListener('click', () => modal.open());
// openNetworkModalBtn?.addEventListener('click', () =>
//   modal.open({view: 'Networks'})
// );
