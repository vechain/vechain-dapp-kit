import ApproveAppScreen from '../extension/screens/connected-app/ApproveAppScreen';
import ConnectedAppScreen from '../extension/screens/connected-app/ConnectedAppScreen';
import NavigationUtils from '../extension/utils/NavigationUtils';

export const connectDapp = async function (dappUrl: string) {
    await NavigationUtils.goToUrl(dappUrl);
    await ConnectedAppScreen.connectWallet();
    return ApproveAppScreen.approveAndSign();
};
