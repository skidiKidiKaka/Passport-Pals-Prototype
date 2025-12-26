import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const { getMatchesForUser, isAuthenticated, loginAsDemo, getUserById, currentUser } = useApp();
  const matches = getMatchesForUser();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <MessageCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground mb-6">Login to see your chats</p>
          <Button variant="hero" onClick={loginAsDemo}>Try Demo</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(match => {
              const otherUserId = match.user1Id === currentUser?.id ? match.user2Id : match.user1Id;
              const user = getUserById(otherUserId);
              if (!user) return null;
              return (
                <div key={match.id} className="bg-card rounded-xl p-4 shadow-soft hover:shadow-card transition-all flex gap-4 items-center">
                  <img 
                    src={user.photos[0]} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
                    onClick={() => navigate(`/user/${user.id}`)}
                  />
                  <Link to={`/messages/${match.id}`} className="flex-1 min-w-0">
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{match.lastMessagePreview || 'Start chatting...'}</p>
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

export default MessagesPage;