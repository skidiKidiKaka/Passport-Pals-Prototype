import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Calendar } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TripRequestModal } from '@/components/chat/TripRequestModal';
import { TripRequestCard } from '@/components/chat/TripRequestCard';
import { toast } from '@/hooks/use-toast';

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMessagesForMatch, sendMessage, getUserById, matches, currentUser, trips, createTripRequest, updateTripStatus, addPoints } = useApp();
  const [text, setText] = useState('');
  const [showTripModal, setShowTripModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const match = matches.find(m => m.id === id);
  const messages = id ? getMessagesForMatch(id) : [];
  
  const otherUserId = match 
    ? (match.user1Id === currentUser?.id ? match.user2Id : match.user1Id)
    : null;
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  // Find trips between these two users
  const relatedTrips = trips.filter(t => 
    (t.travelerId === currentUser?.id && t.hostId === otherUserId) ||
    (t.hostId === currentUser?.id && t.travelerId === otherUserId)
  );
  
  const pendingTrip = relatedTrips.find(t => t.status === 'requested');
  const isHostForPendingTrip = pendingTrip?.hostId === currentUser?.id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !id) return;
    sendMessage(id, text);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTripRequest = (data: {
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    notes: string;
    purposeTags: string[];
  }) => {
    if (!otherUserId || !id) return;
    
    createTripRequest(
      otherUserId,
      data.startDate,
      data.endDate,
      data.guestsCount,
      data.notes,
      data.purposeTags
    );
    
    // Send a message about the request
    const dateRange = `${data.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${data.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    sendMessage(id, `🏠 I've sent you a stay request for ${dateRange}! Looking forward to hearing from you.`);
    
    toast({
      title: 'Request Sent!',
      description: `Your stay request has been sent to ${otherUser?.name}.`,
    });
  };

  const handleAcceptTrip = (tripId: string) => {
    updateTripStatus(tripId, 'accepted');
    addPoints(50, 'Accepted hosting request');
    if (id) {
      sendMessage(id, `Great news! I've accepted your stay request. Let's plan the details! 🎉`);
    }
    toast({
      title: 'Request Accepted!',
      description: 'You earned 50 points for hosting.',
    });
  };

  const handleDeclineTrip = (tripId: string) => {
    updateTripStatus(tripId, 'declined');
    if (id) {
      sendMessage(id, `Thanks for your interest! Unfortunately those dates don't work for me. Maybe we can find another time?`);
    }
    toast({
      title: 'Request Declined',
      description: 'The traveler has been notified.',
    });
  };

  if (!match || !otherUser) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <p className="text-muted-foreground">Conversation not found</p>
          <Button variant="outline" onClick={() => navigate('/messages')} className="mt-4">
            Back to Messages
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-card">
          <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/user/${otherUser.id}`)}
          >
            <img src={otherUser.photos[0]} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-semibold">{otherUser.name}</h2>
              <p className="text-xs text-muted-foreground">{otherUser.city}, {otherUser.country}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTripModal(true)}
            className="gap-1"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Request Stay</span>
          </Button>
        </div>

        {/* Pending Trip Banner for Host */}
        {pendingTrip && isHostForPendingTrip && (
          <div className="p-3 bg-amber-500/10 border-b border-amber-500/30">
            <p className="text-sm text-center font-medium text-amber-700 dark:text-amber-400">
              🏠 You have a pending stay request! Review it below.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Show pending trip card at top */}
          {pendingTrip && (
            <TripRequestCard
              trip={pendingTrip}
              isHost={isHostForPendingTrip}
              hostName={otherUser.name}
              hostCity={otherUser.city}
              onAccept={() => handleAcceptTrip(pendingTrip.id)}
              onDecline={() => handleDeclineTrip(pendingTrip.id)}
            />
          )}

          {messages.length === 0 && !pendingTrip ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Say hi! 👋</p>
            </div>
          ) : (
            messages.map(msg => {
              // Check if sender is current user OR if it's from 'demo-user' and current user is the match owner
              const isMe = msg.senderId === currentUser?.id || 
                (msg.senderId === 'demo-user' && match?.user1Id === currentUser?.id);
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!text.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Request Modal */}
      <TripRequestModal
        open={showTripModal}
        onOpenChange={setShowTripModal}
        hostName={otherUser.name}
        hostCity={otherUser.city}
        onSubmit={handleTripRequest}
      />
    </AppLayout>
  );
};

export default ChatPage;
