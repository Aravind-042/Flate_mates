
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const FormField = ({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword
}: FormFieldProps) => {
  return (
    <div className="space-y-4">
      <Label htmlFor={id} className="text-charcoal font-semibold text-lg flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          style={showPasswordToggle ? { paddingRight: '3.5rem' } : {}}
        />
        {showPasswordToggle && onTogglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-slate-500" />
            ) : (
              <Eye className="h-5 w-5 text-slate-500" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
