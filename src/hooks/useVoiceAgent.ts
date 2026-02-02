import Vapi from "@vapi-ai/web";
import { useState, useCallback, useRef, useEffect } from "react";
import { AgentState } from "@/components/Orb";
import { BritishVoice } from "@/lib/voices";

// Vapi Public API Key - should be in environment variable
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || "";
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "";

export interface LatencyInfo {
  current: number | null;
  average: number | null;
  min: number | null;
  max: number | null;
}

export function useVoiceAgent(selectedVoice: BritishVoice) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"disconnected" | "connected">("disconnected");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [latency, setLatency] = useState<LatencyInfo>({
    current: null,
    average: null,
    min: null,
    max: null,
  });
  
  const vapiRef = useRef<Vapi | null>(null);
  const inputVolumeRef = useRef(0);
  const outputVolumeRef = useRef(0);
  
  // Latency tracking refs
  const userStoppedSpeakingTimeRef = useRef<number | null>(null);
  const latencyMeasurementsRef = useRef<number[]>([]);

  // Initialize Vapi client
  useEffect(() => {
    if (!vapiRef.current && VAPI_PUBLIC_KEY) {
      vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
    }
    
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!VAPI_PUBLIC_KEY) {
        throw new Error("Vapi Public Key not configured");
      }

      if (!VAPI_ASSISTANT_ID) {
        throw new Error("Vapi Assistant ID not configured");
      }

      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize Vapi if not already done
      if (!vapiRef.current) {
        vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
      }

      const vapi = vapiRef.current;

      // Set up event listeners
      vapi.on("call-start", () => {
        console.log("Call started");
        setStatus("connected");
        setError(null);
        setLatency({ current: null, average: null, min: null, max: null });
        latencyMeasurementsRef.current = [];
      });

      vapi.on("call-end", () => {
        console.log("Call ended");
        setStatus("disconnected");
      });

      vapi.on("speech-start", () => {
        console.log("User started speaking");
        userStoppedSpeakingTimeRef.current = null;
      });

      vapi.on("speech-end", () => {
        console.log("User stopped speaking");
        userStoppedSpeakingTimeRef.current = performance.now();
      });

      vapi.on("message", (message: any) => {
        console.log("Message received:", message);
        
        // Track agent response for latency
        if (message.type === "transcript" && message.role === "assistant" && userStoppedSpeakingTimeRef.current) {
          const responseTime = performance.now();
          const latencyMs = Math.round(responseTime - userStoppedSpeakingTimeRef.current);
          
          console.log("Agent response latency:", latencyMs, "ms");
          
          // Update measurements
          latencyMeasurementsRef.current.push(latencyMs);
          const measurements = latencyMeasurementsRef.current;
          
          const avg = Math.round(measurements.reduce((a, b) => a + b, 0) / measurements.length);
          const min = Math.min(...measurements);
          const max = Math.max(...measurements);
          
          setLatency({
            current: latencyMs,
            average: avg,
            min: min,
            max: max,
          });
          
          userStoppedSpeakingTimeRef.current = null;
        }
      });

      vapi.on("error", (error: any) => {
        console.error("Vapi error:", error);
        setError(error.message || "Connection error");
      });

      // Start the call with assistant ID and overrides
      await vapi.start(VAPI_ASSISTANT_ID, {
        voice: {
          provider: "11labs",
          voiceId: selectedVoice.id,
        },
      });
      
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError(err instanceof Error ? err.message : "Failed to start conversation");
      setStatus("disconnected");
    } finally {
      setIsConnecting(false);
    }
  }, [selectedVoice]);

  const stopConversation = useCallback(async () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setStatus("disconnected");
    }
  }, []);

  // Map status to orb agent state
  const getAgentState = (): AgentState => {
    if (status !== "connected") return null;
    if (isSpeaking) return "talking";
    return "listening";
  };

  // Volume tracking (Vapi doesn't provide direct volume access like ElevenLabs)
  // We'll use placeholder values for now
  const getInputVolume = useCallback(() => {
    return status === "connected" ? 0.5 : 0;
  }, [status]);

  const getOutputVolume = useCallback(() => {
    return isSpeaking ? 0.7 : 0.3;
  }, [isSpeaking]);

  return {
    status,
    isSpeaking,
    isConnecting,
    error,
    latency,
    agentState: getAgentState(),
    inputVolumeRef,
    outputVolumeRef,
    updateVolumes: () => {}, // Placeholder
    startConversation,
    stopConversation,
    getInputVolume,
    getOutputVolume,
  };
}
