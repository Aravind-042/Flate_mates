import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Users, Gift } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';

export const CreditsDisplay = () => {
  const { credits, creditsLoading } = useCredits();

  if (creditsLoading) {
    return (
      <Card className="w-full max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Coins className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Your Credits</p>
              <p className="text-xs text-muted-foreground">Contact access remaining</p>
            </div>
          </div>
          <Badge variant={credits > 5 ? "default" : credits > 0 ? "secondary" : "destructive"} className="text-lg font-bold px-3 py-1">
            {credits}
          </Badge>
        </div>
        
        {credits <= 3 && (
          <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-orange-600" />
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {credits === 0 ? 'No credits left! Refer friends to get more.' : 'Running low on credits. Refer friends to earn more!'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};