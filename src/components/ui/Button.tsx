import type { ReactNode } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { TapTarget } from './TapTarget';

interface Props extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const base = variant === 'primary' ? 'bw-btn' : 'bw-btn-secondary';
  return (
    <TapTarget className={`${base} ${className}`} {...rest}>
      {children}
    </TapTarget>
  );
}
