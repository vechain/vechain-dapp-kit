import { html, svg } from 'lit';
import { Colors } from '../../constants';

export const CopySvg = svg`
      <path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    `;

export const LightCopySvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke=${Colors.Light.Quaternary}
        fill="#00000000"
    >
        ${CopySvg}
    </svg>
`;
export const DarkCopySvg = html`
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke=${Colors.Dark.Quaternary}
        fill="#00000000"
    >
        ${CopySvg}
    </svg>
`;
