import Locators from '../../selenium/Locators';
import { ROUTES } from '../../enums';
import ScreenUtils from '../../utils/ScreenUtils';
import assert from 'assert';
import NavigationUtils from '../../utils/NavigationUtils';
import TokenManagementFlows from '../../flows/TokenManagementFlows';
import AddTokenScreen from './AddTokenScreen';
import { extension } from '../../selenium/WebDriver';

const isActive = async () => {
    const locator = Locators.byId('manageTokensDescription');
    return ScreenUtils.isActive([locator], ROUTES.MANAGE_TOKENS);
};

const gotoManageTokens = async function () {
    await NavigationUtils.goToExtension(ROUTES.MANAGE_TOKENS);
    const isManageTokendsActive = await isActive();
    assert(
        isManageTokendsActive,
        'The user is not on the manage tokens screen',
    );
};

const removeCustomToken = async function (contractAddress: string) {
    await extension.driver.waitAndClick(
        Locators.byId(`delete-token-button-${contractAddress}`.toLowerCase()),
    );
};

// const addCustomToken = async function () {
//     //const contractAddress = await TokenManagementFlows.deployToken();
//     console.log('contractAddress', contractAddress);
//     await AddTokenScreen.goToAddToken();
//     await extension.driver.waitAndType(
//         Locators.byId('tokenAddress'),
//         contractAddress,
//     );

//     await extension.driver.waitAndClick(Locators.byId('addCustomTokenBtn'));

//     //Wait until we know the token was added
//     await extension.driver.waitUntilElement(
//         Locators.byId(`remove-${contractAddress.toLowerCase()}`),
//     );

//     return contractAddress;
// };

const checkCustomToken = async function (contractAddress: string) {
    let tokenFound = true;
    try {
        await extension.driver.waitUntilElement(
            Locators.byId(`remove-${contractAddress}`.toLowerCase()),
        );
    } catch (error) {
        tokenFound = false;
    }
    return tokenFound;
};

const waitUntilTokenIsRemoved = async function (contractAddress: string) {
    try {
        await extension.driver.waitUntilElementRemoved(
            Locators.byId(
                `delete-token-button-${contractAddress.toLowerCase()}`,
            ),
        );
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export default {
    isActive,
    gotoManageTokens,
    removeCustomToken,
    checkCustomToken,
    waitUntilTokenIsRemoved,
};
