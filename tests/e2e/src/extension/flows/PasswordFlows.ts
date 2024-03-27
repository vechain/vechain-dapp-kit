import Locators from '../selenium/Locators';
import { extension } from '../selenium/WebDriver';

const enterPassword = async (password: string) => {
    await extension.driver.waitAndType(
        Locators.byId('enterPasswordInput'),
        password,
    );
};

const submitPassword = async (password?: string) => {
    if (password) await enterPassword(password);

    await extension.driver.sleep(1000);
    await extension.driver.waitAndClick(
        Locators.byDataTestId('submit-password'),
    );
};

export default {
    enterPassword,
    submitPassword,
};
