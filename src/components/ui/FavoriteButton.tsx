
import React, { memo, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/store/favoritesStore';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  listingId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
  className?: string;
}

export const FavoriteButton = memo(({ 
  listingId, 
  size = 'md', 
  variant = 'default',
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite, isLoading } = useFavoritesStore();
  const favorite = isFavorite(listingId);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('FavoriteButton clicked for listing:', listingId);
    await toggleFavorite(listingId);
  }, [listingId, toggleFavorite]);

  const sizeClasses = {
    sm: 'h-8 w-8 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    default: 'bg-white/90 hover:bg-white border border-gray-200 shadow-md',
    minimal: 'bg-transparent hover:bg-white/10',
    floating: 'bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm'
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        'rounded-full transition-all duration-200 hover:scale-110',
        sizeClasses[size],
        variantClasses[variant],
        favorite && 'text-red-500 hover:text-red-600',
        !favorite && 'text-gray-600 hover:text-red-500',
        className
      )}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          favorite && 'fill-current'
        )}
      />
    </Button>
  );
});

FavoriteButton.displayName = 'FavoriteButton';
