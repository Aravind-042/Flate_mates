
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ImageUpload";
import type { FormSectionProps } from "./types";

export const ImagesContactSection = ({ data, onChange }: FormSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-charcoal">Property Images</Label>
        <ImageUpload
          images={data.images}
          onChange={(images) => onChange('images', images)}
        />
      </div>
      <div>
        <Label className="text-charcoal">Contact Preferences</Label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp"
              checked={data.contactPreferences.whatsapp}
              onCheckedChange={(checked) => onChange('contactPreferences.whatsapp', checked)}
            />
            <Label htmlFor="whatsapp" className="text-charcoal">WhatsApp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="call"
              checked={data.contactPreferences.call}
              onCheckedChange={(checked) => onChange('contactPreferences.call', checked)}
            />
            <Label htmlFor="call" className="text-charcoal">Phone Call</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={data.contactPreferences.email}
              onCheckedChange={(checked) => onChange('contactPreferences.email', checked)}
            />
            <Label htmlFor="email" className="text-charcoal">Email</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
