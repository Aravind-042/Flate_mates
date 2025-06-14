
import type { FlatListing } from "@/types/flat";

export interface FormSectionProps {
  data: FlatListing;
  onChange: (field: string, value: any) => void;
}

export interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onNext: () => void;
  onPrevious: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export interface ProgressIndicatorProps {
  currentSection: number;
  totalSections: number;
  sections: string[];
}
