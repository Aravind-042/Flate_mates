
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form/Preview/Signup Section */}
      <div>
        {renderCurrentStep()}
      </div>

      {/* Live Preview Section - Hide during signup step */}
      {currentStep !== 'signup' && (
        <div className="lg:sticky lg:top-8 h-fit">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-charcoal">
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FlatPreview data={listingData} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
