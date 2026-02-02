import { BRITISH_VOICES, BritishVoice } from "@/lib/voices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceSelectorProps {
  selectedVoice: BritishVoice;
  onVoiceChange: (voice: BritishVoice) => void;
  disabled?: boolean;
}

export function VoiceSelector({ selectedVoice, onVoiceChange, disabled }: VoiceSelectorProps) {
  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Select British Accent
      </label>
      <Select
        value={selectedVoice.id}
        onValueChange={(id) => {
          const voice = BRITISH_VOICES.find((v) => v.id === id);
          if (voice) onVoiceChange(voice);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue placeholder="Choose a voice" />
        </SelectTrigger>
        <SelectContent>
          {BRITISH_VOICES.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex flex-col">
                <span className="font-medium">{voice.name}</span>
                <span className="text-xs text-muted-foreground">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
