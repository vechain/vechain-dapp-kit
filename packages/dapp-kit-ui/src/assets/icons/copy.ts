import { html, svg } from 'lit';

export const CopySvg = svg`
      <path
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
    `;

export const LightCopySvg = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777">
        ${CopySvg}
    </svg>
`;
export const DarkCopySvg = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#999999">
        ${CopySvg}
    </svg>
`;
