import { html, svg } from 'lit';
import { Colors } from '../../constants';

export const SwitchWalletSvg = svg`
    <path d="M4.167 5.833H15.833C16.293 5.833 16.667 6.207 16.667 6.667V9.167" />
    <path d="M4.167 5.833C3.706 5.833 3.333 5.46 3.333 5C3.333 4.54 3.706 4.167 4.167 4.167H14.167C14.627 4.167 15 4.54 15 5V5.833" />
    <path d="M3.333 5V15C3.333 15.46 3.706 15.833 4.167 15.833H15.833C16.293 15.833 16.667 15.46 16.667 15V14.167" />
    <path d="M14.167 9.167H17.5C17.96 9.167 18.333 9.54 18.333 10V13.333C18.333 13.793 17.96 14.167 17.5 14.167H14.167C12.786 14.167 11.667 13.047 11.667 11.667C11.667 10.286 12.786 9.167 14.167 9.167Z" />
    <path d="M14.167 11.667H14.175" />
`;

export const LightSwitchWalletSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Light.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${SwitchWalletSvg}
    </svg>
`;
export const DarkSwitchWalletSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Dark.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${SwitchWalletSvg}
    </svg>
`;
