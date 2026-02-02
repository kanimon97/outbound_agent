export interface BritishVoice {
  id: string;
  name: string;
  description: string;
}

// Custom voices from your ElevenLabs account
export const BRITISH_VOICES: BritishVoice[] = [
  { id: "Q0HZwrR1H2SmRvd5cX3U", name: "Charlie", description: "Custom voice" },
];
