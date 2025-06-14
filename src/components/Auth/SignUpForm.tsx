import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, User, Lock, Sparkles, Eye, EyeOff, Home } from "lucide-react";

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  signupRoleIntentProp?: "flat_owner" | "flat_seeker";
  onSuccess?: () => void;
}

export const SignUpForm = ({ onSwitchToSignIn, signupRoleIntentProp, onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  // --- We use a prop to override the role for special flows (e.g. from listing). Fallback to localStorage for backward compatibility
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign up with data:', {
        email,
        full_name: fullName,
        role: role
      });

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        console.error('Sign up error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        throw error;
      }
      
      console.log('Sign up response:', {
        user_id: data.user?.id,
        user_email: data.user?.email,
        session_exists: !!data.session
      });
      
      toast.success("Account created successfully! Please check your email to verify your account.");
      
      // Handle successful sign up
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('User already registered')) {
        toast.error("An account with this email already exists. Please sign in instead.");
      } else if (error.message?.includes('Invalid email')) {
        toast.error("Please enter a valid email address.");
      } else if (error.message?.includes('Password')) {
        toast.error("Password must be at least 6 characters long.");
      } else {
        toast.error(error.message || "Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-deep-blue to-orange blur-2xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-deep-blue to-orange p-5 rounded-3xl shadow-2xl inline-block">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent">
            Join FlatMates
          </h1>
          <p className="text-xl text-charcoal font-medium">Create your account and find your perfect flatmate</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="fullNameSignup" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="fullNameSignup"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="roleSignup" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <Home className="h-4 w-4" />
            I am a
          </Label>
          <Select value={role} onValueChange={(value: 'flat_seeker' | 'flat_owner') => setRole(value)}>
            <SelectTrigger className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-light-slate rounded-2xl shadow-2xl">
              <SelectItem value="flat_seeker" className="text-lg py-4 rounded-xl hover:bg-blue-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <span>Flat Seeker</span>
                </div>
              </SelectItem>
              <SelectItem value="flat_owner" className="text-lg py-4 rounded-xl hover:bg-blue-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <span>Flat Owner</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="emailSignup" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="emailSignup"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="passwordSignup" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="passwordSignup"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg pr-14 transition-all duration-200 hover:shadow-xl"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-500" />
              ) : (
                <Eye className="h-5 w-5 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSignUp}
          disabled={isLoading}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <span>Create Account</span>
            </div>
          )}
        </Button>

        <div className="text-center pt-4">
          <Button 
            variant="ghost" 
            onClick={onSwitchToSignIn}
            className="text-charcoal hover:text-deep-blue font-semibold text-lg hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none"
            style={{ background: "none" }}
          >
            Already have an account? <span className="text-deep-blue ml-2 underline">Sign In</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
