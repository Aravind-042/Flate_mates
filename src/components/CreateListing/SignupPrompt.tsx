
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UserPlus, CheckCircle, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthDialog } from "@/components/Auth/AuthDialog";

// Props for navigation back
interface SignupPromptProps {
  onBack: () => void;
}

export const SignupPrompt = ({ onBack }: SignupPromptProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="max-h-[80vh] overflow-y-auto flex flex-col">
      <Card className="w-full glass-card flex-1 flex flex-col">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-deep-blue to-orange rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-charcoal">
            Your Listing is Ready!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Sign up to publish your listing and connect with potential flatmates
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-deep-blue mb-2">Why sign up?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-deep-blue rounded-full"></div>
                  <span>Publish your listing and reach thousands of potential flatmates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-deep-blue rounded-full"></div>
                  <span>Manage your listing and respond to inquiries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-deep-blue rounded-full"></div>
                  <span>Connect with verified users for safe transactions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-deep-blue rounded-full"></div>
                  <span>Access premium features and analytics</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setShowDialog(true)}
                className="flex-1 bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white"
                size="lg"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Sign Up & Publish Listing
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 border-light-slate text-charcoal hover:text-deep-blue hover:border-deep-blue"
                size="lg"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Preview
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Centered Auth Modal with signupRoleIntent="flat_owner" */}
      <AuthDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        signupRoleIntent="flat_owner"
      />
    </div>
  );
};
