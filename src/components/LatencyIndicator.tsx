import { LatencyInfo } from "@/hooks/useVoiceAgent";
import { Clock, TrendingDown, TrendingUp, Activity } from "lucide-react";

interface LatencyIndicatorProps {
  latency: LatencyInfo;
  isConnected: boolean;
}

function getLatencyColor(ms: number): string {
  if (ms < 300) return "text-green-500";
  if (ms < 600) return "text-yellow-500";
  if (ms < 1000) return "text-orange-500";
  return "text-red-500";
}

function getLatencyLabel(ms: number): string {
  if (ms < 300) return "Excellent";
  if (ms < 600) return "Good";
  if (ms < 1000) return "Fair";
  return "Slow";
}

export function LatencyIndicator({ latency, isConnected }: LatencyIndicatorProps) {
  if (!isConnected) {
    return (
      <div className="w-full max-w-xs bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Latency monitoring inactive</span>
        </div>
      </div>
    );
  }

  const hasData = latency.current !== null;

  return (
    <div className="w-full max-w-xs bg-card border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Response Latency</span>
        </div>
        {hasData && (
          <span className={`text-xs font-medium ${getLatencyColor(latency.current!)}`}>
            {getLatencyLabel(latency.current!)}
          </span>
        )}
      </div>

      {hasData ? (
        <>
          {/* Current latency - prominent display */}
          <div className="text-center py-2">
            <span className={`text-3xl font-bold ${getLatencyColor(latency.current!)}`}>
              {latency.current}
            </span>
            <span className="text-lg text-muted-foreground ml-1">ms</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingDown className="h-3 w-3" />
                <span className="text-xs">Min</span>
              </div>
              <span className="text-sm font-medium text-foreground">{latency.min}ms</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Avg</span>
              </div>
              <span className="text-sm font-medium text-foreground">{latency.average}ms</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Max</span>
              </div>
              <span className="text-sm font-medium text-foreground">{latency.max}ms</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Start speaking to measure latency...
          </p>
        </div>
      )}
    </div>
  );
}
