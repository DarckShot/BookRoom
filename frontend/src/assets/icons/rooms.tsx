import type { SVGProps } from 'react';

export const BuildingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <rect x="12" y="7" width="24" height="34" rx="3" stroke="currentColor" strokeWidth="2" />
    <path d="M20 41v-6h8v6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path
      d="M18 15h1m5 0h1m5 0h1m-13 7h1m5 0h1m5 0h1m-13 7h1m5 0h1m5 0h1"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5.33333 1.3328V3.99968M10.6667 1.3328V3.99968M2 6.66656H14M3.33333 2.66624H12.6667C13.403 2.66624 14 3.26324 14 3.99968V13.3338C14 14.0702 13.403 14.6672 12.6667 14.6672H3.33333C2.59695 14.6672 2 14.0702 2 13.3338V3.99968C2 3.26324 2.59695 2.66624 3.33333 2.66624Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ClockIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path
      d="M8 3.99968V8L10.6669 9.33344M14.6672 8C14.6672 11.6822 11.6822 14.6672 8 14.6672C4.31781 14.6672 1.3328 11.6822 1.3328 8C1.3328 4.31781 4.31781 1.3328 8 1.3328C11.6822 1.3328 14.6672 4.31781 14.6672 8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const NoResultsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <circle cx="21" cy="21" r="13" stroke="currentColor" strokeWidth="2" />
    <path d="m30.5 30.5 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="m16.5 16.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path
      d="M10.6669 14V12.6667C10.6669 11.9594 10.3859 11.2811 9.88577 10.781C9.38563 10.281 8.7073 10 8 10H3.99968C3.29238 10 2.61405 10.281 2.11391 10.781C1.61377 11.2811 1.3328 11.9594 1.3328 12.6667V14M10.6669 2.08529C11.2388 2.23353 11.7452 2.56746 12.1068 3.03466C12.4683 3.50186 12.6645 4.07588 12.6645 4.66662C12.6645 5.25736 12.4683 5.83138 12.1068 6.29858C11.7452 6.76578 11.2388 7.09971 10.6669 7.24795M14.6672 13.9999V12.6666C14.6668 12.0757 14.4701 11.5018 14.1081 11.0348C13.746 10.5678 13.2392 10.2343 12.667 10.0866M8.66672 4.66667C8.66672 6.13943 7.47272 7.33333 5.99984 7.33333C4.52696 7.33333 3.33296 6.13943 3.33296 4.66667C3.33296 3.19391 4.52696 2 5.99984 2C7.47272 2 8.66672 3.19391 8.66672 4.66667Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
