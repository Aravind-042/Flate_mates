
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  onClick: () => void;
  children: React.ReactNode;
  loadingText: string;
}

export const SubmitButton = ({ isLoading, onClick, children, loadingText }: SubmitButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isLoading}
      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
    >
      {isLoading ? (
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6" />
          <span>{children}</span>
        </div>
      )}
    </Button>
  );
};
