
import { useState } from "react";
import { AuthLayout } from "./Auth/AuthLayout";
import { SignInForm } from "./Auth/SignInForm";
import { SignUpForm } from "./Auth/SignUpForm";

type AuthMode = 'signin' | 'signup';

interface AuthPageProps {
  signupRoleIntent?: "flat_owner" | "flat_seeker";
}

export const AuthPage = ({ signupRoleIntent }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <AuthLayout>
      {mode === 'signin' ? (
        <SignInForm onSwitchToSignUp={() => setMode('signup')} />
      ) : (
        <SignUpForm
          onSwitchToSignIn={() => setMode('signin')}
          signupRoleIntentProp={signupRoleIntent}
        />
      )}
    </AuthLayout>
  );
};
