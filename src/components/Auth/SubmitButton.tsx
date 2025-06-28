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
      className="btn-primary w-full"
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