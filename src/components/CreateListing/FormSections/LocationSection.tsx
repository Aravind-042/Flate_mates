
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AddressInput } from "@/components/AddressAutocomplete/AddressInput";
import type { FormSectionProps } from "./types";

interface Props extends FormSectionProps {
  errors?: Record<string, string>;
}

// Top 50 Indian City Names (alphabetical)
const CITY_LIST = [
  "Ahmedabad", "Amritsar", "Bangalore", "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Coimbatore", "Dehradun", "Delhi",
  "Faridabad", "Ghaziabad", "Goa", "Gurgaon", "Guwahati", "Hyderabad", "Indore", "Jaipur", "Jalandhar", "Jammu",
  "Jodhpur", "Kanpur", "Kochi", "Kolkata", "Kozhikode", "Lucknow", "Ludhiana", "Madurai", "Mangalore", "Meerut",
  "Mumbai", "Mysore", "Nagpur", "Nashik", "Noida", "Patna", "Pune", "Raipur", "Rajkot", "Ranchi",
  "Siliguri", "Srinagar", "Surat", "Thane", "Thiruvananthapuram", "Udaipur", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam"
];
// TODO: Fetch city list dynamically from Supabase database later.

export const LocationSection = ({ data, onChange, errors = {} }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="city" className="text-charcoal">
          City <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.location.city}
          onValueChange={value => onChange('location.city', value)}
        >
          <SelectTrigger
            id="city"
            className={`mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue ${errors['location.city'] ? 'border-red-500' : ''}`}
          >
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white">
            {CITY_LIST.map((city) => (
              <SelectItem value={city} key={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors['location.city'] && <p className="text-destructive text-xs mt-1">{errors['location.city']}</p>}
      </div>
      <AddressInput
        label="Area/Locality"
        value={data.location.area}
        onChange={(value, coordinates) => {
          onChange('location.area', value);
          if (coordinates) {
            // Store coordinates for future use with geocoding
            onChange('location.coordinates', coordinates);
          }
        }}
        placeholder="e.g., Koramangala, Andheri West"
        required
        error={errors['location.area']}
      />
      <AddressInput
        label="Full Address"
        value={data.location.address}
        onChange={(value, coordinates) => {
          onChange('location.address', value);
          if (coordinates) {
            onChange('location.coordinates', coordinates);
          }
        }}
        placeholder="Building name, street address (will be shared only after acceptance)"
        error={errors['location.address']}
      />
    </div>
  );
};
