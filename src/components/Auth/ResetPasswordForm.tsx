import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  onBack: () => void;
}

export const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading } = useForgotPassword();

  useEffect(() => {
    const checkResetToken = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      
      if (!accessToken || !refreshToken) {
        console.error('Missing reset tokens in URL');
        toast.error("Invalid reset link. Please request a new password reset.");
        setIsCheckingToken(false);
        return;
      }

      try {
        // Set the session with the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Error setting session:', error);
          toast.error("Invalid or expired reset link. Please request a new password reset.");
          setIsValidToken(false);
        } else {
          console.log('Reset session established successfully');
          setIsValidToken(true);
        }
      } catch (error) {
        console.error('Unexpected error checking reset token:', error);
        toast.error("An error occurred. Please try again.");
        setIsValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkResetToken();
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const accessToken = searchParams.get('access_token');
    if (!accessToken) {
      toast.error("Invalid reset session. Please request a new password reset.");
      return;
    }

    const success = await resetPassword(newPassword, accessToken);
    if (success) {
      // Clear the URL parameters and redirect to sign in
      navigate('/auth', { replace: true });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  if (isCheckingToken) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-heading-2 text-slate-800">
              Verifying Reset Link
            </h1>
            <p className="text-body text-slate-600">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-heading-2 text-slate-800">
              Invalid Reset Link
            </h1>
            <p className="text-body text-slate-600">
              This password reset link is invalid or has expired.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-2">🔒 Security Notice</h3>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Reset links expire after 1 hour for security</li>
            <li>• Each link can only be used once</li>
            <li>• Please request a new password reset</li>
          </ul>
        </div>

        <Button
          onClick={onBack}
          className="btn-primary w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Request New Reset Link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader 
        title="Create New Password" 
        subtitle="Enter your new password below"
      />

      <div className="space-y-4" onKeyPress={handleKeyPress}>
        <FormField
          id="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={setNewPassword}
          type="password"
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <FormField
          id="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          showPasswordToggle={true}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔐 Password Requirements</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li className={newPassword.length >= 6 ? "text-green-700" : ""}>
              • At least 6 characters long
            </li>
            <li className={newPassword === confirmPassword && newPassword ? "text-green-700" : ""}>
              • Passwords must match
            </li>
            <li>• Use a mix of letters, numbers, and symbols for better security</li>
          </ul>
        </div>

        <SubmitButton
          isLoading={isLoading}
          onClick={handleSubmit}
          loadingText="Updating Password..."
        >
          Update Password
        </SubmitButton>

        <Button
          onClick={onBack}
          variant="ghost"
          className="btn-ghost w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    </div>
  );
};