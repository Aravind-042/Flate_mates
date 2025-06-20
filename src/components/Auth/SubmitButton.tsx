
import { Button } from "@/components/ui/button";

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
      className="w-full h-14 text-base font-semibold bg-purple-900 hover:bg-purple-800 text-white rounded-2xl shadow-lg transition-all duration-200"
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        <span>{children}</span>
      )}
    </Button>
  );
};
