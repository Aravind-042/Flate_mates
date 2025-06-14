import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess?: () => void;
}

export const SignInForm = ({ onSwitchToSignUp, onSuccess }: SignInFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data.user?.id);
      toast.success("Welcome back!");
      
      // Handle successful sign in
      if (onSuccess) {
        onSuccess();
      } else {
        // If no onSuccess callback, navigate to home
        navigate('/');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || "Failed to sign in");
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
            <Lock className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-deep-blue via-orange to-emerald bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-xl text-charcoal font-medium">Continue your flatmate journey</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="email" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 text-lg border-2 border-light-slate focus:border-deep-blue focus:ring-deep-blue rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="password" className="text-charcoal font-semibold text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-deep-blue to-orange hover:from-darker-blue hover:to-orange-darker text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Lock className="h-6 w-6" />
              <span>Sign In</span>
            </div>
          )}
        </Button>

        <div className="text-center pt-4">
          <Button 
            variant="ghost" 
            onClick={onSwitchToSignUp}
            className="text-charcoal hover:text-deep-blue font-semibold text-lg hover:bg-transparent focus:bg-transparent active:bg-transparent transition-none"
            style={{ background: "none" }}
          >
            Don't have an account? <span className="text-deep-blue ml-2 underline">Sign Up</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
