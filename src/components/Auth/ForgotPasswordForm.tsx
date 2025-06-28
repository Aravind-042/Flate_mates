import { useState } from "react";
import { FormHeader } from "./FormHeader";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useForgotPassword } from "@/hooks/useForgotPassword";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const { sendResetEmail, isLoading } = useForgotPassword({
    onSuccess: () => setEmailSent(true)
  });

  const handleSubmit = async () => {
    const success = await sendResetEmail(email);
    if (success) {
      setEmailSent(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-heading-2 text-slate-800">
              Check Your Email
            </h1>
            <p className="text-body text-slate-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">📧 Next Steps</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check your email inbox (and spam folder)</li>
            <li>• Click the reset link in the email</li>
            <li>• Create a new password</li>
            <li>• Sign in with your new password</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => {
              setEmailSent(false);
              setEmail('');
            }}
            className="btn-outline w-full"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Another Email
          </Button>
          
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
  }

  return (
    <div className="space-y-6">
      <FormHeader 
        title="Reset Your Password" 
        subtitle="Enter your email address and we'll send you a link to reset your password"
      />

      <div className="space-y-4">
        <FormField
          id="resetEmail"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <div onKeyPress={handleKeyPress}>
          <SubmitButton
            isLoading={isLoading}
            onClick={handleSubmit}
            loadingText="Sending Reset Email..."
          >
            Send Reset Email
          </SubmitButton>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Having trouble?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make sure you enter the email you used to sign up</li>
            <li>• Check your spam/junk folder if you don't see the email</li>
            <li>• The reset link will expire in 1 hour</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>

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