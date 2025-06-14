
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormSectionProps } from "./types";

export const PropertyDetailsSection = ({ data, onChange }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="propertyType">Property Type</Label>
        <Select value={data.property.type} onValueChange={(value) => onChange('property.type', value)}>
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
          <Select value={data.property.bedrooms.toString()} onValueChange={(value) => onChange('property.bedrooms', parseInt(value))}>
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
          <Select value={data.property.bathrooms.toString()} onValueChange={(value) => onChange('property.bathrooms', parseInt(value))}>
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
            onCheckedChange={(checked) => onChange('property.furnished', checked)}
          />
          <Label htmlFor="furnished">Furnished</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="parking"
            checked={data.property.parking}
            onCheckedChange={(checked) => onChange('property.parking', checked)}
          />
          <Label htmlFor="parking">Parking Available</Label>
        </div>
      </div>
    </div>
  );
};
