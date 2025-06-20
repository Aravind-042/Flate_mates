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
export const SignUpForm = ({
  onSwitchToSignIn,
  signupRoleIntentProp,
  onSuccess
}: SignUpFormProps) => {
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
  const {
    signUp,
    isLoading
  } = useSignup({
    onSuccess
  });
  const handleSignUp = () => {
    signUp(email, password, fullName, role);
  };
  return <div className="space-y-6">
      <FormHeader title="Join FlatMates" subtitle="Create your account and find your perfect flatmate" />

      <div className="space-y-4">
        <FormField id="fullNameSignup" placeholder="Enter your full name" value={fullName} onChange={setFullName} />

        <RoleSelector value={role} onChange={setRole} />

        <FormField id="emailSignup" placeholder="your.email@example.com" value={email} onChange={setEmail} type="email" />

        <FormField id="passwordSignup" placeholder="Create a strong password (min 6 characters)" value={password} onChange={setPassword} showPasswordToggle={true} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />

        <SubmitButton isLoading={isLoading} onClick={handleSignUp} loadingText="Creating Account...">
          Create Account
        </SubmitButton>

        <div className="relative flex items-center justify-center my-6">
          
          <div className="relative bg-white px-4">
            <span className="text-gray-400 text-sm font-medium">OR</span>
          </div>
        </div>

        

        <AuthModeSwitch onSwitch={onSwitchToSignIn} text="Already have an account?" linkText="Sign In" />
      </div>
    </div>;
};