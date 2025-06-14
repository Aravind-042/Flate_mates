
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
import { useSignin } from "@/hooks/useSignin";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}

export const SignInForm = ({ onSwitchToSignUp, onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, isLoading } = useSignin({ onSuccess });

  const handleSignIn = async () => {
    await signIn(email, password);
  };

  return (
    <div className="space-y-8">
      <FormHeader
        title="Welcome Back"
        subtitle="Continue your flatmate journey"
        icon={<Lock className="h-12 w-12 text-white" />}
      />

      <div className="space-y-6">
        <FormField
          id="email"
          label="Email Address"
          icon={<Mail className="h-4 w-4" />}
          placeholder="your.email@example.com"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <FormField
          id="password"
          label="Password"
          icon={<Lock className="h-4 w-4" />}
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

        <AuthModeSwitch
          onSwitch={onSwitchToSignUp}
          text="Don't have an account?"
          linkText="Sign Up"
        />
      </div>
    </div>
  );
};
