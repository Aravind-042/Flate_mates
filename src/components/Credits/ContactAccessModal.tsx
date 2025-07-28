import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, ExternalLink, Copy, Check } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ContactAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listingTitle: string;
  hasCredits: boolean;
}

export const ContactAccessModal = ({ isOpen, onClose, onConfirm, listingTitle, hasCredits }: ContactAccessModalProps) => {
  const { credits, createReferral, isCreatingReferral, referrals, generateReferralLink } = useCredits();
  const [referredEmail, setReferredEmail] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCreateReferral = () => {
    if (!referredEmail.trim() || !referredEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    createReferral(referredEmail);
    setReferredEmail('');
  };

  const copyReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    setCopiedCode(referralCode);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (hasCredits) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-primary" />
              <span>Access Contact Information</span>
            </DialogTitle>
            <DialogDescription>
              You're about to use 1 credit to access contact information for "{listingTitle}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Current Credits:</span>
              <Badge variant="secondary" className="text-lg font-bold">
                {credits}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
              <span className="text-sm font-medium">After Access:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {credits - 1}
              </Badge>
            </div>
            
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-500" />
            <span>No Credits Remaining</span>
          </DialogTitle>
          <DialogDescription>
            You need credits to access contact information. Refer friends to earn 3 credits each!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">How to earn credits:</h4>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• Invite friends using your referral link</li>
              <li>• Get 3 credits when they sign up</li>
              <li>• They get 10 credits to start with</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Create New Referral</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Friend's email address"
                value={referredEmail}
                onChange={(e) => setReferredEmail(e.target.value)}
                type="email"
              />
              <Button 
                onClick={handleCreateReferral}
                disabled={isCreatingReferral}
              >
                {isCreatingReferral ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>

          {referrals && referrals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Your Referral Links</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {referrals.slice(0, 3).map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <div>
                      <span className="font-medium">{referral.referred_email}</span>
                      <Badge 
                        variant={referral.status === 'completed' ? 'default' : 'secondary'} 
                        className="ml-2 text-xs"
                      >
                        {referral.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyReferralLink(referral.referral_code)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedCode === referral.referral_code ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};