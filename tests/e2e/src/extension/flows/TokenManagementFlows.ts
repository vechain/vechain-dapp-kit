import ApproveAppScreen from '../screens/connected-app/ApproveAppScreen';
import ConnectedAppScreen from '../screens/connected-app/ConnectedAppScreen';
import TestDefaults from '../TestDefaults';
import NavigationUtils from '../utils/NavigationUtils';

const connectAndInteract = async function <T>(
    requestAction: (windowHandle: string) => Promise<void>,
    responseCallback: (windowHandle: string) => Promise<T>,
) {
    const windowHandle = await NavigationUtils.goToUrl(TestDefaults.DAPP_URL);
    await ConnectedAppScreen.connectWallet();
    return await ApproveAppScreen.approveAndSign();
    // const isConnected = await ConnectedAppScreen.isConnected(windowHandle);

    // console.log('isConnected', isConnected);

    // if (!isConnected) {
    //     await ConnectedAppScreen.connectWallet(windowHandle);

    //     // resolve when 1 of 2 promises resolves
    //     await new Promise((resolve, reject) => {
    //         ApproveAppScreen.approveAndSign()
    //             .then(resolve)
    //             .catch((e) => console.log('approveAndSign', e));
    //         ApproveAppScreen.sign()
    //             .then(resolve)
    //             .catch((e) => console.log('sign', e));

    //         setTimeout(() => {
    //             reject('Timed out');
    //         }, 10_000);
    //     });
    // }

    // await requestAction(windowHandle);
    // await ApproveTransactionScreen.approve();
    // return await responseCallback(windowHandle);
};

export default {
    connectAndInteract,
};
