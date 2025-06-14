
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormSectionProps } from "./types";

export const LocationSection = ({ data, onChange }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="city" className="text-charcoal">City</Label>
        <Input
          id="city"
          placeholder="e.g., Mumbai, Delhi, Bangalore"
          value={data.location.city}
          onChange={(e) => onChange('location.city', e.target.value)}
          className="mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue"
        />
      </div>
      <div>
        <Label htmlFor="area" className="text-charcoal">Area/Locality</Label>
        <Input
          id="area"
          placeholder="e.g., Koramangala, Andheri West"
          value={data.location.area}
          onChange={(e) => onChange('location.area', e.target.value)}
          className="mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue"
        />
      </div>
      <div>
        <Label htmlFor="address" className="text-charcoal">Address (Optional)</Label>
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
