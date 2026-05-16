import type { ChallengeDef } from '@/engine/challenge/types';
import { letterMatch } from './letterglade/letter-match';
import { wordBuild } from './letterglade/word-build';
import { phonicsPop } from './letterglade/phonics-pop';

export const allChallenges: ChallengeDef[] = [letterMatch, wordBuild, phonicsPop];
