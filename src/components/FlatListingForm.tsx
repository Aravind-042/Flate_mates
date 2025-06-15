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

// Define the list of required fields for each section of the form.
const requiredFieldsBySection = [
  // BASIC DETAILS
  (data: FlatListing) => ({
    title: data.title ? undefined : "Title is required",
    description: data.description ? undefined : "Description is required",
  }),
  // LOCATION
  (data: FlatListing) => ({
    "location.city": data.location.city ? undefined : "City is required",
    "location.area": data.location.area ? undefined : "Area/Locality is required",
  }),
  // PROPERTY
  (data: FlatListing) => ({
    "property.type": data.property.type ? undefined : "Property type is required",
    "property.bedrooms":
      Number.isFinite(data.property.bedrooms) && data.property.bedrooms > 0
        ? undefined
        : "Bedrooms required",
    "property.bathrooms":
      Number.isFinite(data.property.bathrooms) && data.property.bathrooms > 0
        ? undefined
        : "Bathrooms required",
  }),
  // RENT
  (data: FlatListing) => ({
    "rent.amount": data.rent.amount > 0 ? undefined : "Monthly rent required",
    // deposit can be 0, so not required!
  }),
  // AMENITIES
  (data: FlatListing) => ({
    // no required amenities by default
  }),
  // PREFERENCES
  (data: FlatListing) => ({
    "preferences.gender": data.preferences.gender ? undefined : "This field is required",
  }),
  // IMAGES & CONTACT
  (data: FlatListing) => ({
    // recommend at least 1 image, but not strictly required
    //"images": data.images.length ? undefined : "At least one image is recommended",
    // at least one contact method?
    // Acceptable if none checked, though unusual
  }),
];

interface FlatListingFormProps {
  data: FlatListing;
  onChange: (data: Partial<FlatListing>) => void;
  onNext: () => void;
}

export const FlatListingForm = ({ data, onChange, onNext }: FlatListingFormProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sections = [
    "Basic Details",
    "Location",
    "Property Details",
    "Rent & Costs",
    "Amenities",
    "Flatmate Preferences",
    "Images & Contact"
  ];

  const validateSection = () => {
    const getSectionErrors = requiredFieldsBySection[currentSection];
    const rawErrors = getSectionErrors(data);
    // Only keep keys with defined error strings
    const filtered = Object.entries(rawErrors)
      .filter(([_, message]) => !!message)
      .reduce((acc, [key, msg]) => ({ ...acc, [key]: msg as string }), {});
    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setErrors(errors => {
      // Clear error for this field as soon as user edits it
      const filtered = { ...errors };
      if (field in filtered) delete filtered[field];
      return filtered;
    });
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
    if (!validateSection()) return;
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setErrors({});
    }
  };

  const sectionProps = {
    data,
    onChange: handleInputChange,
    errors,
    required: true,
  };

  const renderSection = () => {
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

          {/* Show top-level errors if any */}
          {Object.values(errors).length > 0 && (
            <div className="text-red-600 text-sm">{Object.values(errors)[0]}</div>
          )}
          
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
