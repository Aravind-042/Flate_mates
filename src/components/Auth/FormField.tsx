
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
  id: string;
  label?: string;
  icon?: React.ReactNode;
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
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-gray-700 font-medium text-sm">
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
          className="h-14 text-base border-0 bg-gray-100/80 focus:bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-2xl transition-all duration-200"
          style={showPasswordToggle ? { paddingRight: '3.5rem' } : {}}
        />
        {showPasswordToggle && onTogglePassword && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
