
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
        className="text-charcoal hover:text-deep-blue font-semibold text-lg hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none"
        style={{ background: "none" }}
      >
        {text} <span className="text-deep-blue ml-2 underline">{linkText}</span>
      </Button>
    </div>
  );
};
