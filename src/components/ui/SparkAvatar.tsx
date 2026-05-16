import { motion } from 'framer-motion';
import type { SparkLook } from '@/types';
import { useA11yStore } from '@/stores/a11yStore';

const PALETTE: Record<SparkLook['palette'], { body: string; glow: string; cheek: string }> = {
  sun: { body: '#F9D77E', glow: '#FFE9A6', cheek: '#F4A6C0' },
  sky: { body: '#8DC9E5', glow: '#C4E4F3', cheek: '#F4A6C0' },
  meadow: { body: '#7FB069', glow: '#B5D5A5', cheek: '#F4A6C0' },
  berry: { body: '#F4A6C0', glow: '#FBD3E0', cheek: '#7FB069' },
};

interface Props {
  look: SparkLook;
  size?: number;
  bounce?: boolean;
}

export function SparkAvatar({ look, size = 96, bounce = true }: Props) {
  const motionMode = useA11yStore((s) => s.settings.motion);
  const colors = PALETTE[look.palette];
  const shouldBounce = bounce && motionMode !== 'off';
  const dur = motionMode === 'reduced' ? 3.2 : 1.8;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Spark ${look.form} ${look.palette}`}
      animate={shouldBounce ? { y: [0, -4, 0] } : undefined}
      transition={shouldBounce ? { duration: dur, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      {/* glow */}
      <circle cx="50" cy="50" r="44" fill={colors.glow} opacity="0.55" />
      {/* body — form-specific */}
      {look.form === 'blob' && (
        <circle cx="50" cy="52" r="30" fill={colors.body} stroke="#2E3440" strokeWidth="2.5" />
      )}
      {look.form === 'fox' && (
        <g stroke="#2E3440" strokeWidth="2.5" fill={colors.body}>
          <polygon points="28,30 36,18 42,32" />
          <polygon points="72,30 64,18 58,32" />
          <circle cx="50" cy="55" r="28" />
        </g>
      )}
      {look.form === 'bird' && (
        <g stroke="#2E3440" strokeWidth="2.5" fill={colors.body}>
          <ellipse cx="50" cy="54" rx="28" ry="26" />
          <polygon points="50,42 56,50 50,50" fill="#F9A86A" />
        </g>
      )}
      {/* eyes */}
      <circle cx="40" cy="50" r="3.2" fill="#2E3440" />
      <circle cx="60" cy="50" r="3.2" fill="#2E3440" />
      {/* smile */}
      <path d="M42 62 Q50 70 58 62" stroke="#2E3440" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="36" cy="60" r="3" fill={colors.cheek} opacity="0.7" />
      <circle cx="64" cy="60" r="3" fill={colors.cheek} opacity="0.7" />
      {/* outfit */}
      {look.outfit === 'hat' && (
        <g>
          <rect x="36" y="20" width="28" height="6" fill="#2E3440" />
          <rect x="42" y="10" width="16" height="12" fill="#2E3440" />
        </g>
      )}
      {look.outfit === 'scarf' && (
        <path d="M28 70 Q50 78 72 70 L72 76 Q50 84 28 76 Z" fill={colors.cheek} stroke="#2E3440" strokeWidth="2" />
      )}
    </motion.svg>
  );
}
