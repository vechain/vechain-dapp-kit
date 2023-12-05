import { html, svg } from 'lit';
import { Colors } from '../../constants';

export const CloseSvg = svg`
      <path
        d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
    `;

export const LightCloseSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill=${Colors.Light.Quaternary}
    >
        ${CloseSvg}
    </svg>
`;
export const DarkCloseSvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill=${Colors.Dark.Quaternary}
    >
        ${CloseSvg}
    </svg>
`;
