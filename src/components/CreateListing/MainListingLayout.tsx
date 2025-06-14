
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
 * Responsive, balanced split:
 * - On large screens, form and preview each use 1/2 of the max-w-6xl.
 * - Preview's card is taller and fills its column for a dashboard feel.
 * - On mobile, stacks vertically and takes full width on each.
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 h-full min-h-[70vh]"> 
      {/* Left: Form/Preview/Signup Section */}
      <div className="flex flex-col min-h-[50vh]">
        {renderCurrentStep()}
      </div>
      {/* Right: Live Preview - Hidden during signup step */}
      {currentStep !== 'signup' && (
        <div className="lg:sticky lg:top-8 h-full min-h-[350px] flex flex-col">
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
