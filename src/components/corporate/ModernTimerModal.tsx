import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { TimerDisplay } from '@/components/ui/timer-display';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  AlertTriangle,
  Lightbulb,
  MessageSquare,
  Timer,
  Building2,
  Users,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ModernTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  chamado: number;
  currentLevel: number;
  remainingTime: number;
  chamadoData?: any;
  formatTime: (seconds: number) => string;
  onNextLevel: (chamado: number, level: number, observacao: string) => void;
  onPreviousLevel: (chamado: number, level: number, observacao: string) => void;
  updateStatusFinal: (chamado: number, levelStatusKey: string, status: string) => void;
  updateObservacao: (chamado: number, level: number, observacao: string) => void;
}

const LEVEL_INFO = {
  1: {
    title: "Primeiro Acionamento",
    subtitle: "Atendimento inicial e diagnóstico",
    nextAction: "Avançar para 1ª Escalação",
    icon: Clock,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/5 border-blue-200",
    description: "Primeiro contato e análise inicial do problema"
  },
  2: {
    title: "1ª Escalação",
    subtitle: "Suporte técnico especializado",
    nextAction: "Avançar para 2ª Escalação", 
    icon: Users,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/5 border-orange-200",
    description: "Escalação para equipe técnica de primeiro nível"
  },
  3: {
    title: "2ª Escalação",
    subtitle: "Especialistas sêniores",
    nextAction: "Avançar para 3ª Escalação",
    icon: Building2,
    color: "from-red-500 to-red-600", 
    bgColor: "bg-red-500/5 border-red-200",
    description: "Escalação para especialistas técnicos sêniores"
  },
  4: {
    title: "3ª Escalação",
    subtitle: "Time de arquitetura",
    nextAction: "Avançar para 4ª Escalação",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/5 border-purple-200", 
    description: "Escalação para time de arquitetura e especialistas"
  },
  5: {
    title: "4ª Escalação",
    subtitle: "Gestores e decisores técnicos",
    nextAction: "Finalizar Chamado",
    icon: Building2,
    color: "from-red-600 to-red-700",
    bgColor: "bg-red-600/5 border-red-300",
    description: "Escalação máxima - Gestores e decisores técnicos"
  }
};

export const ModernTimerModal: React.FC<ModernTimerModalProps> = ({
  isOpen,
  onClose,
  chamado,
  currentLevel,
  remainingTime,
  chamadoData,
  formatTime,
  onNextLevel,
  onPreviousLevel,
  updateStatusFinal,
  updateObservacao
}) => {
  const [observacao, setObservacao] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const levelStatusKey = `level${currentLevel}_status`;
  const [finalizado, setFinalizado] = useState(
    chamadoData?.statusFinal === "finished" || chamadoData?.[levelStatusKey] === "finished"
  );

  React.useEffect(() => {
    setFinalizado(
      chamadoData?.statusFinal === "finished" || chamadoData?.[levelStatusKey] === "finished"
    );
  }, [chamadoData, levelStatusKey]);

  const levelInfo = finalizado
    ? { 
        title: "Chamado Finalizado", 
        subtitle: "Processo encerrado com sucesso",
        description: "O chamado foi resolvido e encerrado", 
        icon: CheckCircle,
        color: "from-success to-success/90", 
        bgColor: "bg-success/5 border-success/20",
        nextAction: "Finalizado" // Add this missing property
      }
    : LEVEL_INFO[currentLevel as keyof typeof LEVEL_INFO];

  const validateObservacao = useCallback(() => {
    if (!observacao.trim()) {
      toast({
        title: "⚠️ Observação Obrigatória",
        description: "É obrigatório preencher o campo de observações para continuar",
        variant: "destructive",
      });
      return false;
    }
    if (observacao.trim().length < 10) {
      toast({
        title: "⚠️ Observação Muito Curta",
        description: "A observação deve ter pelo menos 10 caracteres",
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [observacao]);

  const handleAction = useCallback(async (action: 'next' | 'previous' | 'finish') => {
    if (!validateObservacao()) return;

    setIsProcessing(true);

    try {
      const trimmedObservacao = observacao.trim();

      if (finalizado && action !== 'previous') {
        toast({
          title: "⚠️ Chamado já finalizado",
          description: "Não é possível alterar níveis pois o chamado está finalizado",
          variant: "destructive",
        });
        return;
      }

      switch (action) {
        case 'next':
          if (currentLevel >= 5) {
            await Promise.all([
              updateStatusFinal(chamado, levelStatusKey, "finished"),
              updateObservacao(chamado, currentLevel, trimmedObservacao)
            ]);
            toast({ 
              title: "✅ Chamado Finalizado", 
              description: `Chamado ${chamado} foi finalizado com sucesso!` 
            });
          } else {
            await updateStatusFinal(chamado, levelStatusKey, "finished");
            await updateObservacao(chamado, currentLevel, trimmedObservacao);
            await onNextLevel(chamado, currentLevel + 1, trimmedObservacao);

            const nextLevelInfo = LEVEL_INFO[(currentLevel + 1) as keyof typeof LEVEL_INFO];
            toast({
              title: `🚀 ${nextLevelInfo?.title} Iniciado`,
              description: `Timer de 20 minutos iniciado para ${nextLevelInfo?.title}`,
            });
          }
          break;

        case 'previous':
          if (currentLevel > 1) {
            await onPreviousLevel(chamado, currentLevel - 1, trimmedObservacao);
            const prevLevelInfo = LEVEL_INFO[(currentLevel - 1) as keyof typeof LEVEL_INFO];
            toast({
              title: `⬅️ Retornando para ${prevLevelInfo?.title}`,
              description: `Timer reiniciado para ${prevLevelInfo?.title}`,
            });
          }
          break;

        case 'finish':
          await Promise.all([
            updateStatusFinal(chamado, levelStatusKey, "finished"),
            updateObservacao(chamado, currentLevel, trimmedObservacao)
          ]);
          setFinalizado(true);
          toast({
            title: "✅ Chamado Finalizado",
            description: `Chamado ${chamado} foi finalizado com sucesso!`,
          });
          break;
      }

      setObservacao('');
      onClose();

    } catch (error) {
      console.error("❌ Erro no handleAction:", error);
      toast({
        title: "❌ Erro na Operação",
        description: "Ocorreu um erro ao processar a ação. Verifique os logs.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [validateObservacao, observacao, currentLevel, chamado, onNextLevel, onPreviousLevel, onClose, updateStatusFinal, updateObservacao, finalizado, levelStatusKey]);

  if (!levelInfo) return null;

  const LevelIcon = levelInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto border-border shadow-modal">
        {/* Header Section */}
        <DialogHeader className="relative pb-8">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-5 rounded-t-lg",
            levelInfo.color
          )} />
          
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "p-4 rounded-2xl bg-gradient-to-r shadow-lg",
                  levelInfo.color,
                  "text-white"
                )}>
                  <LevelIcon className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <DialogTitle className="text-3xl lg:text-4xl font-bold text-foreground">
                    {levelInfo.title}
                  </DialogTitle>
                  <p className="text-lg text-muted-foreground">
                    {levelInfo.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm font-medium">
                      Chamado #{chamado}
                    </Badge>
                    <Badge 
                      variant={finalizado ? "default" : "secondary"}
                      className={cn(
                        "text-sm font-medium",
                        finalizado && "bg-success text-success-foreground"
                      )}
                    >
                      {finalizado ? "Finalizado" : "Em Andamento"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="lg:self-start"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className={cn(
              "p-4 rounded-xl border-l-4",
              levelInfo.bgColor
            )}>
              <p className="text-sm text-muted-foreground">
                {levelInfo.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Timer and Progress Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <TimerDisplay 
              remainingTime={remainingTime} 
              formatTime={formatTime}
              className="w-full"
            />
            <ProgressIndicator 
              currentLevel={currentLevel}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Observations Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <Label htmlFor="observacao" className="text-xl font-semibold text-foreground">
                Observações Técnicas
              </Label>
              <Badge variant="destructive" className="text-xs font-bold">
                OBRIGATÓRIO
              </Badge>
            </div>

            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder={`Descreva detalhadamente as ações realizadas em ${levelInfo.title.toLowerCase()}, diagnósticos feitos, status atual e próximos passos recomendados...`}
              rows={8}
              className="border-2 focus:border-primary transition-all duration-200 resize-none text-base min-h-[120px]"
              disabled={isProcessing || finalizado}
              maxLength={1000}
            />

            <div className="flex justify-between items-center">
              <span className={cn(
                "text-sm font-medium",
                observacao.length > 900 ? "text-warning" : "text-muted-foreground"
              )}>
                {observacao.length}/1000 caracteres
              </span>
              {observacao.trim().length >= 10 && (
                <div className="flex items-center gap-2 text-success font-medium text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Observação válida</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Previous Level Button */}
              {currentLevel > 1 && !finalizado && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => handleAction('previous')}
                  disabled={!observacao.trim() || observacao.trim().length < 10 || isProcessing}
                  className="h-20 border-2 hover:border-primary/50 transition-all duration-200"
                >
                  <ArrowLeft className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-base">Voltar Etapa</div>
                    <div className="text-sm opacity-70">Retornar ao nível anterior</div>
                  </div>
                </Button>
              )}

              {/* Finish Button */}
              <Button
                variant="warning"
                size="xl"
                onClick={() => handleAction('finish')}
                disabled={!observacao.trim() || observacao.trim().length < 10 || isProcessing || finalizado}
                className={cn(
                  "h-20",
                  currentLevel === 1 && "md:col-span-2 xl:col-span-2"
                )}
              >
                <CheckCircle className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold text-base">Resolver Agora</div>
                  <div className="text-sm opacity-90">Finalizar chamado</div>
                </div>
              </Button>

              {/* Next Level Button */}
              <Button
                variant={currentLevel >= 5 || finalizado ? "success" : "timer"}
                size="xl"
                onClick={() => handleAction('next')}
                disabled={!observacao.trim() || observacao.trim().length < 10 || isProcessing || finalizado}
                className="h-20 animate-glow"
              >
                {finalizado ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold text-base">Finalizado</div>
                      <div className="text-sm opacity-90">Chamado encerrado</div>
                    </div>
                  </>
                ) : currentLevel >= 5 ? (
                  <>
                    <CheckCircle className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold text-base">Concluir Final</div>
                      <div className="text-sm opacity-90">Última escalação</div>
                    </div>
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-6 w-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold text-base">{levelInfo.nextAction}</div>
                      <div className="text-sm opacity-90">Avançar escalação</div>
                    </div>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="gradient-modal rounded-2xl p-6 border border-border/50">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-primary" />
                <h4 className="font-semibold text-foreground text-xl">Diretrizes de Monitoração</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">Observações Obrigatórias</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Documente todas as ações realizadas, diagnósticos e próximos passos.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Timer className="h-5 w-5" />
                    <span className="font-semibold">Timer Renovado</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cada escalação reinicia o timer de 20 minutos automaticamente.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Resolução Rápida</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use "Resolver Agora" quando o problema estiver solucionado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-2xl shadow-2xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-lg font-medium">Processando ação...</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};