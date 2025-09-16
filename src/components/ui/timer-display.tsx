import { cn } from "@/lib/utils";
import { Timer, AlertTriangle, CheckCircle } from "lucide-react";

interface TimerDisplayProps {
  remainingTime: number;
  formatTime: (seconds: number) => string;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  remainingTime,
  formatTime,
  className
}) => {
  const isCritical = remainingTime <= 300; // 5 minutes
  const isWarning = remainingTime <= 600; // 10 minutes
  const isExpired = remainingTime <= 0;
  
  const getTimerStatus = () => {
    if (isExpired) return { icon: AlertTriangle, status: "Tempo Esgotado", color: "destructive" };
    if (isCritical) return { icon: AlertTriangle, status: "Crítico", color: "destructive" };
    if (isWarning) return { icon: Timer, status: "Atenção", color: "warning" };
    return { icon: Timer, status: "Normal", color: "primary" };
  };
  
  const { icon: StatusIcon, status, color } = getTimerStatus();
  
  return (
    <div className={cn("timer-display", className, {
      "timer-critical": isCritical || isExpired
    })}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            {
              "bg-primary text-primary-foreground": color === "primary",
              "bg-warning text-warning-foreground": color === "warning", 
              "bg-destructive text-destructive-foreground": color === "destructive"
            }
          )}>
            <StatusIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Tempo Restante</h3>
            <p className={cn(
              "text-sm font-medium",
              {
                "text-primary": color === "primary",
                "text-warning": color === "warning",
                "text-destructive": color === "destructive"
              }
            )}>
              Status: {status}
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <div className={cn(
          "text-5xl font-mono font-bold tracking-tight mb-2",
          {
            "text-foreground": color === "primary",
            "text-warning": color === "warning",
            "text-destructive": color === "destructive"
          }
        )}>
          {formatTime(Math.max(0, remainingTime))}
        </div>
        
        <div className="flex justify-center">
          <div className={cn(
            "px-4 py-2 rounded-full text-sm font-medium",
            {
              "bg-primary/10 text-primary": color === "primary",
              "bg-warning/10 text-warning": color === "warning",
              "bg-destructive/10 text-destructive": color === "destructive"
            }
          )}>
            {isExpired ? "⏰ Timer Expirado" : 
             isCritical ? "🚨 Tempo Crítico" :
             isWarning ? "⚠️ Atenção ao Tempo" :
             "⏳ Tempo Normal"}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-out rounded-full",
              {
                "bg-primary": color === "primary",
                "bg-warning": color === "warning",
                "bg-destructive": color === "destructive"
              }
            )}
            style={{ 
              width: `${Math.max(0, Math.min(100, (remainingTime / 1200) * 100))}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>0:00</span>
          <span>20:00</span>
        </div>
      </div>
    </div>
  );
};