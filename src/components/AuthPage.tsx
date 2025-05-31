
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
import { ArrowLeft, Phone, User, UserCheck } from "lucide-react";

type AuthStep = 'phone' | 'otp' | 'profile';

export const AuthPage = () => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'flat_seeker' | 'flat_owner'>('flat_seeker');
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (error) throw error;
      
      toast.success("OTP sent successfully!");
      setStep('otp');
    } catch (error: any) {
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
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otpValue,
        type: 'sms'
      });

      if (error) throw error;

      toast.success("Phone verified successfully!");
      setStep('profile');
    } catch (error: any) {
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
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast.success("Profile completed successfully!");
      window.location.href = '/';
    } catch (error: any) {
      toast.error(error.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Phone className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold">Welcome to FlatMates</h1>
        <p className="text-gray-600">Enter your phone number to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button 
          onClick={sendOTP}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <UserCheck className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold">Verify Your Phone</h1>
        <p className="text-gray-600">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP value={otpValue} onChange={setOtpValue} maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-2">
          <Button 
            onClick={verifyOTP}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setStep('phone')}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Change Phone Number
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <User className="h-12 w-12 mx-auto text-blue-600" />
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="role">I am a</Label>
          <Select value={role} onValueChange={(value: 'flat_seeker' | 'flat_owner') => setRole(value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat_seeker">Flat Seeker</SelectItem>
              <SelectItem value="flat_owner">Flat Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={completeProfile}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-orange-500"
        >
          {isLoading ? "Completing..." : "Complete Profile"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              FlatMates
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {step === 'phone' && renderPhoneStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'profile' && renderProfileStep()}
        </CardContent>
      </Card>
    </div>
  );
};
