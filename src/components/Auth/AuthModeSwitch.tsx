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
        className="btn-ghost text-slate-600 hover:text-blue-600"
      >
        {text} <span className="text-blue-600 ml-1 underline">{linkText}</span>
      </Button>
    </div>
  );
};