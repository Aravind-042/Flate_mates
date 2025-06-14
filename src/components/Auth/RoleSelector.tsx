
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home } from "lucide-react";

interface RoleSelectorProps {
  value: 'flat_seeker' | 'flat_owner';
  onChange: (value: 'flat_seeker' | 'flat_owner') => void;
}

export const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="roleSignup" className="text-charcoal font-semibold text-lg flex items-center gap-2">
        <Home className="h-4 w-4" />
        I am a
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-light-slate rounded-2xl shadow-2xl">
          <SelectItem value="flat_seeker" className="text-lg py-4 rounded-xl hover:bg-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <span>Flat Seeker</span>
            </div>
          </SelectItem>
          <SelectItem value="flat_owner" className="text-lg py-4 rounded-xl hover:bg-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔑</span>
              <span>Flat Owner</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
