import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthLayout } from "./Auth/AuthLayout";
import { SignInForm } from "./Auth/SignInForm";
import { SignUpForm } from "./Auth/SignUpForm";
import { ForgotPasswordForm } from "./Auth/ForgotPasswordForm";
import { ResetPasswordForm } from "./Auth/ResetPasswordForm";
import { GuestModeButton } from "./Auth/GuestModeButton";

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'reset-password';

interface AuthPageProps {
  signupRoleIntent?: "flat_owner" | "flat_seeker";
  onAuthSuccess?: () => void;
}

export const AuthPage = ({ signupRoleIntent, onAuthSuccess }: AuthPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Determine initial mode based on URL parameters
  const getInitialMode = (): AuthMode => {
    const mode = searchParams.get('mode');
    const hasResetTokens = searchParams.get('access_token') && searchParams.get('refresh_token');
    
    if (mode === 'reset-password' || hasResetTokens) {
      return 'reset-password';
    }
    if (mode === 'forgot-password') {
      return 'forgot-password';
    }
    return 'signin';
  };

  const [mode, setMode] = useState<AuthMode>(getInitialMode);

  // Update mode when URL parameters change
  useEffect(() => {
    setMode(getInitialMode());
  }, [searchParams]);

  const handleAuthSuccess = () => {
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      navigate('/');
    }
  };

  const handleBackToSignIn = () => {
    setMode('signin');
    // Clear URL parameters when going back to sign in
    navigate('/auth', { replace: true });
  };

  const renderAuthForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm 
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
            onSuccess={handleAuthSuccess}
          />
        );
      
      case 'signup':
        return (
          <SignUpForm
            onSwitchToSignIn={() => setMode('signin')}
            signupRoleIntentProp={signupRoleIntent}
            onSuccess={handleAuthSuccess}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onBack={handleBackToSignIn}
          />
        );
      
      case 'reset-password':
        return (
          <ResetPasswordForm
            onBack={handleBackToSignIn}
          />
        );
      
      default:
        return (
          <SignInForm 
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToForgotPassword={() => setMode('forgot-password')}
            onSuccess={handleAuthSuccess}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Guest Mode Button - Floating prominently */}
      <GuestModeButton />
      
      {/* Main Auth Content */}
      <AuthLayout>
        {renderAuthForm()}
      </AuthLayout>
    </div>
  );
};