
import { CardTitle } from "@/components/ui/card";
import type { ProgressIndicatorProps } from "./types";

export const ProgressIndicator = ({ currentSection, totalSections, sections }: ProgressIndicatorProps) => {
  return (
    <>
      <CardTitle className="flex items-center justify-between text-charcoal">
        <span>{sections[currentSection]}</span>
        <span className="text-sm text-gray-500">
          {currentSection + 1} of {totalSections}
        </span>
      </CardTitle>
      <div className="w-full bg-light-slate rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-deep-blue to-orange h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
        ></div>
      </div>
    </>
  );
};
