
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
 * Responsive split:
 * - On large screens, form uses ~45% width and preview uses ~55% (5:6 ratio).
 * - On mobile, stacks vertically.
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 md:gap-8 h-full min-h-[70vh] w-full max-w-6xl mx-auto">
      {/* Left: Form/Preview/Signup Section */}
      <div className="flex flex-col min-h-[50vh] w-full max-w-full">
        {renderCurrentStep()}
      </div>
      {/* Right: Live Preview - Hidden during signup step */}
      {currentStep !== 'signup' && (
        <div className="lg:sticky lg:top-8 h-full min-h-[350px] flex flex-col w-full max-w-full">
          <Card className="glass-card flex flex-col h-full min-h-[350px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-charcoal">
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              {/* Fill available vertical space, enable internal scroll on overflow */}
              <div className="flex-1 min-h-0 max-h-[70vh] overflow-y-auto">
                <FlatPreview data={listingData} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
