import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plane, Calendar, CheckCircle, Clock, XCircle, ArrowRight, MapPin, MessageCircle, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  requested: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Pending' },
  accepted: { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Accepted' },
  'deposit-held': { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10', label: 'Deposit Held' },
  active: { icon: Plane, color: 'text-primary', bg: 'bg-primary/10', label: 'In Progress' },
  completed: { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Completed' },
  'review-pending': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Review Pending' },
  closed: { icon: CheckCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Closed' },
  declined: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Declined' },
};

const TripsPage = () => {
  const { trips, isAuthenticated, loginAsDemo, getUserById, updateTripStatus, currentUser, matches } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();

  // Find the match/chat with a specific user
  const findMatchWithUser = (userId: string) => {
    return matches.find(m => 
      (m.user1Id === currentUser?.id && m.user2Id === userId) ||
      (m.user2Id === currentUser?.id && m.user1Id === userId)
    );
  };

  if (!isAuthenticated) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <Plane className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Trips</h1>
          <p className="text-muted-foreground mb-6">Login to manage trips</p>
          <Button variant="hero" onClick={loginAsDemo}>Try Demo</Button>
        </div>
      </AppLayout>
    );
  }

  const now = new Date();
  const upcomingTrips = trips.filter(t => new Date(t.startDate) >= now || t.status === 'active');
  const pastTrips = trips.filter(t => new Date(t.endDate) < now && t.status !== 'active');

  const displayedTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Trips</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingTrips.length})
          </Button>
          <Button
            variant={activeTab === 'past' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('past')}
          >
            Past ({pastTrips.length})
          </Button>
        </div>

        {displayedTrips.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {activeTab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
            </p>
            <Link to="/swipe"><Button>Find a Host</Button></Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedTrips.map(trip => {
              const host = getUserById(trip.hostId);
              const traveler = getUserById(trip.travelerId);
              const isHost = trip.hostId === currentUser?.id;
              const otherPerson = isHost ? traveler : host;
              const config = statusConfig[trip.status];
              const StatusIcon = config.icon;

              return (
                <Card 
                  key={trip.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/trips/${trip.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isHost ? 'Hosting' : 'Traveling'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={otherPerson?.photos[0]}
                      alt={otherPerson?.name}
                      className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${otherPerson?.id}`);
                      }}
                    />
                    <div>
                      <p className="font-semibold">{otherPerson?.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {otherPerson?.city}, {otherPerson?.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.startDate), 'MMM d')} <ArrowRight className="w-3 h-3" /> {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </div>

                  {/* Purpose Tags */}
                  {trip.purposeTags && trip.purposeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {trip.purposeTags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {trip.purposeTags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{trip.purposeTags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default TripsPage;
