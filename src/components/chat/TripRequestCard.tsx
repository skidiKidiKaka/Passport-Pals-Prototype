import { format } from 'date-fns';
import { Calendar, Users, MapPin, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/contexts/AppContext';

interface TripRequestCardProps {
  trip: Trip;
  isHost: boolean;
  hostName: string;
  hostCity: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const TripRequestCard = ({
  trip,
  isHost,
  hostName,
  hostCity,
  onAccept,
  onDecline,
}: TripRequestCardProps) => {
  const nights = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusStyles = {
    requested: 'bg-amber-500/10 border-amber-500/30',
    accepted: 'bg-secondary/10 border-secondary/30',
    declined: 'bg-destructive/10 border-destructive/30',
  };

  const statusLabels = {
    requested: '⏳ Pending',
    accepted: '✅ Accepted',
    declined: '❌ Declined',
  };

  return (
    <div className={`rounded-xl border-2 p-4 space-y-3 ${statusStyles[trip.status as keyof typeof statusStyles] || 'bg-muted/50 border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span className="font-semibold">Stay Request</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {statusLabels[trip.status as keyof typeof statusLabels] || trip.status}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{hostCity} with {hostName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} → {format(new Date(trip.endDate), 'MMM d, yyyy')}
            <span className="ml-1 text-xs">({nights} nights)</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{trip.guestsCount} guest{trip.guestsCount > 1 ? 's' : ''}</span>
        </div>
      </div>

      {trip.purposeTags && trip.purposeTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {trip.purposeTags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {trip.notes && (
        <p className="text-sm italic text-muted-foreground">"{trip.notes}"</p>
      )}

      {/* Host actions for pending requests */}
      {isHost && trip.status === 'requested' && onAccept && onDecline && (
        <div className="flex gap-2 pt-2">
          <Button size="sm" onClick={onAccept} className="flex-1 gap-1">
            <Check className="w-4 h-4" /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={onDecline} className="flex-1 gap-1">
            <X className="w-4 h-4" /> Decline
          </Button>
        </div>
      )}
    </div>
  );
};
