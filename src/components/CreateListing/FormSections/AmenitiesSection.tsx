
import { AmenitiesSelector } from "@/components/AmenitiesSelector";
import type { FormSectionProps } from "./types";

export const AmenitiesSection = ({ data, onChange }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <AmenitiesSelector
        selected={data.amenities}
        onChange={(amenities) => onChange('amenities', amenities)}
      />
    </div>
  );
};
