interface AuthModeSwitchProps {
  onSwitch: () => void;
  text: string;
  linkText: string;
}

export const AuthModeSwitch = ({ onSwitch, text, linkText }: AuthModeSwitchProps) => {
  return (
    <div className="text-center pt-4">
      <p className="text-slate-600">
        {text}{" "}
        <button
          onClick={onSwitch}
          className="text-blue-600 hover:text-blue-700 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors duration-200 font-medium"
          aria-label={`${text} ${linkText}`}
          tabIndex={0}
        >
          {linkText}
        </button>
      </p>
    </div>
  );
};