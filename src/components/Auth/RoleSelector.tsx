import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home } from "lucide-react";

interface RoleSelectorProps {
  value: 'flat_seeker' | 'flat_owner';
  onChange: (value: 'flat_seeker' | 'flat_owner') => void;
}

export const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="roleSignup" className="text-slate-700 font-medium flex items-center gap-2">
        <Home className="h-4 w-4" />
        I am a
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="input-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-xl">
          <SelectItem value="flat_seeker" className="py-3 rounded-lg hover:bg-blue-50">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏠</span>
              <span>Flat Seeker</span>
            </div>
          </SelectItem>
          <SelectItem value="flat_owner" className="py-3 rounded-lg hover:bg-blue-50">
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