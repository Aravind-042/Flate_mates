
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { PreviewSection } from "./PreviewSection";
import { SignupPrompt } from "./SignupPrompt";
import type { FlatListing } from "@/types/flat";

interface MainListingLayoutProps {
  currentStep: 'form' | 'preview' | 'signup';
  listingData: FlatListing;
  onDataChange: (updates: Partial<FlatListing>) => void;
  onNext: () => void;
  onBack: () => void;
  userId: string;
}

/**
 * Enhanced responsive layout:
 * - Mobile: stacks vertically with optimized spacing
 * - Tablet: improved column ratios
 * - Desktop: maintains side-by-side layout with better proportions
 */
export const MainListingLayout = ({
  currentStep,
  listingData,
  onDataChange,
  onNext,
  onBack,
  userId
}: MainListingLayoutProps) => {
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return (
          <FlatListingForm
            data={listingData}
            onChange={onDataChange}
            onNext={onNext}
          />
        );
      case 'preview':
        return (
          <PreviewSection
            listingData={listingData}
            onBack={onBack}
            onNext={onNext}
            userId={userId}
          />
        );
      case 'signup':
        return <SignupPrompt onBack={onBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-4 sm:gap-6 lg:gap-8 h-full min-h-[70vh] w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Left: Form/Preview/Signup Section */}
      <div className="flex flex-col min-h-[50vh] w-full max-w-full order-2 xl:order-1">
        {renderCurrentStep()}
      </div>
      
      {/* Right: Live Preview - Hidden during signup step, shows above form on mobile */}
      {currentStep === 'form' && (
        <div className="xl:sticky xl:top-8 h-full min-h-[300px] sm:min-h-[350px] flex flex-col w-full max-w-full order-1 xl:order-2">
          <Card className="glass-card flex flex-col h-full min-h-[300px] sm:min-h-[350px]">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-charcoal">
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 pt-0">
              {/* Mobile: fixed height with scroll, Desktop: fill available space */}
              <div className="flex-1 min-h-0 max-h-[40vh] xl:max-h-[70vh] overflow-y-auto">
                <FlatPreview data={listingData} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
