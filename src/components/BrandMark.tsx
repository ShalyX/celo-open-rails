import type { SVGProps } from "react";

/** The same receipt-bound rail mark used by the favicon. */
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 128 128" role="img" aria-label="Procurement desk mark" {...props}>
      <path d="M22 32h41l18 18M22 64h51M22 96h41l18-18"
        fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="73" y="43" width="37" height="42" rx="8"
        fill="none" stroke="#d6a841" strokeWidth="5"/>
      <path d="m82 64 8 8 12-16" fill="none" stroke="#d6a841"
        strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
