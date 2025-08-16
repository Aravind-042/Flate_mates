import { useState } from "react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { RoleSelector } from "./RoleSelector";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
import { OAuthButtons } from "./OAuthButtons";
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    city: '',
    profession: '',
    age: ''
  });
  
  const initialRole: 'flat_seeker' | 'flat_owner' = (() => {
    if (signupRoleIntentProp) return signupRoleIntentProp;
    try {
      if (typeof window !== "undefined" && localStorage.getItem('pendingListingData')) {
        return "flat_owner";
      }
    } catch (_) {
      // Ignore potential security errors from localStorage access
    }
    return "flat_seeker";
  })();
  
  const [role, setRole] = useState<'flat_seeker' | 'flat_owner'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signUp, isLoading } = useSignup({ onSuccess });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = () => {
    signUp(formData, role);
  };

  return (
    <div className="space-y-6">
      <FormHeader 
        title="Join FlatMates" 
        subtitle="Create your account and find your perfect flatmate"
      />

      <div className="space-y-4">
        <FormField
          id="fullNameSignup"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(value) => updateFormData('fullName', value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="phoneNumberSignup"
            label="Phone Number"
            placeholder="Your phone number"
            value={formData.phoneNumber}
            onChange={(value) => updateFormData('phoneNumber', value)}
            type="tel"
          />

          <FormField
            id="ageSignup"
            label="Age"
            placeholder="Your age"
            value={formData.age}
            onChange={(value) => updateFormData('age', value)}
            type="number"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            id="citySignup"
            label="City"
            placeholder="Your city"
            value={formData.city}
            onChange={(value) => updateFormData('city', value)}
          />

          <FormField
            id="professionSignup"
            label="Profession"
            placeholder="Your profession"
            value={formData.profession}
            onChange={(value) => updateFormData('profession', value)}
          />
        </div>

        <RoleSelector value={role} onChange={setRole} />

        <FormField
          id="emailSignup"
          label="Email Address"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(value) => updateFormData('email', value)}
          type="email"
        />

        <FormField
          id="passwordSignup"
          label="Password"
          placeholder="Create a strong password (min 6 characters)"
          value={formData.password}
          onChange={(value) => updateFormData('password', value)}
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
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative bg-white px-4">
            <span className="text-slate-400 text-sm font-medium">OR</span>
          </div>
        </div>

        <OAuthButtons />

        <AuthModeSwitch
          onSwitch={onSwitchToSignIn}
          text="Already have an account?"
          linkText="Sign In"
        />
      </div>
    </div>
  );
};