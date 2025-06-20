
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
        className="text-gray-600 hover:text-gray-800 font-medium text-sm hover:bg-transparent transition-colors"
      >
        {text} <span className="text-purple-600 ml-1 underline">{linkText}</span>
      </Button>
    </div>
  );
};
