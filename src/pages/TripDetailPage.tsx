import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle, XCircle, 
  MessageCircle, Star, Home, Languages, Utensils, Wifi, ShieldCheck,
  Plane, CreditCard, Heart, Globe, AlertCircle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const statusConfig = {
  requested: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Pending Approval' },
  accepted: { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Confirmed' },
  'deposit-held': { icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10', label: 'Deposit Held' },
  active: { icon: Plane, color: 'text-primary', bg: 'bg-primary/10', label: 'In Progress' },
  completed: { icon: CheckCircle, color: 'text-secondary', bg: 'bg-secondary/10', label: 'Completed' },
  'review-pending': { icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Awaiting Review' },
  closed: { icon: CheckCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Closed' },
  declined: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Declined' },
};

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trips, getUserById, currentUser, matches, updateTripStatus } = useApp();

  const trip = trips.find(t => t.id === id);
  
  if (!trip) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <p className="text-muted-foreground mb-4">Trip not found</p>
          <Button variant="outline" onClick={() => navigate('/trips')}>
            Back to Trips
          </Button>
        </div>
      </AppLayout>
    );
  }

  const host = getUserById(trip.hostId);
  const traveler = getUserById(trip.travelerId);
  const isHost = trip.hostId === currentUser?.id;
  const otherPerson = isHost ? traveler : host;
  const config = statusConfig[trip.status];
  const StatusIcon = config.icon;

  const nights = differenceInDays(new Date(trip.endDate), new Date(trip.startDate));
  const daysUntilTrip = differenceInDays(new Date(trip.startDate), new Date());

  const findMatchWithUser = (userId: string) => {
    return matches.find(m => 
      (m.user1Id === currentUser?.id && m.user2Id === userId) ||
      (m.user2Id === currentUser?.id && m.user1Id === userId)
    );
  };

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/trips')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Trip Details</h1>
        </div>

        {/* Status Banner */}
        <Card className={`p-4 mb-6 ${config.bg} border-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-6 h-6 ${config.color}`} />
              <div>
                <p className={`font-semibold ${config.color}`}>{config.label}</p>
                {daysUntilTrip > 0 && trip.status === 'accepted' && (
                  <p className="text-sm text-muted-foreground">{daysUntilTrip} days until your trip</p>
                )}
              </div>
            </div>
            <Badge variant="outline">{isHost ? 'Hosting' : 'Traveling'}</Badge>
          </div>
        </Card>

        {/* Host/Traveler Profile */}
        <Card className="p-4 mb-6">
          <div className="flex items-start gap-4">
            <img 
              src={otherPerson?.photos[0]} 
              alt={otherPerson?.name} 
              className="w-20 h-20 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              onClick={() => navigate(`/user/${otherPerson?.id}`)}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{otherPerson?.name}</h2>
                {otherPerson?.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span>{otherPerson?.city}, {otherPerson?.country}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                {otherPerson?.avgRating ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{otherPerson.avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({otherPerson.reviewCount} reviews)</span>
                  </div>
                ) : null}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{otherPerson?.languages?.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {otherPerson?.bio && (
            <p className="text-sm text-muted-foreground mt-4 italic">"{otherPerson.bio}"</p>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => {
                const match = findMatchWithUser(otherPerson?.id || '');
                if (match) navigate(`/messages/${match.id}`);
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Message {isHost ? 'Traveler' : 'Host'}
            </Button>
          </div>
        </Card>

        {/* Trip Details */}
        <Card className="p-4 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Trip Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{format(new Date(trip.startDate), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-medium">{format(new Date(trip.endDate), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-medium">{trip.guestsCount} guest{trip.guestsCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </Card>

        {/* Purpose & Notes */}
        {(trip.purposeTags?.length > 0 || trip.notes) && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Trip Purpose
            </h3>
            
            {trip.purposeTags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {trip.purposeTags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            
            {trip.notes && (
              <p className="text-sm text-muted-foreground italic">"{trip.notes}"</p>
            )}
          </Card>
        )}

        {/* Host's Home Info (for travelers) */}
        {!isHost && host && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              About the Home
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Max {host.maxGuests || 2} guests</span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">WiFi available</span>
              </div>
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Languages: {host.languages?.join(', ') || 'English'}</span>
              </div>
            </div>

            {/* House Rules */}
            {host.houseRules && host.houseRules.length > 0 && (
              <>
                <Separator className="my-4" />
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  House Rules
                </h4>
                <ul className="space-y-2">
                  {host.houseRules.map((rule, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* House Vibe */}
            {host.houseVibe && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Vibe: <span className="capitalize">{host.houseVibe.replace('-', ' ')}</span>
                  </span>
                </div>
              </>
            )}
          </Card>
        )}

        {/* Points Info */}
        <Card className="p-4 mb-6 bg-primary/5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Points
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">
              {isHost ? 'Points you\'ll earn for hosting' : 'Points for this stay'}
            </span>
            <span className="text-xl font-bold text-primary">{nights * 10} pts</span>
          </div>
        </Card>

        {/* Host Actions */}
        {isHost && trip.status === 'requested' && (
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-4">Respond to Request</h3>
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                onClick={() => {
                  updateTripStatus(trip.id, 'accepted');
                  navigate('/trips');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  updateTripStatus(trip.id, 'declined');
                  navigate('/trips');
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          </Card>
        )}

        {/* Cancel/Modify Actions */}
        {trip.status === 'accepted' && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
              Cancel Trip
            </Button>
            <Button variant="outline" className="flex-1">
              Modify Dates
            </Button>
          </div>
        )}

        {/* Leave Review */}
        {(trip.status === 'completed' || trip.status === 'review-pending') && (
          <Button className="w-full gap-2">
            <Star className="w-4 h-4" />
            Leave a Review
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default TripDetailPage;
