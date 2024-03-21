import assert from 'assert';
import { ROUTES } from '../../enums';
import Locators from '../../selenium/Locators';
import NavigationUtils from '../../utils/NavigationUtils';
import ScreenUtils from '../../utils/ScreenUtils';

const isActive = async () => {
    const locator = Locators.byId('formAddToken');
    return ScreenUtils.isActive([locator], ROUTES.MANAGE_TOKENS_ADD);
};

const goToAddToken = async function () {
    await NavigationUtils.goToExtension(ROUTES.MANAGE_TOKENS_ADD);
    const isManageTokendsActive = await isActive();
    assert(isManageTokendsActive, 'The user is not on the add token screen');
};

export default {
    isActive,
    goToAddToken,
};
