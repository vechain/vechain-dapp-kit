import ApproveFlows from '../extension/flows/ApproveFlows';
import NavigationUtils from '../extension/utils/NavigationUtils';
import ConnectFlows from '../extension/flows/ConnectFlows';

export const connectDapp = async function (dappUrl: string) {
    await NavigationUtils.goToUrl(dappUrl);
    await ConnectFlows.connectWallet();
    return ApproveFlows.approveAndSign();
};
