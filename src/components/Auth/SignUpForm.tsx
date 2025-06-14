
import { useState } from "react";
import { Mail, User, Lock } from "lucide-react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { RoleSelector } from "./RoleSelector";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
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
  
  // --- We use a prop to override the role for special flows (e.g. from listing). Fallback to localStorage for backward compatibility
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
    <div className="space-y-8">
      <FormHeader 
        title="Join FlatMates"
        subtitle="Create your account and find your perfect flatmate"
        icon={<User className="h-12 w-12 text-white" />}
      />

      <div className="space-y-6">
        <FormField
          id="fullNameSignup"
          label="Full Name"
          icon={<User className="h-4 w-4" />}
          placeholder="Enter your full name"
          value={fullName}
          onChange={setFullName}
        />

        <RoleSelector value={role} onChange={setRole} />

        <FormField
          id="emailSignup"
          label="Email Address"
          icon={<Mail className="h-4 w-4" />}
          placeholder="your.email@example.com"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <FormField
          id="passwordSignup"
          label="Password"
          icon={<Lock className="h-4 w-4" />}
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

        <AuthModeSwitch
          onSwitch={onSwitchToSignIn}
          text="Already have an account?"
          linkText="Sign In"
        />
      </div>
    </div>
  );
};
