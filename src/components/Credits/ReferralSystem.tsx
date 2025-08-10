import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Copy, Check, ExternalLink, Gift, TrendingUp, Clock, Mail } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { toast } from 'sonner';

export const ReferralSystem = () => {
  const { 
    referrals, 
    createReferral, 
    isCreatingReferral, 
    generateReferralLink,
    getTotalReferralEarnings,
    getPendingReferralsCount 
  } = useCredits();
  
  const [referredEmail, setReferredEmail] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAllReferrals, setShowAllReferrals] = useState(false);

  const totalEarned = getTotalReferralEarnings();
  const pendingCount = getPendingReferralsCount();
  const completedCount = referrals?.filter(r => r.status === 'completed').length || 0;

  const handleCreateReferral = () => {
    if (!referredEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (!referredEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check for duplicate emails
    const isDuplicate = referrals?.some(r => 
      r.referred_email.toLowerCase() === referredEmail.toLowerCase()
    );

    if (isDuplicate) {
      toast.error('You have already referred this email address');
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
    const message = `🏠 Join FlatMates and find your perfect home! Get 10 free credits to access property contacts when you sign up: ${link}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join FlatMates - Find Your Perfect Home',
        text: message,
        url: link,
      }).catch(err => {
        console.log('Error sharing:', err);
        copyReferralLink(referralCode);
      });
    } else {
      copyReferralLink(referralCode);
    }
  };

  const sendReferralEmail = (referralCode: string, email: string) => {
    const link = generateReferralLink(referralCode);
    const subject = encodeURIComponent('Join FlatMates - Find Your Perfect Home!');
    const body = encodeURIComponent(
      `Hi there!\n\nI've been using FlatMates to find flats and flatmates, and I thought you might be interested too!\n\n🏠 What you'll get:\n• 10 free credits to access property contacts\n• Verified listings and profiles\n• Direct connection with property owners\n• No brokerage fees\n\nJoin using my referral link: ${link}\n\nHappy house hunting!\n\nBest regards`
    );
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  const displayedReferrals = showAllReferrals ? referrals : referrals?.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Referral System</span>
          </div>
          {totalEarned > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              +{totalEarned} credits earned
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-50 border border-blue-200">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-800">{totalEarned}</div>
              <div className="text-xs text-blue-600">Credits Earned</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border border-green-200">
            <CardContent className="p-3 text-center">
              <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-800">{completedCount}</div>
              <div className="text-xs text-green-600">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border border-orange-200">
            <CardContent className="p-3 text-center">
              <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-800">{pendingCount}</div>
              <div className="text-xs text-orange-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-transparent rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Gift className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-2">How Referrals Work:</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm text-muted-foreground">Send your unique referral link to friends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm text-muted-foreground">They get 10 free credits when they sign up</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm text-muted-foreground">You earn 3 credits for each successful referral</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create New Referral */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Invite a Friend</span>
          </h4>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter friend's email address"
              value={referredEmail}
              onChange={(e) => setReferredEmail(e.target.value)}
              type="email"
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateReferral()}
            />
            <Button 
              onClick={handleCreateReferral}
              disabled={isCreatingReferral || !referredEmail.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {isCreatingReferral ? 'Creating...' : 'Invite'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Your friend will receive 10 credits, and you'll earn 3 credits when they sign up.
          </p>
        </div>

        {/* Referrals List */}
        {referrals && referrals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Referrals ({referrals.length})</h4>
              {referrals.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllReferrals(!showAllReferrals)}
                  className="text-primary hover:text-primary/80"
                >
                  {showAllReferrals ? 'Show Less' : 'Show All'}
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {displayedReferrals?.map((referral) => (
                <Card key={referral.id} className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium truncate text-sm">{referral.referred_email}</span>
                          <Badge 
                            variant={referral.status === 'completed' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {referral.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Code: {referral.referral_code}</span>
                          <span>•</span>
                          <span>{new Date(referral.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        {referral.status === 'completed' && (
                          <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">
                              +{referral.credits_awarded} credits earned
                            </span>
                          </div>
                        )}
                        
                        {referral.status === 'pending' && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-3 w-3 text-orange-600" />
                            <span className="text-xs text-orange-600">
                              Waiting for signup
                            </span>
                          </div>
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
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendReferralEmail(referral.referral_code, referral.referred_email)}
                          className="h-8 w-8 p-0"
                          title="Send email reminder"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!referrals || referrals.length === 0) && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Start Referring Friends</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Invite friends to join FlatMates and earn 3 credits for each successful referral.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                💡 <strong>Pro tip:</strong> Share on social media or WhatsApp groups for maximum reach!
              </p>
            </div>
          </div>
        )}

        {/* Referral Progress */}
        {referrals && referrals.length > 0 && (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-800 mb-3">Referral Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Completed Referrals</span>
                  <span className="font-bold text-green-800">{completedCount} / {referrals.length}</span>
                </div>
                <Progress 
                  value={referrals.length > 0 ? (completedCount / referrals.length) * 100 : 0} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-green-600">
                  <span>Keep inviting friends!</span>
                  <span>{Math.round((completedCount / Math.max(referrals.length, 1)) * 100)}% success rate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};