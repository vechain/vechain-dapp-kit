import { html, svg } from 'lit';
import { Colors } from '../../constants';

export const DisconnectSvg = svg`
    <path d="M11.667 3.333H4.167C3.706 3.333 3.333 3.706 3.333 4.167V15.833C3.333 16.294 3.706 16.667 4.167 16.667H11.667" />
    <path d="M8.333 10H17.5" />
    <path d="M14.167 6.667L17.5 10L14.167 13.333" />
`;

export const LightDisconnectSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Light.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${DisconnectSvg}
    </svg>
`;
export const DarkDisconnectSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Dark.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${DisconnectSvg}
    </svg>
`;
