import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ImageUpload";
import { AmenitiesSelector } from "@/components/AmenitiesSelector";
import type { FlatListing } from "@/pages/Index";

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
    switch (currentSection) {
      case 0: // Basic Details
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                placeholder="e.g., Spacious 2BHK in Prime Location"
                value={data.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your flat, surroundings, and what makes it special..."
                value={data.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Mumbai, Delhi, Bangalore"
                value={data.location.city}
                onChange={(e) => handleInputChange('location.city', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="area">Area/Locality</Label>
              <Input
                id="area"
                placeholder="e.g., Koramangala, Andheri West"
                value={data.location.area}
                onChange={(e) => handleInputChange('location.area', e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                placeholder="Building name, street address (will be shared only after acceptance)"
                value={data.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 2: // Property Details
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={data.property.type} onValueChange={(value) => handleInputChange('property.type', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="independent-house">Independent House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="pg">PG/Hostel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={data.property.bedrooms.toString()} onValueChange={(value) => handleInputChange('property.bedrooms', parseInt(value))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select value={data.property.bathrooms.toString()} onValueChange={(value) => handleInputChange('property.bathrooms', parseInt(value))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={data.property.furnished}
                  onCheckedChange={(checked) => handleInputChange('property.furnished', checked)}
                />
                <Label htmlFor="furnished">Furnished</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={data.property.parking}
                  onCheckedChange={(checked) => handleInputChange('property.parking', checked)}
                />
                <Label htmlFor="parking">Parking Available</Label>
              </div>
            </div>
          </div>
        );

      case 3: // Rent & Costs
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rent">Monthly Rent (₹)</Label>
                <Input
                  id="rent"
                  type="number"
                  placeholder="25000"
                  value={data.rent.amount}
                  onChange={(e) => handleInputChange('rent.amount', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="deposit">Security Deposit (₹)</Label>
                <Input
                  id="deposit"
                  type="number"
                  placeholder="50000"
                  value={data.rent.deposit}
                  onChange={(e) => handleInputChange('rent.deposit', parseInt(e.target.value) || 0)}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label>Rent Includes</Label>
              <div className="mt-2 space-y-2">
                {['Electricity', 'Water', 'Internet', 'Maintenance', 'Gas'].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={data.rent.includes.includes(item)}
                      onCheckedChange={(checked) => {
                        const newIncludes = checked 
                          ? [...data.rent.includes, item]
                          : data.rent.includes.filter(i => i !== item);
                        handleInputChange('rent.includes', newIncludes);
                      }}
                    />
                    <Label htmlFor={item}>{item}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Amenities
        return (
          <div className="space-y-6">
            <AmenitiesSelector
              selected={data.amenities}
              onChange={(amenities) => handleInputChange('amenities', amenities)}
            />
          </div>
        );

      case 5: // Flatmate Preferences
        return (
          <div className="space-y-6">
            <div>
              <Label>Preferred Gender</Label>
              <Select value={data.preferences.gender} onValueChange={(value) => handleInputChange('preferences.gender', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Profession</Label>
              <div className="mt-2 space-y-2">
                {['IT Professional', 'Student', 'Working Professional', 'Freelancer', 'Doctor', 'Teacher'].map((profession) => (
                  <div key={profession} className="flex items-center space-x-2">
                    <Checkbox
                      id={profession}
                      checked={data.preferences.profession.includes(profession)}
                      onCheckedChange={(checked) => {
                        const newProfessions = checked 
                          ? [...data.preferences.profession, profession]
                          : data.preferences.profession.filter(p => p !== profession);
                        handleInputChange('preferences.profession', newProfessions);
                      }}
                    />
                    <Label htmlFor={profession}>{profession}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="additionalRequirements">Additional Requirements</Label>
              <Textarea
                id="additionalRequirements"
                placeholder="Any specific requirements or expectations..."
                value={data.preferences.additionalRequirements}
                onChange={(e) => handleInputChange('preferences.additionalRequirements', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 6: // Images & Contact
        return (
          <div className="space-y-6">
            <div>
              <Label>Property Images</Label>
              <ImageUpload
                images={data.images}
                onChange={(images) => handleInputChange('images', images)}
              />
            </div>
            <div>
              <Label>Contact Preferences</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={data.contactPreferences.whatsapp}
                    onCheckedChange={(checked) => handleInputChange('contactPreferences.whatsapp', checked)}
                  />
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="call"
                    checked={data.contactPreferences.call}
                    onCheckedChange={(checked) => handleInputChange('contactPreferences.call', checked)}
                  />
                  <Label htmlFor="call">Phone Call</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={data.contactPreferences.email}
                    onCheckedChange={(checked) => handleInputChange('contactPreferences.email', checked)}
                  />
                  <Label htmlFor="email">Email</Label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{sections[currentSection]}</span>
          <span className="text-sm text-gray-500">
            {currentSection + 1} of {sections.length}
          </span>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-600 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderSection()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white"
            >
              {currentSection === sections.length - 1 ? 'Preview Listing' : 'Next'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
