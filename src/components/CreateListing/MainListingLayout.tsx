
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlatListingForm } from "@/components/FlatListingForm";
import { FlatPreview } from "@/components/FlatPreview";
import { PreviewSection } from "./PreviewSection";
import type { FlatListing } from "@/types/flat";

interface MainListingLayoutProps {
  currentStep: 'form' | 'preview';
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
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form/Preview Section */}
      <div>
        {currentStep === 'form' ? (
          <FlatListingForm
            data={listingData}
            onChange={onDataChange}
            onNext={onNext}
          />
        ) : (
          <PreviewSection
            listingData={listingData}
            onBack={onBack}
            userId={userId}
          />
        )}
      </div>

      {/* Live Preview Section */}
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
    </div>
  );
};
