import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchesPage = () => {
  const { getMatchesForUser, getUserById, isAuthenticated, loginAsDemo } = useApp();
  const matches = getMatchesForUser();

  if (!isAuthenticated) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Your Matches</h1>
          <p className="text-muted-foreground mb-6">Login to see your matches</p>
          <Button variant="hero" onClick={loginAsDemo}>Try Demo</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
        
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No matches yet. Keep swiping!</p>
            <Link to="/swipe">
              <Button variant="default">Start Swiping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(match => {
              const otherUserId = match.user1Id === 'demo-user' ? match.user2Id : match.user1Id;
              const user = getUserById(otherUserId);
              if (!user) return null;

              return (
                <div key={match.id} className="bg-card rounded-2xl p-4 shadow-card flex gap-4 items-center">
                  <img 
                    src={user.photos[0]} 
                    alt={user.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      {user.verificationStatus === 'verified' && (
                        <Star className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {user.city}, {user.country}
                    </div>
                    {match.lastMessagePreview && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {match.lastMessagePreview}
                      </p>
                    )}
                  </div>
                  <Link to={`/messages/${match.id}`}>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MatchesPage;