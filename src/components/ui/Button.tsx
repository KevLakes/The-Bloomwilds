import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { TapTarget } from './TapTarget';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
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
