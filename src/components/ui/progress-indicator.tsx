import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface ProgressIndicatorProps {
  currentLevel: number;
  className?: string;
}

const LEVELS = [
  { id: 1, label: "1º Contato", shortLabel: "1º" },
  { id: 2, label: "1ª Escalação", shortLabel: "1ª" },
  { id: 3, label: "2ª Escalação", shortLabel: "2ª" },
  { id: 4, label: "3ª Escalação", shortLabel: "3ª" },
  { id: 5, label: "4ª Escalação", shortLabel: "4ª" }
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentLevel,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Progresso da Escalação</h3>
        <span className="text-sm text-muted-foreground">
          Nível {currentLevel} de 5
        </span>
      </div>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ 
              width: `${Math.max(0, ((currentLevel - 1) / (LEVELS.length - 1)) * 100)}%` 
            }}
          />
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-between relative">
          {LEVELS.map((level) => {
            const isCompleted = level.id < currentLevel;
            const isActive = level.id === currentLevel;
            const isPending = level.id > currentLevel;
            
            return (
              <div key={level.id} className="flex flex-col items-center group">
                {/* Step Circle */}
                <div
                  className={cn(
                    "progress-step relative z-10",
                    {
                      "progress-step-completed": isCompleted,
                      "progress-step-active": isActive,
                      "progress-step-pending": isPending
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center min-w-0">
                  <div className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    {
                      "text-success": isCompleted,
                      "text-primary": isActive,
                      "text-muted-foreground": isPending
                    }
                  )}>
                    <span className="hidden sm:inline">{level.label}</span>
                    <span className="sm:hidden">{level.shortLabel}</span>
                  </div>
                  
                  {isActive && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Em andamento
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="text-xs text-success/70 mt-1">
                      Concluído
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};