import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Slight rotation in degrees for a hand-placed feel. */
  tilt?: number;
  /** Sticker accent color (defaults to current theme accent). */
  accent?: string;
}

/**
 * Sticker-style card: thick rounded border + offset shadow + small tilt.
 * Use for profile cards, region tiles, stickers in the StickerBook.
 */
export function Sticker({
  children,
  tilt = 0,
  accent,
  className = '',
  style,
  ...rest
}: Props) {
  return (
    <div
      className={`bw-sticker ${className}`}
      style={{
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        borderColor: accent,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Sticker;
