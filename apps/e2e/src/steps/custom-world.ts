import { World, setWorldConstructor } from '@cucumber/cucumber';
import { ICustomWorld } from 'types';
import { openUrl, click, clickByText, isVisible, isVisibleByText } from 'utils';

export class CustomWorld extends World implements ICustomWorld {
    openUrl = openUrl.bind(this);
    click = click.bind(this);
    clickByText = clickByText.bind(this);
    isVisible = isVisible.bind(this);
    isVisibleByText = isVisibleByText.bind(this);
}

setWorldConstructor(CustomWorld);
