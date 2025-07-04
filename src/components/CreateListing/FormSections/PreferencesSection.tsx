
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormSectionProps } from "./types";

interface Props extends FormSectionProps {
  errors?: Record<string, string>;
}

export const PreferencesSection = ({ data, onChange, errors = {} }: Props) => {
  const professionOptions = ['IT Professional', 'Student', 'Working Professional', 'Freelancer', 'Doctor', 'Teacher'];

  return (
    <div className="space-y-6">
      <div>
        <Label>
          Preferred Gender <span className="text-destructive">*</span>
        </Label>
        <Select value={data.preferences.gender} onValueChange={(value) => onChange('preferences.gender', value)}>
          <SelectTrigger className={`mt-2 ${errors['preferences.gender'] ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        {errors['preferences.gender'] && <p className="text-destructive text-xs mt-1">{errors['preferences.gender']}</p>}
      </div>
      <div>
        <Label>Preferred Profession</Label>
        <div className="mt-2 space-y-2">
          {professionOptions.map((profession) => (
            <div key={profession} className="flex items-center space-x-2">
              <Checkbox
                id={profession}
                checked={data.preferences.profession.includes(profession)}
                onCheckedChange={(checked) => {
                  const newProfessions = checked 
                    ? [...data.preferences.profession, profession]
                    : data.preferences.profession.filter(p => p !== profession);
                  onChange('preferences.profession', newProfessions);
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
          onChange={(e) => onChange('preferences.additionalRequirements', e.target.value)}
          className="mt-2"
        />
      </div>
    </div>
  );
};
