import type { SVGProps } from 'react';

interface FlagProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  /** When false, renders desaturated for "inactive" state. */
  active?: boolean;
}

const baseStyle = { display: 'block' as const };

/** Hand-styled Swedish flag — cyan-blue + buttery yellow cross, paper-edge filter. */
export function SvFlag({ size = 28, active = true, className = '', ...rest }: FlagProps) {
  return (
    <svg
      viewBox="0 0 40 28"
      width={size}
      height={size * (28 / 40)}
      role="img"
      aria-label="Svenska"
      className={className}
      style={{ ...baseStyle, filter: active ? 'url(#bw-paper-edge-sm)' : 'grayscale(1) opacity(0.6)' }}
      {...rest}
    >
      <rect x="0" y="0" width="40" height="28" rx="3" ry="3" fill="#1976C2" />
      <rect x="12" y="0" width="6" height="28" fill="#FFCF3E" />
      <rect x="0" y="11" width="40" height="6" fill="#FFCF3E" />
    </svg>
  );
}

/** Hand-styled English (UK) flag — simplified union jack. */
export function EnFlag({ size = 28, active = true, className = '', ...rest }: FlagProps) {
  return (
    <svg
      viewBox="0 0 40 28"
      width={size}
      height={size * (28 / 40)}
      role="img"
      aria-label="English"
      className={className}
      style={{ ...baseStyle, filter: active ? 'url(#bw-paper-edge-sm)' : 'grayscale(1) opacity(0.6)' }}
      {...rest}
    >
      <rect x="0" y="0" width="40" height="28" rx="3" ry="3" fill="#1B3A8A" />
      {/* white diagonals */}
      <path d="M0 0 L40 28 M40 0 L0 28" stroke="white" strokeWidth="4" />
      {/* red diagonals */}
      <path d="M0 0 L40 28 M40 0 L0 28" stroke="#D62828" strokeWidth="1.8" />
      {/* white cross */}
      <rect x="17" y="0" width="6" height="28" fill="white" />
      <rect x="0" y="11" width="40" height="6" fill="white" />
      {/* red cross */}
      <rect x="18.5" y="0" width="3" height="28" fill="#D62828" />
      <rect x="0" y="12.5" width="40" height="3" fill="#D62828" />
    </svg>
  );
}
