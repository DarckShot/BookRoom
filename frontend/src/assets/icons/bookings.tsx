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
