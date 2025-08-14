
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageCircle, Shield, Lock, CheckCircle, ExternalLink, Coins, Gift } from "lucide-react";
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
  const { 
    credits, 
    checkContactAccess, 
    hasAccessedContact, 
    canAccessContact,
    getCreditStatus 
  } = useCredits();

  const contactRevealed = hasAccessedContact(listingId);
  const creditStatus = getCreditStatus();
  const handleContactAccess = async () => {
    if (contactRevealed) {
      // User already has access, show contacts directly
      return;
    }
    
    if (!canAccessContact) {
      setShowContactModal(true);
      return;
    }

    setShowContactModal(true);
  };

  const handleConfirmAccess = async () => {
    const hasAccess = await checkContactAccess(listingId);
    if (hasAccess) {
      setShowContactModal(false);
    } else {
      setShowContactModal(false);
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
            {contactRevealed ? (
              <>
                {/* Contact Already Unlocked */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Contact Unlocked</span>
                  </div>
                </div>
                
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
            ) : (
              <>
                {/* Credit Status Indicator */}
                <div className={`p-3 rounded-xl border ${creditStatus.borderColor} ${creditStatus.bgColor} mb-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Available Credits</span>
                    </div>
                    <Badge 
                      variant={credits > 5 ? "default" : credits > 0 ? "secondary" : "destructive"}
                      className="font-bold"
                    >
                      {credits}
                    </Badge>
                  </div>
                  <p className={`text-xs mt-1 ${creditStatus.color}`}>
                    {creditStatus.message}
                  </p>
                </div>

                <Button 
                  onClick={handleContactAccess}
                  className={`w-full rounded-xl py-3 text-sm font-semibold shadow-lg transition-all duration-200 ${
                    canAccessContact
                      ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white"
                      : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  }`}
                >
                  {canAccessContact ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Unlock Contact (1 Credit)
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Earn Credits to Access
                    </>
                  )}
                </Button>
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
        listingId={listingId}
      />
    </>
  );
};
