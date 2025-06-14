
import { Button } from "@/components/ui/button";
import type { NavigationProps } from "./types";

export const NavigationButtons = ({ 
  currentSection, 
  totalSections, 
  onNext, 
  onPrevious, 
  isFirstSection, 
  isLastSection 
}: NavigationProps) => {
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstSection}
        className="border-light-slate text-charcoal hover:text-deep-blue hover:border-deep-blue"
      >
        Previous
      </Button>
      <Button
        onClick={onNext}
        className="bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white"
      >
        {isLastSection ? 'Preview Listing' : 'Next'}
      </Button>
    </div>
  );
};
