import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Check, ExternalLink, Gift } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

export const ReferralSystem = () => {
  const { referrals, createReferral, isCreatingReferral, generateReferralLink } = useCredits();
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

  const shareReferralLink = (referralCode: string) => {
    const link = generateReferralLink(referralCode);
    const message = `Join this amazing flat finder app and get 10 free credits to access property contacts! ${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join our Flat Finder App',
        text: message,
        url: link,
      });
    } else {
      copyReferralLink(referralCode);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Refer Friends & Earn Credits</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Gift className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">How it works:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invite friends with your unique referral link</li>
                <li>• They get 10 free credits when they sign up</li>
                <li>• You get 3 credits for each successful referral</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Create New Referral</h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter friend's email address"
              value={referredEmail}
              onChange={(e) => setReferredEmail(e.target.value)}
              type="email"
              className="flex-1"
            />
            <Button 
              onClick={handleCreateReferral}
              disabled={isCreatingReferral}
            >
              {isCreatingReferral ? 'Creating...' : 'Create Referral'}
            </Button>
          </div>
        </div>

        {referrals && referrals.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Your Referrals ({referrals.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium truncate">{referral.referred_email}</span>
                      <Badge 
                        variant={referral.status === 'completed' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {referral.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Code: {referral.referral_code}
                      {referral.status === 'completed' && (
                        <span className="text-green-600 ml-2">+{referral.credits_awarded} credits earned</span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyReferralLink(referral.referral_code)}
                      className="h-8 w-8 p-0"
                      title="Copy link"
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
                      title="Share link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!referrals || referrals.length === 0) && (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No referrals yet. Start inviting friends!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};