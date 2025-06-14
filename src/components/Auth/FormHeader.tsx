
import { User } from "lucide-react";

interface FormHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const FormHeader = ({ title, subtitle, icon }: FormHeaderProps) => {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-2xl opacity-30 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-deep-blue to-orange p-5 rounded-3xl shadow-2xl inline-block">
          {icon || <User className="h-12 w-12 text-white" />}
        </div>
      </div>
      <div className="space-y-3">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-xl text-charcoal font-medium">{subtitle}</p>
      </div>
    </div>
  );
};
