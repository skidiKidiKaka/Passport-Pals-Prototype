import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { Heart, X, Star, MapPin, Languages, Shield, Home, MessageCircle, Compass, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SwipeFilters from '@/components/swipe/SwipeFilters';

const SwipePage = () => {
  const { swipeStack, recordSwipe, isAuthenticated, loginAsDemo } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Start Swiping</h1>
          <p className="text-muted-foreground mb-6 max-w-sm">Login to find your perfect travel pals</p>
          <Button variant="hero" size="lg" onClick={() => { loginAsDemo(); }}>
            Try Demo Mode
          </Button>
        </div>
      </AppLayout>
    );
  }

  const currentMatch = swipeStack[currentIndex];

  const handleSwipe = (direction: 'like' | 'dislike' | 'superlike') => {
    if (!currentMatch) return;
    
    setSwipeDirection(direction === 'dislike' ? 'left' : 'right');
    
    setTimeout(() => {
      const match = recordSwipe(currentMatch.user.id, direction);
      if (match) {
        toast.success(`It's a match with ${currentMatch.user.name}! 🎉`);
      }
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setCurrentPhotoIndex(0);
    }, 300);
  };

  const handlePhotoTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentMatch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;
    const totalPhotos = currentMatch.user.photos.length;
    
    if (isRightSide && currentPhotoIndex < totalPhotos - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else if (!isRightSide && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  if (!currentMatch) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">No more pals nearby</h1>
          <p className="text-muted-foreground mb-6">Check back later or adjust your filters</p>
          <Button variant="outline" onClick={() => setCurrentIndex(0)}>
            Start Over
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { user, score } = currentMatch;
  const totalPhotos = user.photos.length;

  // Format house vibe nicely
  const formatVibe = (vibe: string) => {
    return vibe.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex justify-end mb-4">
          <SwipeFilters />
        </div>
        
        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={user.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
              rotate: swipeDirection === 'left' ? -15 : swipeDirection === 'right' ? 15 : 0,
            }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-3xl shadow-elevated overflow-hidden"
          >
            {/* Photo carousel */}
            <div 
              className="relative aspect-[3/4] cursor-pointer"
              onClick={handlePhotoTap}
            >
              {/* Photo indicators */}
              <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
                {user.photos.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      idx === currentPhotoIndex 
                        ? 'bg-background' 
                        : 'bg-background/40'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhotoIndex}
                  src={user.photos[currentPhotoIndex]} 
                  alt={`${user.name} - Photo ${currentPhotoIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
              
              {/* Compatibility badge */}
              <div className="absolute top-12 right-4 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-sm font-bold text-primary">
                {score.compatibilityPercent}% Match
              </div>

              {/* Verified badge */}
              {user.verificationStatus === 'verified' && (
                <div className="absolute top-12 left-4 p-2 rounded-full bg-secondary/90 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{user.name}, {user.age}</h2>
                    <div className="flex items-center gap-2 text-primary-foreground/80">
                      <MapPin className="w-4 h-4" />
                      <span>{user.city}, {user.country}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-primary-foreground/80">
                      <Languages className="w-4 h-4" />
                      <span>{user.languages.slice(0, 3).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Match reasons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {score.reasons.map((reason, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-background/20 backdrop-blur-sm text-sm">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional info section */}
            <div className="p-6 space-y-4">
              {/* Quick stats row */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Hosting status */}
                {user.hostingEnabled && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Home className="w-4 h-4" />
                    <span>Can host</span>
                  </div>
                )}
                
                {/* Rating */}
                {user.reviewCount > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{user.avgRating.toFixed(1)}</span>
                    <span>({user.reviewCount} reviews)</span>
                  </div>
                )}
                
                {/* Response rate */}
                {user.responseRate && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{user.responseRate}% response</span>
                  </div>
                )}
              </div>

              {/* House vibe & travel style */}
              <div className="flex items-center gap-2 flex-wrap">
                {user.houseVibe && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{formatVibe(user.houseVibe)}</span>
                  </div>
                )}
                {user.travelStyle.slice(0, 2).map(style => (
                  <div 
                    key={style}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span className="capitalize">{style}</span>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <p className="text-muted-foreground line-clamp-3">{user.bio}</p>
              
              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 5).map(interest => (
                  <span key={interest} className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                    {interest}
                  </span>
                ))}
                {user.interests.length > 5 && (
                  <span className="px-3 py-1 rounded-full bg-muted text-sm text-muted-foreground">
                    +{user.interests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button 
            variant="swipe-dislike" 
            size="icon-xl"
            onClick={() => handleSwipe('dislike')}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button 
            variant="swipe-super" 
            size="icon-lg"
            onClick={() => handleSwipe('superlike')}
          >
            <Star className="w-6 h-6" />
          </Button>
          <Button 
            variant="swipe-like" 
            size="icon-xl"
            onClick={() => handleSwipe('like')}
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SwipePage;
