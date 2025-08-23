import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Users, Gift, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';

interface CreditsDisplayProps {
  showDetails?: boolean;
  showActions?: boolean;
  compact?: boolean;
}

export const CreditsDisplay = ({ 
  showDetails = true, 
  showActions = true, 
  compact = false 
}: CreditsDisplayProps) => {
  const { 
    credits, 
    creditsLoading, 
    getCreditStatus, 
    getTotalReferralEarnings,
    getPendingReferralsCount,
    referrals 
  } = useCredits();

  const creditStatus = getCreditStatus();
  const totalEarned = getTotalReferralEarnings();
  const pendingCount = getPendingReferralsCount();

  if (creditsLoading) {
    return (
      <Card className={compact ? "w-full" : "w-full max-w-sm"}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`border-primary/20 ${creditStatus.bgColor}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Credits</span>
            </div>
            <Badge 
              variant={credits > 5 ? "default" : credits > 0 ? "secondary" : "destructive"} 
              className="font-bold"
            >
              {credits}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-primary/20 ${creditStatus.bgColor} border ${creditStatus.borderColor}`}>
      <CardContent className="p-4 space-y-4">
        {/* Main Credits Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Your Credits</p>
              <p className={`text-sm ${creditStatus.color}`}>{creditStatus.message}</p>
            </div>
          </div>
          <Badge 
            variant={credits > 5 ? "default" : credits > 0 ? "secondary" : "destructive"} 
            className="text-xl font-bold px-4 py-2"
          >
            {credits}
          </Badge>
        </div>

        {/* Detailed Stats */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-primary/10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-medium text-muted-foreground">Total Earned</span>
              </div>
              <div className="text-lg font-bold text-green-600">{totalEarned}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-muted-foreground">Referrals</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {referrals?.length || 0}
                {pendingCount > 0 && (
                  <span className="text-xs text-orange-600 ml-1">({pendingCount} pending)</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status-based Messages */}
        {credits === 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  No credits left!
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Refer friends to access property contacts
                </p>
              </div>
            </div>
          </div>
        )}

        {credits > 0 && credits <= 3 && (
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Running low on credits
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Refer more friends to earn credits
                </p>
              </div>
            </div>
          </div>
        )}

        {credits > 10 && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Great job! You have plenty of credits to explore properties.
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {showActions && credits <= 5 && (
          <div className="pt-2 border-t border-primary/10">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => {
                // This could open a referral modal or navigate to referral page
                console.log('Open referral interface');
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Refer Friends & Earn Credits
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};