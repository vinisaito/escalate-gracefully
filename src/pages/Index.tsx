import { Button } from "@/components/ui/button";
import { ModernTimerModal } from "@/components/corporate/ModernTimerModal";
import { useState } from "react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data for demonstration
  const mockData = {
    chamado: 12345,
    currentLevel: 2,
    remainingTime: 900, // 15 minutes
    chamadoData: {
      statusFinal: "running",
      level2_status: "running"
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNextLevel = async (chamado: number, level: number, observacao: string) => {
    console.log('Next level:', { chamado, level, observacao });
  };

  const updateStatusFinal = async (chamado: number, levelStatusKey: string, status: string) => {
    console.log('Update status:', { chamado, levelStatusKey, status });
  };

  const updateObservacao = async (chamado: number, level: number, observacao: string) => {
    console.log('Update observation:', { chamado, level, observacao });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Action Table
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sistema Corporativo de Monitoração e Escalação de Chamados
          </p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Demonstração do Modal de Escalação
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Modal profissional redesenhado para equipes de monitoração corporativa com interface 
            responsiva, design system corporativo e experiência otimizada para diferentes dispositivos.
          </p>
          
          <Button 
            variant="corporate" 
            size="xl"
            onClick={() => setIsModalOpen(true)}
            className="text-lg px-8"
          >
            Abrir Modal de Escalação
          </Button>
        </div>
      </div>

      <ModernTimerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chamado={mockData.chamado}
        currentLevel={mockData.currentLevel}
        remainingTime={mockData.remainingTime}
        chamadoData={mockData.chamadoData}
        formatTime={formatTime}
        onNextLevel={handleNextLevel}
        updateStatusFinal={updateStatusFinal}
        updateObservacao={updateObservacao}
      />
    </div>
  );
};

export default Index;
