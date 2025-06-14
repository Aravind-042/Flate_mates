
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackToProfileButtonProps {
  onBack: () => void;
}

export const BackToProfileButton = ({ onBack }: BackToProfileButtonProps) => {
  return (
    <div className="mt-8 text-center">
      <Button
        variant="outline"
        onClick={onBack}
        className="border-2 border-light-slate rounded-xl text-charcoal hover:text-deep-blue"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button>
    </div>
  );
};
