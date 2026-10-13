import type { SVGProps } from "react";

/** Brand mark: a paw print inside a picture-frame corner motif. */
export function PawMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <rect x="1.5" y="1.5" width="29" height="29" rx="7" stroke="currentColor" strokeWidth="2.2" />
      <ellipse cx="16" cy="20.2" rx="5.4" ry="4.4" fill="currentColor" />
      <ellipse cx="9.6" cy="14.2" rx="2.1" ry="2.7" fill="currentColor" />
      <ellipse cx="13.6" cy="10.4" rx="2.1" ry="2.8" fill="currentColor" />
      <ellipse cx="18.4" cy="10.4" rx="2.1" ry="2.8" fill="currentColor" />
      <ellipse cx="22.4" cy="14.2" rx="2.1" ry="2.7" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-display text-[22px] uppercase leading-none tracking-[0.14em] sm:text-[26px]">Pup Prints</span>
    </span>
  );
}
