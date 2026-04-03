import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBattle } from "@/hooks/useBattle";
import { Zap, ShieldAlert } from "lucide-react";

const AttackedDialog = () => {
  const {
    attackedPrompt,
    setAttackedPrompt,
    handleAttacked,
    handleSkipAttacked,
  } = useBattle();
  return (
    <Dialog
      open={attackedPrompt}
      onOpenChange={(open) => {
        if (!open) setAttackedPrompt(false);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-sm z-60 border border-[#5a3408] bg-[#1a0a00] shadow-[0_0_40px_rgba(240,208,144,0.12)] rounded-lg overflow-hidden p-0"
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#5a3408] bg-[rgba(10,4,1,0.6)]">
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="size-5 text-[#f0d090]" />
            <DialogTitle className="font-['Cinzel'] text-[#f0d090] tracking-[0.15em] text-base font-bold uppercase">
              Você está sendo atacado!
            </DialogTitle>
          </div>
          <DialogDescription className="font-['Cinzel'] text-[#7a5020] text-xs tracking-widest uppercase mt-1 text-center">
            Janela de resposta
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[#f0d090]/80">
            <Zap className="size-4" />
            <p className="font-['Cinzel'] text-sm text-center">
              Você pode ativar efeitos agora, deseja ativar?
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              onClick={() => {
                handleSkipAttacked();
                setAttackedPrompt(false);
              }}
              variant="outline"
              className="flex-1 border-[#5a3408] bg-transparent text-[#f0d090] hover:bg-[#5a3408]/30 hover:text-[#f0d090] font-['Cinzel'] tracking-wider uppercase text-xs"
            >
              Não
            </Button>
            <Button
              onClick={() => {
                handleAttacked();
                setAttackedPrompt(false);
              }}
              className="flex-1 bg-[#f0d090] text-[#1a0a00] hover:bg-[#d4b570] font-['Cinzel'] tracking-wider uppercase text-xs font-bold"
            >
              <Zap className="size-3.5 mr-1" />
              Sim
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttackedDialog;
