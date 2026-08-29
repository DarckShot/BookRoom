import type { SVGProps } from 'react';

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13.5 10.5" fill="none" aria-hidden="true" {...props}>
    <path
      d="M.75 5.893 4.35 9.75 12.75.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AlertTriangleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path
      d="M21.15 9.6 7.58 33.1A3.3 3.3 0 0 0 10.44 38h27.12a3.3 3.3 0 0 0 2.86-4.9L26.85 9.6a3.3 3.3 0 0 0-5.7 0Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M24 18v9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="32.5" r="1.4" fill="currentColor" />
  </svg>
);

export const InfoCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="2" />
    <path d="M10 9v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
  </svg>
);

export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path
      d="m6 4 4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="2" />
    <path d="m7.5 7.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SuccessCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="m5 12.5 4.3 4.3L19 7"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
