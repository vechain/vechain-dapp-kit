import { By } from 'selenium-webdriver/lib/by';

const byDataTestId = (id: string) => By.xpath(`//*[@data-testid='${id}']`);

const byAttribute = (attribute: string, value: string) =>
    By.xpath(`//*[@${attribute}='${value}']`);

const byId = (id: string) => By.id(id);

const byRole = (role: string) => byAttribute('role', role);

const byForm = (formName: string) => byAttribute('form', formName);

const elementByAttribute = (
    element: string,
    attribute: string,
    value: string,
) => By.xpath(`//${element}[@${attribute}='${value}']`);

const buttonByType = (type: string) => By.xpath(`//button[@type='${type}']`);

const inputByType = (type: string) => By.xpath(`//input[@type='${type}']`);

const inputByName = (name: string) => By.xpath(`//input[@name='${name}']`);

const buttonByName = (name: string) => By.xpath(`//button[@name='${name}']`);

const byClass = (className: string) => By.className(className);

const byText = (text: string, element = 'div') =>
    By.xpath(`//${element}[text()='${text}']`);

const buttonByText = (text: string) => byText(text, 'button');

const byTextPart = (text: string, element = 'div') =>
    By.xpath(`//${element}[contains(text(),'${text}')]`);

const buttonByTextPart = (text: string) => byTextPart(text, 'button');

const byDataRowKey = (key: string) => byAttribute('data-row-key', key);

const bySelector = (key: string) => By.css(key);

export default {
    byDataTestId,
    byAttribute,
    byId,
    byForm,
    byRole,
    inputByType,
    inputByName,
    buttonByName,
    byClass,
    byDataRowKey,
    elementByAttribute,
    buttonByType,
    byText,
    buttonByText,
    byTextPart,
    buttonByTextPart,
    bySelector,
};
