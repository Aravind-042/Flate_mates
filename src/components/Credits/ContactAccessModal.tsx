import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Users, ExternalLink, Copy, Check, AlertTriangle, Gift, CreditCard, LogIn } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ContactAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingTitle: string;
  listingId: string;
}

export const ContactAccessModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  listingTitle, 
  listingId 
}: ContactAccessModalProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { 
    credits, 
    createReferral, 
    isCreatingReferral, 
    referrals, 
    generateReferralLink,
    getCreditStatus,
    hasAccessedContact,
    canAccessContact,
    getPendingReferralsCount
  } = useCredits();
  
  const [referredEmail, setReferredEmail] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showReferralForm, setShowReferralForm] = useState(false);

  const creditStatus = getCreditStatus();
  const alreadyAccessed = hasAccessedContact(listingId);
  const pendingReferrals = getPendingReferralsCount();

  // If user is not authenticated, redirect to auth
  if (!isAuthenticated) {
    // Don't render the modal if user is not authenticated
    // The redirect should be handled in PropertyPricing component
    return null;
  }

  const handleCreateReferral = () => {
    if (!referredEmail.trim() || !referredEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    createReferral(referredEmail);
    setReferredEmail('');
    setShowReferralForm(false);
  };

  const copyReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    setCopiedCode(referralCode);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const shareReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    const message = `🏠 Join FlatMates and find your perfect home! Get 10 free credits to access property contacts when you sign up: ${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join FlatMates - Find Your Perfect Home',
        text: message,
        url: link,
      });
    } else {
      copyReferralLink(referralCode);
    }
  };

  // If user already accessed this contact
  if (alreadyAccessed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-500" />
              <span>Contact Already Unlocked</span>
            </DialogTitle>
            <DialogDescription>
              You've already accessed the contact information for "{listingTitle}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                ✅ You can view the contact details without using additional credits.
              </p>
            </div>
            
            <Button onClick={onConfirm} className="w-full">
              View Contact Information
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If user has credits
  if (canAccessContact) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-primary" />
              <span>Unlock Contact Information</span>
            </DialogTitle>
            <DialogDescription>
              Access contact details for "{listingTitle}" using 1 credit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Credit Status Card */}
            <Card className={`${creditStatus.bgColor} border ${creditStatus.borderColor}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Current Credits</p>
                    <p className={`text-xs ${creditStatus.color}`}>{creditStatus.message}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {credits}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Transaction Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">Current Credits:</span>
                <span className="font-bold">{credits}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium">After Access:</span>
                <span className="font-bold text-primary">{credits - 1}</span>
              </div>
            </div>

            {/* Low credits warning */}
            {credits <= 3 && (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-orange-800 font-medium text-sm">Running Low on Credits</p>
                    <p className="text-orange-700 text-xs">
                      Consider referring friends to earn more credits before they run out.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={onConfirm} className="flex-1">
                Use 1 Credit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If user has no credits - enhanced referral interface
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-orange-500" />
            <span>Earn Credits to Access Contacts</span>
          </DialogTitle>
          <DialogDescription>
            You need credits to access contact information. Refer friends to earn credits instantly!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <Card className="bg-red-50 border border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-800">No Credits Remaining</p>
                  <p className="text-red-600 text-sm">Refer friends to earn 3 credits each</p>
                </div>
                <Badge variant="destructive" className="text-lg font-bold">
                  0
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* How to Earn Credits */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                <Coins className="h-4 w-4 mr-2" />
                How to Earn Credits
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm text-blue-700">Invite friends using your referral link</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm text-blue-700">They get 10 credits when they sign up</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm text-blue-700">You get 3 credits for each successful referral</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Referral Creation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Quick Referral</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReferralForm(!showReferralForm)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {showReferralForm ? 'Hide' : 'Create New'}
                </Button>
              </div>
              
              {showReferralForm && (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Friend's email address"
                      value={referredEmail}
                      onChange={(e) => setReferredEmail(e.target.value)}
                      type="email"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleCreateReferral}
                      disabled={isCreatingReferral}
                      size="sm"
                    >
                      {isCreatingReferral ? 'Creating...' : 'Create'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your friend will get 10 credits, you'll get 3 credits when they sign up.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Referrals */}
          {referrals && referrals.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Your Referrals ({referrals.length})</h4>
                  {pendingReferrals > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {pendingReferrals} pending
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {referrals.slice(0, 5).map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium truncate">{referral.referred_email}</span>
                          <Badge 
                            variant={referral.status === 'completed' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {referral.status}
                          </Badge>
                        </div>
                        {referral.status === 'completed' && (
                          <p className="text-xs text-green-600">+{referral.credits_awarded} credits earned</p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyReferralLink(referral.referral_code)}
                          className="h-8 w-8 p-0"
                          title="Copy referral link"
                        >
                          {copiedCode === referral.referral_code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => shareReferralLink(referral.referral_code)}
                          className="h-8 w-8 p-0"
                          title="Share referral link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {referrals.length > 5 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Showing 5 of {referrals.length} referrals
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Credit Packages (Future Feature) */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Packages (Coming Soon)
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { credits: 10, price: 99, popular: false },
                  { credits: 25, price: 199, popular: true },
                  { credits: 50, price: 349, popular: false }
                ].map((pkg, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border text-center ${
                      pkg.popular 
                        ? 'bg-purple-100 border-purple-300' 
                        : 'bg-white border-purple-200'
                    }`}
                  >
                    {pkg.popular && (
                      <Badge className="mb-1 text-xs bg-purple-500">Popular</Badge>
                    )}
                    <div className="font-bold text-purple-800">{pkg.credits}</div>
                    <div className="text-xs text-purple-600">₹{pkg.price}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-600 mt-2 text-center">
                Purchase credits directly (feature coming soon)
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            {!showReferralForm && (
              <Button 
                onClick={() => setShowReferralForm(true)} 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Users className="h-4 w-4 mr-2" />
                Refer Friends
              </Button>
            )}
          </div>

          {/* Helpful Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="font-medium text-blue-800 mb-2">💡 Pro Tips</h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Share referral links on social media for more reach</li>
              <li>• Each friend who signs up gives you 3 credits</li>
              <li>• Credits never expire - earn once, use anytime</li>
              <li>• You can refer unlimited friends</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};