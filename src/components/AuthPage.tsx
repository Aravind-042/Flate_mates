
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Mail, User, Lock, Sparkles, Eye, EyeOff, Home, Shield, Heart } from "lucide-react";

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

  const features = [
    { icon: Shield, text: "Secure & Verified" },
    { icon: Heart, text: "Perfect Matches" },
    { icon: Home, text: "Find Your Home" }
  ];

  const renderSignIn = () => (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-5 rounded-3xl shadow-2xl inline-block">
            <Lock className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-xl text-slate-600 font-medium">Continue your flatmate journey</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="email" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="password" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
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
              className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg pr-14 transition-all duration-200 hover:shadow-xl"
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
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
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
            onClick={() => setMode('signup')}
            className="text-slate-600 hover:text-coral-500 font-semibold text-lg"
          >
            Don't have an account? <span className="text-coral-500 ml-2 underline">Sign Up</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-2xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-5 rounded-3xl shadow-2xl inline-block">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Join FlatMates
          </h1>
          <p className="text-xl text-slate-600 font-medium">Create your account and find your perfect flatmate</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="fullNameSignup" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="fullNameSignup"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="roleSignup" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
            <Home className="h-4 w-4" />
            I am a
          </Label>
          <Select value={role} onValueChange={(value: 'flat_seeker' | 'flat_owner') => setRole(value)}>
            <SelectTrigger className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-slate-200 rounded-2xl shadow-2xl">
              <SelectItem value="flat_seeker" className="text-lg py-4 rounded-xl hover:bg-coral-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <span>Flat Seeker</span>
                </div>
              </SelectItem>
              <SelectItem value="flat_owner" className="text-lg py-4 rounded-xl hover:bg-coral-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <span>Flat Owner</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label htmlFor="emailSignup" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Address
          </Label>
          <Input
            id="emailSignup"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="passwordSignup" className="text-slate-700 font-semibold text-lg flex items-center gap-2">
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
              className="h-16 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg pr-14 transition-all duration-200 hover:shadow-xl"
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
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
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
            onClick={() => setMode('signin')}
            className="text-slate-600 hover:text-coral-500 font-semibold text-lg"
          >
            Already have an account? <span className="text-coral-500 ml-2 underline">Sign In</span>
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
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-lg opacity-40 rounded-3xl"></div>
                <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-3xl shadow-2xl">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                FlatMates
              </span>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50">
                    <Icon className="h-4 w-4 text-coral-500" />
                    <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="bg-white/90 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-10">
              {mode === 'signin' ? renderSignIn() : renderSignUp()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
