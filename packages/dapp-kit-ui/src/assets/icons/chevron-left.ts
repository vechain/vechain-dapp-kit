import { html, svg } from 'lit';

export const ChevronLeftSvg = svg`
      <path
        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
    `;

export const LightChevronLeftSvg = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#777777">
        ${ChevronLeftSvg}
    </svg>
`;
export const DarkChevronLeftSvg = html`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#999999">
        ${ChevronLeftSvg}
    </svg>
`;
