import { Button } from "@/components/ui/button";

interface AuthModeSwitchProps {
  onSwitch: () => void;
  text: string;
  linkText: string;
}

export const AuthModeSwitch = ({ onSwitch, text, linkText }: AuthModeSwitchProps) => {
  return (
    <div className="text-center pt-4">
      <Button 
        variant="ghost" 
        onClick={onSwitch}
        className="btn-ghost text-slate-600 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        aria-label={`${text} ${linkText}`}
        tabIndex={0}
      >
        {text} <span className="text-blue-600 ml-1 underline hover:text-blue-700 transition-colors duration-200">{linkText}</span>
      </Button>
    </div>
  );
};