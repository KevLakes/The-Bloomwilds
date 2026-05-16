import type { ChallengeResult, Lang, RegionId } from '@/types';

export type ChallengeKind = 'match' | 'pick' | 'sort' | 'order' | 'trace' | 'breath' | 'color-mix';

export interface MatchSpec {
  kind: 'match';
  prompt: string;
  pairs: { id: string; left: string; right: string; soundKey?: string }[];
}

export interface PickSpec {
  kind: 'pick';
  prompt: string;
  options: { id: string; label: string; isCorrect: boolean; soundKey?: string }[];
  pickCount?: number;
}

export interface SortSpec {
  kind: 'sort';
  prompt: string;
  bins: { id: string; label: string; icon?: string }[];
  items: { id: string; label: string; binId: string }[];
}

export interface OrderSpec {
  kind: 'order';
  prompt: string;
  items: { id: string; label: string; rank: number }[];
}

export type ChallengeSpec = MatchSpec | PickSpec | SortSpec | OrderSpec;

export interface ChallengeContext {
  lang: Lang;
  t: (key: string, opts?: Record<string, unknown>) => string;
  narrate: (key: string, opts?: { simple?: boolean }) => Promise<void>;
  sfx: (name: 'sparkle' | 'bloom' | 'success' | 'gentle-error') => void;
  registerUndo: (fn: () => void) => void;
}

export interface ChallengeProps {
  ctx: ChallengeContext;
  onComplete: (result: ChallengeResult) => void;
  onExit: () => void;
}

export interface ChallengeDef {
  id: string;
  regionId: RegionId;
  titleKey: string;
  narrationKey: string;
  estSeconds: number;
  tags: ('reading' | 'math' | 'motor' | 'social' | 'pattern')[];
  /** Static spec when the challenge is one of the primitive kinds. */
  spec?: Partial<Record<Lang, ChallengeSpec>>;
  /** Custom component when a bespoke mini-game is needed. */
  component?: () => Promise<{ default: React.ComponentType<ChallengeProps> }>;
  hiddenBehind?: { secretId: string };
  /** Sticker awarded on first successful completion. */
  stickerOnFirstClear?: string;
  seedsAwarded?: number;
}
