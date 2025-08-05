import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useCredits } from "@/hooks/useCredits";

export const ProfileStats: React.FC = () => {
  const { user } = useAuth();
  const { favorites } = useFavoritesStore();
  const { credits } = useCredits();
  const [listingsCount, setListingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListingsCount = async () => {
      if (!user?.id) return;
      
      try {
        const { count, error } = await supabase
          .from('flat_listings')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .eq('status', 'active');

        if (!error && count !== null) {
          setListingsCount(count);
        }
      } catch (error) {
        console.error('Error fetching listings count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListingsCount();
  }, [user?.id]);

  const stats = [
    {
      label: "Active Listings",
      value: loading ? "..." : listingsCount,
      gradient: "from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20",
      color: "text-primary"
    },
    {
      label: "Saved Favorites", 
      value: favorites.size,
      gradient: "from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20",
      color: "text-secondary"
    },
    {
      label: "Available Credits",
      value: credits,
      gradient: "from-accent/10 to-primary/10 hover:from-accent/20 hover:to-primary/20", 
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          className={`border-0 bg-gradient-to-br ${stat.gradient} transition-all duration-300 cursor-pointer hover:scale-105`}
        >
          <CardContent className="p-6 sm:p-8 text-center">
            <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-muted-foreground font-medium text-sm sm:text-base">
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};