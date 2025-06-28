import { useState } from "react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
import { useSignin } from "@/hooks/useSignin";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
  onSuccess?: () => void;
}

export const SignInForm = ({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
  onSuccess
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading } = useSignin({ onSuccess });

  const handleSignIn = async () => {
    await signIn(email, password);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSignIn();
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader 
        title="Welcome back!" 
        subtitle="Sign in to your account to continue"
      />

      <div className="space-y-4" onKeyPress={handleKeyPress}>
        <FormField
          id="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <FormField
          id="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          type="password"
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <SubmitButton
          isLoading={isLoading}
          onClick={handleSignIn}
          loadingText="Signing In..."
        >
          Sign In
        </SubmitButton>

        <div className="text-center">
          <button
            onClick={onSwitchToForgotPassword}
            className="text-blue-600 hover:text-blue-700 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors duration-200 font-medium text-sm"
            aria-label="Reset your password"
            tabIndex={0}
          >
            Forgot password?
          </button>
        </div>

        <AuthModeSwitch
          onSwitch={onSwitchToSignUp}
          text="Don't have an account?"
          linkText="Sign Up"
        />
      </div>
    </div>
  );
};