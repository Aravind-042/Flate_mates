
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle, Shield, Lock } from "lucide-react";
import { useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import { ContactAccessModal } from "@/components/Credits/ContactAccessModal";
import { toast } from "sonner";

interface PropertyPricingProps {
  monthlyRent: number;
  securityDeposit: number | null;
  listingId: string;
  listingTitle: string;
  ownerProfile?: {
    phone_number?: string;
    email?: string;
  };
}

export const PropertyPricing = ({ 
  monthlyRent, 
  securityDeposit, 
  listingId, 
  listingTitle, 
  ownerProfile 
}: PropertyPricingProps) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactRevealed, setContactRevealed] = useState(false);
  const { credits, checkContactAccess } = useCredits();

  const handleContactAccess = async () => {
    if (credits <= 0) {
      setShowContactModal(true);
      return;
    }

    setShowContactModal(true);
  };

  const handleConfirmAccess = async () => {
    const hasAccess = await checkContactAccess(listingId);
    if (hasAccess) {
      setContactRevealed(true);
      setShowContactModal(false);
      toast.success('Contact information revealed!');
    } else {
      toast.error('Failed to access contact information');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!contactRevealed) return 'XXX-XXX-XXXX';
    return phone;
  };

  const formatEmail = (email: string) => {
    if (!contactRevealed) {
      const [name, domain] = email.split('@');
      return `${name.substring(0, 2)}***@${domain}`;
    }
    return email;
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-xl">
        <CardContent className="p-4 sm:p-6">
          {/* Price Section */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                ₹{monthlyRent.toLocaleString()}
              </div>
              <div className="text-sm sm:text-base text-slate-600 mb-3">/month</div>
              {securityDeposit && (
                <div className="text-xs sm:text-sm text-slate-600 bg-white/70 rounded-lg p-2">
                  <Shield className="h-3 w-3 inline mr-1" />
                  Security Deposit: ₹{securityDeposit.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="space-y-3">
            {!contactRevealed ? (
              <Button 
                onClick={handleContactAccess}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-xl py-3 text-sm font-semibold shadow-lg"
              >
                <Lock className="h-4 w-4 mr-2" />
                {credits > 0 ? `Reveal Contact (1 Credit)` : 'Get Credits to Access'}
              </Button>
            ) : (
              <>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-3 text-sm font-semibold shadow-lg"
                  onClick={() => window.open(`tel:${ownerProfile?.phone_number}`, '_self')}
                  disabled={!ownerProfile?.phone_number}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call {formatPhoneNumber(ownerProfile?.phone_number || '')}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-xl py-2 border-2 border-green-200 hover:bg-green-50 text-xs"
                    onClick={() => window.open(`https://wa.me/${ownerProfile?.phone_number?.replace(/\D/g, '')}`, '_blank')}
                    disabled={!ownerProfile?.phone_number}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl py-2 border-2 border-blue-200 hover:bg-blue-50 text-xs"
                    onClick={() => window.open(`mailto:${ownerProfile?.email}`, '_self')}
                    disabled={!ownerProfile?.email}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
                {ownerProfile?.email && (
                  <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded-lg">
                    Email: {formatEmail(ownerProfile.email)}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <ContactAccessModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onConfirm={handleConfirmAccess}
        listingTitle={listingTitle}
        hasCredits={credits > 0}
      />
    </>
  );
};
