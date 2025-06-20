
import { useState } from "react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { RoleSelector } from "./RoleSelector";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/hooks/useSignup";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  signupRoleIntentProp?: "flat_owner" | "flat_seeker";
  onSuccess?: () => void;
}

export const SignUpForm = ({ onSwitchToSignIn, signupRoleIntentProp, onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const initialRole: 'flat_seeker' | 'flat_owner' = (() => {
    if (signupRoleIntentProp) return signupRoleIntentProp;
    try {
      if (typeof window !== "undefined" && localStorage.getItem('pendingListingData')) {
        return "flat_owner";
      }
    } catch (_) {}
    return "flat_seeker";
  })();

  const [role, setRole] = useState<'flat_seeker' | 'flat_owner'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  const { signUp, isLoading } = useSignup({ onSuccess });

  const handleSignUp = () => {
    signUp(email, password, fullName, role);
  };

  return (
    <div className="space-y-6">
      <FormHeader title="Join FlatMates" subtitle="Create your account and find your perfect flatmate" />

      <div className="space-y-4">
        <FormField
          id="fullNameSignup"
          placeholder="Enter your full name"
          value={fullName}
          onChange={setFullName}
        />

        <RoleSelector value={role} onChange={setRole} />

        <FormField
          id="emailSignup"
          placeholder="your.email@example.com"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <FormField
          id="passwordSignup"
          placeholder="Create a strong password (min 6 characters)"
          value={password}
          onChange={setPassword}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <SubmitButton
          isLoading={isLoading}
          onClick={handleSignUp}
          loadingText="Creating Account..."
        >
          Create Account
        </SubmitButton>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative bg-white px-4">
            <span className="text-gray-400 text-sm font-medium">OR</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-14 text-base font-semibold border-gray-200 hover:bg-gray-50 rounded-2xl"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>

        <AuthModeSwitch
          onSwitch={onSwitchToSignIn}
          text="Already have an account?"
          linkText="Sign In"
        />
      </div>
    </div>
  );
};
