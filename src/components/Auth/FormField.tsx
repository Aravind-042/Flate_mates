import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  id: string;
  label?: string;
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
  placeholder,
  value,
  onChange,
  type = "text",
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-slate-700 font-medium">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-primary"
        />
        {showPasswordToggle && onTogglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-slate-400" />
            ) : (
              <Eye className="h-4 w-4 text-slate-400" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};