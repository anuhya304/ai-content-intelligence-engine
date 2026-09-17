export type Platform = 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'linkedin';
export type Goal = 'growth' | 'engagement' | 'sales' | 'education' | 'brand-awareness';
export type Tone = 'storytelling' | 'professional' | 'friendly' | 'motivational' | 'humorous' | 'controversial';

export interface DiscoveryInput {
  niche: string;
  targetAudience: string;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  topicSeeds: string;
}

export interface GeneratedScript {
  id: string;
  title: string;
  outline: string[];
  fullScript: string;
  framework: string;
}

export interface GeneratedHook {
  id: string;
  text: string;
  type: 'question' | 'statistic' | 'story' | 'bold-claim' | 'pain-point';
}

export interface GeneratedCTA {
  id: string;
  text: string;
  type: 'direct' | 'soft' | 'urgency' | 'value-driven';
}

export interface EngineState {
  step: 1 | 2 | 3;
  discovery: DiscoveryInput;
  scripts: GeneratedScript[];
  selectedScript: GeneratedScript | null;
  hooks: GeneratedHook[];
  ctas: GeneratedCTA[];
  isLoading: boolean;
  researchData: string;
}
