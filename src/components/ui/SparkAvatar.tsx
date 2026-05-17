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
      {/* body — form-specific. Each form has bold silhouette cues so it's
          unambiguous even at thumbnail sizes (Spark closet, profile cards). */}
      {look.form === 'blob' && (
        <circle cx="50" cy="52" r="30" fill={colors.body} stroke="#2E3440" strokeWidth="2.5" />
      )}
      {look.form === 'fox' && (
        <g stroke="#2E3440" strokeWidth="2.5" fill={colors.body} strokeLinejoin="round">
          {/* tall pointed ears */}
          <polygon points="24,26 32,8 40,30" />
          <polygon points="76,26 68,8 60,30" />
          {/* inner ear */}
          <polygon points="30,22 32,14 36,24" fill="#F4A6C0" stroke="none" />
          <polygon points="70,22 68,14 64,24" fill="#F4A6C0" stroke="none" />
          <circle cx="50" cy="56" r="28" />
          {/* fox nose */}
          <ellipse cx="50" cy="64" rx="3" ry="2.4" fill="#2E3440" stroke="none" />
        </g>
      )}
      {look.form === 'bird' && (
        <g stroke="#2E3440" strokeWidth="2.5" fill={colors.body} strokeLinejoin="round">
          {/* body */}
          <ellipse cx="50" cy="54" rx="26" ry="26" />
          {/* wing */}
          <path d="M20 56 Q 30 42 44 50 Q 36 64 22 64 Z" fill={colors.glow} />
          {/* tail tuft */}
          <path d="M78 48 L 92 40 L 86 56 Z" />
          {/* beak */}
          <polygon points="36,52 24,56 36,60" fill="#F9A86A" stroke="#2E3440" strokeWidth="2" />
          {/* head crest */}
          <path d="M50 26 Q 54 14 60 22" stroke="#2E3440" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
