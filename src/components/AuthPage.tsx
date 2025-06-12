import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Mail, User, UserCheck, Sparkles } from "lucide-react";

type AuthStep = 'email' | 'otp' | 'profile';

export const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'flat_seeker' | 'flat_owner'>('flat_seeker');
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending OTP with metadata:', { fullName, role });
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) {
        console.error('OTP send error:', error);
        throw error;
      }
      
      console.log('OTP sent successfully');
      toast.success("OTP sent to your email!");
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Verifying OTP for email:', email);
      
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpValue,
        type: 'email'
      });

      if (error) {
        console.error('OTP verification error:', error);
        throw error;
      }

      console.log('OTP verified successfully');
      toast.success("Email verified successfully!");
      
      // Check if user has a profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User authenticated:', user.id);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile && profile.full_name) {
          console.log('Profile exists, redirecting to main app');
          window.location.href = '/';
        } else {
          console.log('Profile incomplete, showing profile step');
          setStep('profile');
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      console.log('Updating profile for user:', user.id, { fullName, role });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      toast.success("Profile completed successfully!");
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error completing profile:', error);
      toast.error(error.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-3xl shadow-2xl">
            <Mail className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Welcome to FlatMates
          </h1>
          <p className="text-lg text-slate-600 font-medium">Find your perfect flatmate adventure</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="fullName" className="text-slate-700 font-semibold text-base">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="role" className="text-slate-700 font-semibold text-base">I am a</Label>
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

        <Button 
          onClick={sendOTP}
          disabled={isLoading}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending Magic Link...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Send Magic Code</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-violet-500 blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-coral-400 to-violet-500 p-4 rounded-3xl shadow-2xl">
            <UserCheck className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-coral-400 via-pink-500 to-violet-500 bg-clip-text text-transparent">
            Check Your Email
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            We sent a 6-digit code to <span className="font-bold text-coral-500">{email}</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP value={otpValue} onChange={setOtpValue} maxLength={6}>
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index}
                  index={index} 
                  className="w-14 h-14 text-xl font-bold border-2 border-slate-200 focus:border-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={verifyOTP}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setStep('email')}
            className="w-full h-12 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Change Email Address
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProfileStep = () => (
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
            Complete Your Profile
          </h1>
          <p className="text-lg text-slate-600 font-medium">Tell us a bit about yourself</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="fullNameComplete" className="text-slate-700 font-semibold text-base">Full Name</Label>
          <Input
            id="fullNameComplete"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-14 text-lg border-2 border-slate-200 focus:border-coral-400 focus:ring-coral-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="roleComplete" className="text-slate-700 font-semibold text-base">I am a</Label>
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

        <Button 
          onClick={completeProfile}
          disabled={isLoading}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-coral-400 to-violet-500 hover:from-coral-500 hover:to-violet-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Profile...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Complete Profile</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-50 via-pink-50 to-violet-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
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
            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOTPStep()}
            {step === 'profile' && renderProfileStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
