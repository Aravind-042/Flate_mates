
import { useState } from "react";
import { AuthLayout } from "./Auth/AuthLayout";
import { SignInForm } from "./Auth/SignInForm";
import { SignUpForm } from "./Auth/SignUpForm";
import { useNavigate } from "react-router-dom";

type AuthMode = 'signin' | 'signup';

interface AuthPageProps {
  signupRoleIntent?: "flat_owner" | "flat_seeker";
  onAuthSuccess?: () => void;
}

export const AuthPage = ({ signupRoleIntent, onAuthSuccess }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <AuthLayout>
      {mode === 'signin' ? (
        <SignInForm 
          onSwitchToSignUp={() => setMode('signup')} 
          onSuccess={handleAuthSuccess}
        />
      ) : (
        <SignUpForm
          onSwitchToSignIn={() => setMode('signin')}
          signupRoleIntentProp={signupRoleIntent}
          onSuccess={handleAuthSuccess}
        />
      )}
    </AuthLayout>
  );
};
