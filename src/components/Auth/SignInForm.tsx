import { useState } from "react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { AuthModeSwitch } from "./AuthModeSwitch";
import { Button } from "@/components/ui/button";
import { useSignin } from "@/hooks/useSignin";
interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}
export const SignInForm = ({
  onSwitchToSignUp,
  onSuccess
}: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    signIn,
    isLoading
  } = useSignin({
    onSuccess
  });
  const handleSignIn = async () => {
    await signIn(email, password);
  };
  return <div className="space-y-6">
      <FormHeader title="Welcome back!" />

      <div className="space-y-4">
        <FormField id="email" placeholder="aravindkallam12@gmail.com" value={email} onChange={setEmail} type="email" />

        <FormField id="password" placeholder="••••••••••••" value={password} onChange={setPassword} type="password" showPasswordToggle={true} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />

        <SubmitButton isLoading={isLoading} onClick={handleSignIn} loadingText="Signing In...">
          Log in
        </SubmitButton>

        <div className="text-center">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800 text-sm font-medium hover:bg-transparent">
            Forgot password?
          </Button>
        </div>

        

        

        <AuthModeSwitch onSwitch={onSwitchToSignUp} text="Don't have an account?" linkText="Sign Up" />
      </div>
    </div>;
};