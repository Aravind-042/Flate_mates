
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Mail, User, Lock, Sparkles, Eye, EyeOff } from "lucide-react";

type AuthMode = 'signin' | 'signup';

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'flat_seeker' | 'flat_owner'>('flat_seeker');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      toast.success("Welcome back!");
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

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
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
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
        console.error('Sign up error:', error);
        throw error;
      }
      
      toast.success("Account created successfully! Please check your email to verify your account.");
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const renderSignIn = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-3xl shadow-2xl">
            <Lock className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-lg text-slate-600 font-medium">Sign in to continue your flatmate journey</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-slate-700 font-semibold text-base">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password" className="text-slate-700 font-semibold text-base">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-500" />
              ) : (
                <Eye className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Sign In</span>
            </div>
          )}
        </Button>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setMode('signup')}
            className="text-slate-600 hover:text-coral-500 font-semibold"
          >
            Don't have an account? <span className="text-coral-500 ml-1">Sign Up</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-3xl shadow-2xl">
            <User className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Join FlatMates
          </h1>
          <p className="text-lg text-slate-600 font-medium">Create your account and find your perfect flatmate</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="fullNameSignup" className="text-slate-700 font-semibold text-base">Full Name</Label>
          <Input
            id="fullNameSignup"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="roleSignup" className="text-slate-700 font-semibold text-base">I am a</Label>
          <Select value={role} onValueChange={(value: 'flat_seeker' | 'flat_owner') => setRole(value)}>
            <SelectTrigger className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl">
              <SelectItem value="flat_seeker" className="text-lg py-3 rounded-xl">🏠 Flat Seeker</SelectItem>
              <SelectItem value="flat_owner" className="text-lg py-3 rounded-xl">🔑 Flat Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="emailSignup" className="text-slate-700 font-semibold text-base">Email Address</Label>
          <Input
            id="emailSignup"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="passwordSignup" className="text-slate-700 font-semibold text-base">Password</Label>
          <div className="relative">
            <Input
              id="passwordSignup"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-slate-500" />
              ) : (
                <Eye className="h-4 w-4 text-slate-500" />
              )}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSignUp}
          disabled={isLoading}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Create Account</span>
            </div>
          )}
        </Button>

        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setMode('signin')}
            className="text-slate-600 hover:text-coral-500 font-semibold"
          >
            Already have an account? <span className="text-coral-500 ml-1">Sign In</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg bg-white/80 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-lg opacity-40 rounded-2xl"></div>
                <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-3 rounded-2xl shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                FlatMates
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            {mode === 'signin' ? renderSignIn() : renderSignUp()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
