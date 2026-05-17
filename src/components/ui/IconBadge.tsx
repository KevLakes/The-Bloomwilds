import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  label?: ReactNode;
  value: ReactNode;
  /** Optional tint for the background pill. Defaults to white-soft. */
  tint?: string;
  className?: string;
}

/**
 * Compact pill showing an icon, a count, and an optional label.
 * Used for inventory counters (seeds, stickers, streak, etc.) on Home + headers.
 */
export function IconBadge({ icon, label, value, tint, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 font-display font-bold shadow-bloom ${className}`}
      style={{ background: tint ?? 'color-mix(in srgb, white 90%, transparent)' }}
    >
      <span aria-hidden className="text-lg leading-none">
        {icon}
      </span>
      <span className="leading-none">{value}</span>
      {label && (
        <span className="text-xs font-normal text-ink-soft leading-none">{label}</span>
      )}
    </span>
  );
}

export default IconBadge;
