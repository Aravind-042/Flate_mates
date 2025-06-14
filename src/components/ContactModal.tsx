
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MessageCircle,
  Phone,
  Mail,
  Instagram,
  Send,
  Heart,
  Sparkles,
  MapPin,
  Home
} from "lucide-react";
import { toast } from "sonner";

interface FlatListing {
  id: string;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  location_city: string;
  location_area: string;
  images: string[];
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: FlatListing | null;
}

export const ContactModal = ({ isOpen, onClose, listing }: ContactModalProps) => {
  const [step, setStep] = useState<'intro' | 'contact' | 'message'>('intro');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email' | 'instagram'>('phone');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    instagram: '',
    message: '',
    budget: '',
    moveInDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate sending message
    toast.success("Message sent! 🚀 They'll get back to you soon!");
    onClose();
    setStep('intro');
    setFormData({
      name: '',
      phone: '',
      email: '',
      instagram: '',
      message: '',
      budget: '',
      moveInDate: '',
    });
  };

  const renderIntroStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-haze to-neon-pink blur-xl opacity-40 rounded-full"></div>
          <div className="relative bg-gradient-to-r from-purple-haze to-neon-pink p-4 rounded-3xl">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-black hero-gradient mb-2">
          Ready to Connect?
        </h3>
        <p className="text-slate-600 font-medium">
          Let's make this connection happen! Choose how you'd like to reach out.
        </p>
      </div>

      {listing && (
        <Card className="bg-gradient-to-br from-purple-haze/5 to-neon-pink/5 border border-purple-haze/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {listing.images && listing.images.length > 0 ? (
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-purple-haze/20 to-neon-pink/20 rounded-xl flex items-center justify-center">
                  <Home className="h-8 w-8 text-purple-haze" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-black text-slate-800 mb-1">{listing.title}</h4>
                <div className="flex items-center text-sm text-slate-600 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{listing.location_area}, {listing.location_city}</span>
                </div>
                <div className="text-lg font-black hero-gradient">
                  ₹{listing.rent_amount.toLocaleString()}/month
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setContactMethod('phone');
            setStep('contact');
          }}
          className="h-20 flex-col space-y-2 border-2 border-purple-haze/20 hover:border-purple-haze hover:bg-purple-haze/5"
        >
          <Phone className="h-6 w-6 text-purple-haze" />
          <span className="font-bold text-sm">Phone</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setContactMethod('email');
            setStep('contact');
          }}
          className="h-20 flex-col space-y-2 border-2 border-electric-blue/20 hover:border-electric-blue hover:bg-electric-blue/5"
        >
          <Mail className="h-6 w-6 text-electric-blue" />
          <span className="font-bold text-sm">Email</span>
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {
            setContactMethod('instagram');
            setStep('contact');
          }}
          className="h-20 flex-col space-y-2 border-2 border-neon-pink/20 hover:border-neon-pink hover:bg-neon-pink/5"
        >
          <Instagram className="h-6 w-6 text-neon-pink" />
          <span className="font-bold text-sm">Instagram</span>
        </Button>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black hero-gradient mb-2">
          Tell Us About Yourself
        </h3>
        <p className="text-slate-600 font-medium">
          Share your details so they can get back to you! ✨
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold text-slate-700">Full Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 border-2 border-slate-200 focus:border-purple-haze rounded-xl font-medium"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="font-bold text-slate-700">Budget Range</Label>
          <Input
            id="budget"
            placeholder="₹25,000 - ₹30,000"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="h-12 border-2 border-slate-200 focus:border-purple-haze rounded-xl font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={contactMethod} className="font-bold text-slate-700">
          {contactMethod === 'phone' ? 'Phone Number' : 
           contactMethod === 'email' ? 'Email Address' : 'Instagram Handle'}
        </Label>
        <Input
          id={contactMethod}
          type={contactMethod === 'email' ? 'email' : 'text'}
          placeholder={
            contactMethod === 'phone' ? '+91 98765 43210' :
            contactMethod === 'email' ? 'your.email@example.com' : '@yourhandle'
          }
          value={formData[contactMethod]}
          onChange={(e) => setFormData({ ...formData, [contactMethod]: e.target.value })}
          className="h-12 border-2 border-slate-200 focus:border-purple-haze rounded-xl font-medium"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="moveInDate" className="font-bold text-slate-700">Preferred Move-in Date</Label>
        <Input
          id="moveInDate"
          type="date"
          value={formData.moveInDate}
          onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
          className="h-12 border-2 border-slate-200 focus:border-purple-haze rounded-xl font-medium"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="font-bold text-slate-700">Your Message</Label>
        <Textarea
          id="message"
          placeholder="Hey! I'm interested in your flat. Can we chat? I'm looking for..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="min-h-[100px] border-2 border-slate-200 focus:border-purple-haze rounded-xl font-medium resize-none"
          required
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('intro')}
          className="flex-1 h-12 border-2 border-slate-200 font-bold rounded-xl"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="btn-primary flex-1 h-12 font-bold"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto rounded-3xl border-0 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-purple-haze/5 to-neon-pink/5 p-6">
          <DialogHeader className="text-center mb-0">
            <DialogTitle className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-haze" />
              <span className="hero-gradient font-black">Let's Connect!</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6">
            {step === 'intro' && renderIntroStep()}
            {step === 'contact' && renderContactStep()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
