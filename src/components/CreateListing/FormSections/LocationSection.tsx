
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
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
      <div>
        <Label htmlFor="area" className="text-charcoal">
          Area/Locality <span className="text-destructive">*</span>
        </Label>
        <Input
          id="area"
          placeholder="e.g., Koramangala, Andheri West"
          value={data.location.area}
          onChange={(e) => onChange('location.area', e.target.value)}
          className={`mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue ${errors['location.area'] ? 'border-red-500' : ''}`}
          required
        />
        {errors['location.area'] && <p className="text-destructive text-xs mt-1">{errors['location.area']}</p>}
      </div>
      <div>
        <Label htmlFor="address" className="text-charcoal">Address <span className="text-gray-400">(Optional)</span></Label>
        <Textarea
          id="address"
          placeholder="Building name, street address (will be shared only after acceptance)"
          value={data.location.address}
          onChange={(e) => onChange('location.address', e.target.value)}
          className="mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue"
        />
      </div>
    </div>
  );
};
