import { html, svg } from 'lit';
import { Colors } from '../../constants';

export const TrashSvg = svg`
    <path d="M3.333 5.833H16.667" />
    <path d="M8.333 5.833V4.167C8.333 3.706 8.706 3.333 9.167 3.333H10.833C11.294 3.333 11.667 3.706 11.667 4.167V5.833" />
    <path d="M15 5.833V15.833C15 16.294 14.627 16.667 14.167 16.667H5.833C5.373 16.667 5 16.294 5 15.833V5.833" />
    <path d="M8.333 9.167V13.333" />
    <path d="M11.667 9.167V13.333" />
`;

export const LightTrashSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Light.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${TrashSvg}
    </svg>
`;
export const DarkTrashSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="none"
        stroke=${Colors.Dark.Quaternary}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.35"
    >
        ${TrashSvg}
    </svg>
`;
