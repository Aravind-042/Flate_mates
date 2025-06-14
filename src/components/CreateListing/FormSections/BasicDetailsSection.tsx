
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FormSectionProps } from "./types";

export const BasicDetailsSection = ({ data, onChange }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-charcoal">Listing Title</Label>
        <Input
          id="title"
          placeholder="e.g., Spacious 2BHK in Prime Location"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          className="mt-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-charcoal">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your flat, surroundings, and what makes it special..."
          value={data.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="mt-2 min-h-[120px] border-light-slate focus:border-deep-blue focus:ring-deep-blue"
        />
      </div>
    </div>
  );
};
