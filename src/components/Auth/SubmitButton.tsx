
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";

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
        <TextShimmer 
          className="text-white font-semibold"
          duration={1.5}
        >
          {loadingText}
        </TextShimmer>
      ) : (
        <span>{children}</span>
      )}
    </Button>
  );
};
