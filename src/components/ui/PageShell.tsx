import { useEffect } from 'react';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import type { RegionId } from '@/types';

interface PageShellProps {
  children: React.ReactNode;
  /** Region whose theme should be applied while this page is mounted */
  region?: RegionId | 'home';
  /** "default" wraps children in a fluid content column with background gradient; "bare" gives the page full bleed control */
  variant?: 'default' | 'bare';
  /** Constrains the content column. "wide" = max content; "narrow" = forms/onboarding */
  width?: 'wide' | 'narrow' | 'full';
  /** Optional class merged onto the outer page element */
  className?: string;
  /** Optional class merged onto the inner content column (default variant only) */
  contentClassName?: string;
}

export function PageShell({
  children,
  region,
  variant = 'default',
  width = 'wide',
  className = '',
  contentClassName = '',
}: PageShellProps) {
  useEffect(() => {
    if (region) applyRegionTheme(region);
  }, [region]);

  if (variant === 'bare') {
    return <main className={`bw-page-bare ${className}`}>{children}</main>;
  }

  const widthClass =
    width === 'narrow' ? 'bw-content-narrow' : width === 'full' ? 'w-full' : 'bw-content';

  return (
    <main className={`bw-page ${className}`}>
      <div className={`${widthClass} bw-stack ${contentClassName}`}>{children}</div>
    </main>
  );
}

export default PageShell;
