
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressIndicator } from "@/components/CreateListing/FormSections/ProgressIndicator";
import { NavigationButtons } from "@/components/CreateListing/FormSections/NavigationButtons";
import { BasicDetailsSection } from "@/components/CreateListing/FormSections/BasicDetailsSection";
import { LocationSection } from "@/components/CreateListing/FormSections/LocationSection";
import { PropertyDetailsSection } from "@/components/CreateListing/FormSections/PropertyDetailsSection";
import { RentCostsSection } from "@/components/CreateListing/FormSections/RentCostsSection";
import { AmenitiesSection } from "@/components/CreateListing/FormSections/AmenitiesSection";
import { PreferencesSection } from "@/components/CreateListing/FormSections/PreferencesSection";
import { ImagesContactSection } from "@/components/CreateListing/FormSections/ImagesContactSection";
import type { FlatListing } from "@/types/flat";

interface FlatListingFormProps {
  data: FlatListing;
  onChange: (data: Partial<FlatListing>) => void;
  onNext: () => void;
}

export const FlatListingForm = ({ data, onChange, onNext }: FlatListingFormProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  
  const sections = [
    "Basic Details",
    "Location",
    "Property Details",
    "Rent & Costs",
    "Amenities",
    "Flatmate Preferences",
    "Images & Contact"
  ];

  const handleInputChange = (field: string, value: any) => {
    const fieldParts = field.split('.');
    if (fieldParts.length === 1) {
      onChange({ [field]: value });
    } else {
      const currentObject = data[fieldParts[0] as keyof FlatListing] as Record<string, any>;
      onChange({
        [fieldParts[0]]: {
          ...currentObject,
          [fieldParts[1]]: value
        }
      });
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = () => {
    const sectionProps = { data, onChange: handleInputChange };
    
    switch (currentSection) {
      case 0:
        return <BasicDetailsSection {...sectionProps} />;
      case 1:
        return <LocationSection {...sectionProps} />;
      case 2:
        return <PropertyDetailsSection {...sectionProps} />;
      case 3:
        return <RentCostsSection {...sectionProps} />;
      case 4:
        return <AmenitiesSection {...sectionProps} />;
      case 5:
        return <PreferencesSection {...sectionProps} />;
      case 6:
        return <ImagesContactSection {...sectionProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full glass-card">
      <CardHeader>
        <ProgressIndicator 
          currentSection={currentSection}
          totalSections={sections.length}
          sections={sections}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderSection()}
          
          <NavigationButtons
            currentSection={currentSection}
            totalSections={sections.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstSection={currentSection === 0}
            isLastSection={currentSection === sections.length - 1}
          />
        </div>
      </CardContent>
    </Card>
  );
};
