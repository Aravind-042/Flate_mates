
import { useState } from "react";
import { AuthLayout } from "./Auth/AuthLayout";
import { SignInForm } from "./Auth/SignInForm";
import { SignUpForm } from "./Auth/SignUpForm";

type AuthMode = 'signin' | 'signup';

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <AuthLayout>
      {mode === 'signin' ? (
        <SignInForm onSwitchToSignUp={() => setMode('signup')} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setMode('signin')} />
      )}
    </AuthLayout>
  );
};
