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
      className="btn-primary w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={isLoading ? loadingText : children?.toString()}
      tabIndex={0}
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