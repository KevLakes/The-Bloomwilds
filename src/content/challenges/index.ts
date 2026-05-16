import type { ChallengeDef } from '@/engine/challenge/types';
import { letterMatch } from './letterglade/letter-match';
import { wordBuild } from './letterglade/word-build';
import { phonicsPop } from './letterglade/phonics-pop';
import { countLilies } from './numberbrook/count-lilies';
import { frogJumpAdd } from './numberbrook/frog-jump-add';
import { numberTrace } from './numberbrook/number-trace';
import { habitatSort } from './critter-cove/habitat-sort';
import { lifecycleOrder } from './critter-cove/lifecycle-order';
import { critterCall } from './critter-cove/critter-call';
import { patternFinish } from './hue-hills/pattern-finish';
import { shapeSort } from './hue-hills/shape-sort';
import { colorMix } from './hue-hills/color-mix';
import { nameTheFeeling } from './feelings-meadow/name-the-feeling';
import { calmBreath } from './feelings-meadow/calm-breath';
import { empathyPick } from './feelings-meadow/empathy-pick';

export const allChallenges: ChallengeDef[] = [
  letterMatch,
  wordBuild,
  phonicsPop,
  countLilies,
  frogJumpAdd,
  numberTrace,
  habitatSort,
  lifecycleOrder,
  critterCall,
  patternFinish,
  shapeSort,
  colorMix,
  nameTheFeeling,
  calmBreath,
  empathyPick,
];
