import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, MapPin, Star, ShieldCheck, MessageCircle, Home, 
  Globe, Users, Clock, Heart, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserById, currentUser, matches } = useApp();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const user = getUserById(userId || '');

  const findMatchWithUser = (targetUserId: string) => {
    return matches.find(m => 
      (m.user1Id === currentUser?.id && m.user2Id === targetUserId) ||
      (m.user2Id === currentUser?.id && m.user1Id === targetUserId)
    );
  };

  if (!user) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const match = findMatchWithUser(user.id);
  const isOwnProfile = user.id === currentUser?.id;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length);
  };

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>

        {/* Photo Carousel */}
        <div className="relative mb-6">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
            <img 
              src={user.photos[currentPhotoIndex]} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {user.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {user.photos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPhotoIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Name & Basic Info */}
        <Card className="p-5 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{user.name}, {user.age}</h2>
                {user.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{user.city}, {user.country}</span>
              </div>
            </div>
            <Badge variant={user.hostingEnabled ? 'default' : 'secondary'} className="shrink-0">
              {user.hostingEnabled ? '🏠 Can Host' : '✈️ Traveling'}
            </Badge>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 text-sm">
            {user.avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-medium">{user.avgRating.toFixed(1)}</span>
                <span className="text-muted-foreground">({user.reviewCount} reviews)</span>
              </div>
            )}
            {user.responseRate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{user.responseRate}% response</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {user.level}
            </Badge>
          </div>
        </Card>

        {/* Bio */}
        {user.bio && (
          <Card className="p-5 mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              About
            </h3>
            <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
          </Card>
        )}

        {/* Languages */}
        <Card className="p-5 mb-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.languages.map(lang => (
              <Badge key={lang} variant="secondary">{lang}</Badge>
            ))}
          </div>
        </Card>

        {/* Interests */}
        <Card className="p-5 mb-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(interest => (
              <Badge key={interest} variant="outline" className="capitalize">
                {interest.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Hosting Info (if host) */}
        {user.hostingEnabled && (
          <Card className="p-5 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Hosting Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Max {user.maxGuests} guest{user.maxGuests > 1 ? 's' : ''}</span>
              </div>
              
              {user.houseVibe && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">Vibe: {user.houseVibe.replace('-', ' ')}</span>
                </div>
              )}

              {user.houseRules && user.houseRules.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <p className="font-medium mb-2">House Rules</p>
                  <ul className="space-y-1.5">
                    {user.houseRules.map((rule, i) => (
                      <li key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Travel Style */}
        {user.travelStyle && user.travelStyle.length > 0 && (
          <Card className="p-5 mb-6">
            <h3 className="font-semibold mb-3">Travel Style</h3>
            <div className="flex flex-wrap gap-2">
              {user.travelStyle.map(style => (
                <Badge key={style} className="capitalize">
                  {style}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div className="flex gap-3">
            {match ? (
              <Button 
                className="flex-1 gap-2"
                onClick={() => navigate(`/messages/${match.id}`)}
              >
                <MessageCircle className="w-4 h-4" />
                Message {user.name}
              </Button>
            ) : (
              <Button 
                className="flex-1 gap-2"
                onClick={() => navigate('/swipe')}
              >
                <Heart className="w-4 h-4" />
                Find on Swipe
              </Button>
            )}
          </div>
        )}

        {isOwnProfile && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/profile')}
          >
            Edit My Profile
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default UserProfilePage;
