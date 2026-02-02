import { useState } from "react";
import { Orb } from "@/components/Orb";
import { LatencyIndicator } from "@/components/LatencyIndicator";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { BRITISH_VOICES } from "@/lib/voices";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";

const Index = () => {
  // Always use Charlie's voice
  const selectedVoice = BRITISH_VOICES[0];
  
  const {
    status,
    isConnecting,
    error,
    latency,
    agentState,
    startConversation,
    stopConversation,
    getInputVolume,
    getOutputVolume
  } = useVoiceAgent(selectedVoice);
  
  const isConnected = status === "connected";

  return <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* Status indicator */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Voice Agent</h1>
          <p className="text-sm text-muted-foreground">
            {isConnected ? "Connected" : "Click to start speaking"}
          </p>
        </div>

        {/* Orb visualization */}
        <div className="w-64 h-64">
          <Orb agentState={agentState} volumeMode={isConnected ? "manual" : "auto"} getInputVolume={getInputVolume} getOutputVolume={getOutputVolume} colors={["#3B82F6", "#8B5CF6"]} />
        </div>

        {/* Latency indicator */}
        <LatencyIndicator latency={latency} isConnected={isConnected} />

        {/* Error message */}
        {error && <div className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-md">
            {error}
          </div>}

        {/* Control button */}
        <Button size="lg" onClick={isConnected ? stopConversation : startConversation} disabled={isConnecting} className="w-full max-w-xs" variant={isConnected ? "destructive" : "default"}>
          {isConnecting ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </> : isConnected ? <>
              <MicOff className="mr-2 h-4 w-4" />
              End Conversation
            </> : <>
              <Mic className="mr-2 h-4 w-4" />
              Start Conversation
            </>}
        </Button>

        {/* Latency info */}
        {isConnected && <p className="text-xs text-muted-foreground text-center">
            Speak naturally to test latency and voice quality
          </p>}
      </div>
    </div>;
};

export default Index;