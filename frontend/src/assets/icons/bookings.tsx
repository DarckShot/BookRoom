import type { SVGProps } from 'react';

export const BookingEmptyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M15 39V16h21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M21 11v10M31 11v10M15 26h21" stroke="currentColor" strokeWidth="2.4" />
  </svg>
);

export const BookingRoomIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path d="M5 17V4.5L13 2v15M3 17h14" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 9.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M13 7h3v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

export const BookingCalendarDownloadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <path
      d="M5.5 2.5v3M14.5 2.5v3M3 7.5h14M4.5 4h11A1.5 1.5 0 0 1 17 5.5v11H3v-11A1.5 1.5 0 0 1 4.5 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 10v4m0 0-2-2m2 2 2-2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
