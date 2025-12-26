import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, SEED_USERS, DEMO_USER } from '@/data/seedData';
import { getRankedMatches, MatchResult } from '@/lib/matchingAlgorithm';

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: Date;
  lastMessagePreview?: string;
  lastMessageAt?: Date;
}

export interface Trip {
  id: string;
  travelerId: string;
  hostId: string;
  startDate: Date;
  endDate: Date;
  guestsCount: number;
  status: 'requested' | 'accepted' | 'deposit-held' | 'active' | 'completed' | 'review-pending' | 'closed' | 'declined';
  depositStatus: 'pending' | 'held' | 'released' | 'refunded';
  notes: string;
  purposeTags: string[];
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  detectedLanguage?: string;
  translatedText?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  tripId: string;
  reviewerId: string;
  revieweeId: string;
  ratings: {
    hospitality: number;
    communication: number;
    culturalExchange: number;
    cleanliness: number;
  };
  comment: string;
  createdAt: Date;
}

export interface PointsLedgerEntry {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  createdAt: Date;
}

interface Swipe {
  swiperId: string;
  targetId: string;
  direction: 'like' | 'dislike' | 'superlike';
  createdAt: Date;
}

interface Filters {
  ageRange: { min: number; max: number };
  languages: string[];
  interests: string[];
  hostingOnly: boolean;
  verifiedOnly: boolean;
  platonicOnly: boolean;
}

interface UserSettings {
  notifications: boolean;
  emailUpdates: boolean;
  showOnlineStatus: boolean;
  language: string;
  darkMode: boolean;
}

interface AppContextType {
  // Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  createUserFromOnboarding: (userData: { name: string; age: number; city: string; country: string; interests: string[]; hostingStatus: 'hosting' | 'traveling' | 'both'; photo?: string }) => void;

  // Users
  allUsers: UserProfile[];
  getUserById: (id: string) => UserProfile | undefined;

  // Swiping
  swipeStack: MatchResult[];
  swipes: Swipe[];
  recordSwipe: (targetId: string, direction: 'like' | 'dislike' | 'superlike') => Match | null;
  refreshSwipeStack: () => void;

  // Matches
  matches: Match[];
  getMatchesForUser: () => Match[];

  // Trips
  trips: Trip[];
  createTripRequest: (hostId: string, startDate: Date, endDate: Date, guestsCount: number, notes: string, purposeTags: string[]) => Trip;
  updateTripStatus: (tripId: string, status: Trip['status']) => void;

  // Messages
  messages: Message[];
  getMessagesForMatch: (matchId: string) => Message[];
  sendMessage: (matchId: string, text: string) => Message;

  // Reviews
  reviews: Review[];
  createReview: (tripId: string, revieweeId: string, ratings: Review['ratings'], comment: string) => Review;

  // Points
  pointsLedger: PointsLedgerEntry[];
  addPoints: (amount: number, reason: string) => void;
  spendPoints: (amount: number, reason: string) => boolean;

  // Filters
  filters: Filters;
  updateFilters: (updates: Partial<Filters>) => void;

  // Onboarding
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Generate 6 rich demo matches
const generateInitialMatches = (): Match[] => {
  return [
    {
      id: 'match-1',
      user1Id: 'demo-user',
      user2Id: 'hiro-tokyo',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastMessagePreview: 'Looking forward to showing you around Tokyo!',
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'match-2',
      user1Id: 'demo-user',
      user2Id: 'sofia-barcelona',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastMessagePreview: '¡Perfecto! The tapas tour will be amazing 🍷',
      lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'match-3',
      user1Id: 'demo-user',
      user2Id: 'priya-mumbai',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastMessagePreview: 'The chai here will change your life! ☕',
      lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'match-4',
      user1Id: 'demo-user',
      user2Id: 'erik-stockholm',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastMessagePreview: 'The archipelago trip was incredible! 🌊',
      lastMessageAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'match-5',
      user1Id: 'demo-user',
      user2Id: 'camille-paris',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      lastMessagePreview: 'That hidden gallery was so special, merci! 🎨',
      lastMessageAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'match-6',
      user1Id: 'demo-user',
      user2Id: 'marco-rome',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastMessagePreview: 'Best carbonara I ever had! Grazie mille 🍝',
      lastMessageAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    },
  ];
};

const generateInitialMessages = (): Message[] => {
  return [
    // Match 1: Hiro - Tokyo (planning upcoming trip)
    { id: 'msg-1', matchId: 'match-1', senderId: 'hiro-tokyo', text: 'Hey! I saw we matched. Your profile looks great!', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'msg-2', matchId: 'match-1', senderId: 'demo-user', text: "Thanks Hiro! I've always wanted to visit Tokyo. What's your neighborhood like?", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) },
    { id: 'msg-3', matchId: 'match-1', senderId: 'hiro-tokyo', text: "It's in Shimokitazawa - vintage shops, indie cafés, and live music venues. Very local vibe!", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'msg-4', matchId: 'match-1', senderId: 'demo-user', text: "That sounds amazing! I love discovering local music scenes. Any recommendations?", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000) },
    { id: 'msg-5', matchId: 'match-1', senderId: 'hiro-tokyo', text: "There's a tiny jazz bar called Pit Inn that's legendary. Also some underground venues in Koenji 🎵", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'msg-6', matchId: 'match-1', senderId: 'hiro-tokyo', text: 'Looking forward to showing you around Tokyo!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    
    // Match 2: Sofia - Barcelona (cultural exchange)
    { id: 'msg-7', matchId: 'match-2', senderId: 'sofia-barcelona', text: "¡Hola! Love that you're into architecture too! Have you seen Gaudí's work before?", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 'msg-8', matchId: 'match-2', senderId: 'demo-user', text: "Only in photos - I'm dying to see Casa Batlló in person! Do you have any insider tips?", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000) },
    { id: 'msg-9', matchId: 'match-2', senderId: 'sofia-barcelona', text: "Go at sunset! The light through those windows is magical ✨ Also, skip Park Güell's tourist area - the free zone is better", createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: 'msg-10', matchId: 'match-2', senderId: 'demo-user', text: "This is exactly why I love Passport Pals - real local knowledge!", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'msg-11', matchId: 'match-2', senderId: 'sofia-barcelona', text: '¡Perfecto! The tapas tour will be amazing 🍷', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    
    // Match 3: Priya - Mumbai (language exchange with Hindi phrases)
    { id: 'msg-12', matchId: 'match-3', senderId: 'priya-mumbai', text: 'Namaste! 🙏 So excited you want to visit Mumbai! First trip to India?', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 'msg-13', matchId: 'match-3', senderId: 'demo-user', text: "Yes! I'm a bit nervous about navigating the city honestly. Any tips?", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) },
    { id: 'msg-14', matchId: 'match-3', senderId: 'priya-mumbai', text: "Don't worry! Mumbai is chaotic but friendly. Learn to say 'Dhanyavaad' (thank you) and everyone will help you 😊", createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
    { id: 'msg-15', matchId: 'match-3', senderId: 'demo-user', text: "Dhanyavaad! Did I get it right? Also, I'm vegetarian - will that be okay there?", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
    { id: 'msg-16', matchId: 'match-3', senderId: 'priya-mumbai', text: "Perfect pronunciation! And India is a vegetarian paradise - you'll be spoiled for choice! My kitchen is fully veg 🌱", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 'msg-17', matchId: 'match-3', senderId: 'priya-mumbai', text: 'The chai here will change your life! ☕', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    
    // Match 4: Erik - Stockholm (outdoor activities)
    { id: 'msg-18', matchId: 'match-4', senderId: 'erik-stockholm', text: 'Hej! I see you love hiking too! Have you experienced Scandinavian nature before?', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    { id: 'msg-19', matchId: 'match-4', senderId: 'demo-user', text: "Never! I'm curious about the midnight sun. Is it really bright all night?", createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000) },
    { id: 'msg-20', matchId: 'match-4', senderId: 'erik-stockholm', text: "In June, yes! It's magical but bring an eye mask for sleeping 😄 The archipelago has 30,000 islands to explore", createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
    { id: 'msg-21', matchId: 'match-4', senderId: 'demo-user', text: "30,000?! That's insane. Which ones are your favorites?", createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 'msg-22', matchId: 'match-4', senderId: 'erik-stockholm', text: "Sandhamn for sailing, Fjäderholmarna for a quick escape, and Utö for serious hiking. We can kayak between them!", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
    { id: 'msg-23', matchId: 'match-4', senderId: 'erik-stockholm', text: 'The archipelago trip was incredible! 🌊', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    
    // Match 5: Camille - Paris (art and cafés)
    { id: 'msg-24', matchId: 'match-5', senderId: 'camille-paris', text: 'Bonjour! Your photography is beautiful - do you shoot film or digital?', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { id: 'msg-25', matchId: 'match-5', senderId: 'demo-user', text: "Both! But I love the surprise of film. Are there good camera shops in Paris?", createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000) },
    { id: 'msg-26', matchId: 'match-5', senderId: 'camille-paris', text: "There's a hidden shop in the 11th that still develops film same-day. The owner has been doing it since the 70s! 📷", createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
    { id: 'msg-27', matchId: 'match-5', senderId: 'demo-user', text: "That's exactly the kind of place I love finding. Tourist guides never mention these gems!", createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { id: 'msg-28', matchId: 'match-5', senderId: 'camille-paris', text: 'That hidden gallery was so special, merci! 🎨', createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
    
    // Match 6: Marco - Rome (fun food banter)
    { id: 'msg-29', matchId: 'match-6', senderId: 'marco-rome', text: 'Ciao! I must warn you - after eating here, food anywhere else will seem boring 😄', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'msg-30', matchId: 'match-6', senderId: 'demo-user', text: "Challenge accepted! I'm ready for authentic Italian food. What's the first thing I should try?", createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000) },
    { id: 'msg-31', matchId: 'match-6', senderId: 'marco-rome', text: "Cacio e pepe from my nonna's recipe. Simple but perfect. Also, NEVER put cream in carbonara - this is very important! 🍝", createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
    { id: 'msg-32', matchId: 'match-6', senderId: 'demo-user', text: "Ha! I promise to respect Roman pasta traditions. What about gelato? Any favorites?", createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000) },
    { id: 'msg-33', matchId: 'match-6', senderId: 'marco-rome', text: "Fatamorgana in Trastevere - they make ricotta and fig flavor that will make you cry happy tears 🍨", createdAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000) },
    { id: 'msg-34', matchId: 'match-6', senderId: 'demo-user', text: 'Best carbonara I ever had! Grazie mille 🍝', createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
  ];
};

const generateInitialTrips = (): Trip[] => {
  return [
    // 3 Upcoming trips
    {
      id: 'trip-demo-1',
      travelerId: 'demo-user',
      hostId: 'hiro-tokyo',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'accepted',
      depositStatus: 'held',
      notes: 'Excited to explore Tokyo and the music scene!',
      purposeTags: ['cultural exchange', 'food', 'music'],
    },
    {
      id: 'trip-demo-2',
      travelerId: 'demo-user',
      hostId: 'sofia-barcelona',
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'accepted',
      depositStatus: 'held',
      notes: 'Architecture tour and tapas adventures!',
      purposeTags: ['architecture', 'food', 'art'],
    },
    {
      id: 'trip-demo-3',
      travelerId: 'demo-user',
      hostId: 'priya-mumbai',
      startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 67 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'requested',
      depositStatus: 'pending',
      notes: 'Would love to learn about vegetarian cooking and visit temples',
      purposeTags: ['cooking', 'temples', 'cultural exchange'],
    },
    // 3 Past trips
    {
      id: 'trip-demo-4',
      travelerId: 'demo-user',
      hostId: 'erik-stockholm',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'completed',
      depositStatus: 'released',
      notes: 'Amazing archipelago adventure!',
      purposeTags: ['nature', 'hiking', 'kayaking'],
    },
    {
      id: 'trip-demo-5',
      travelerId: 'demo-user',
      hostId: 'camille-paris',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'completed',
      depositStatus: 'released',
      notes: 'Gallery hopping and croissant tasting',
      purposeTags: ['art', 'photography', 'cafés'],
    },
    {
      id: 'trip-demo-6',
      travelerId: 'demo-user',
      hostId: 'marco-rome',
      startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'completed',
      depositStatus: 'released',
      notes: 'The best pasta of my life!',
      purposeTags: ['food', 'cooking', 'history'],
    },
    // 1 trip where user was HOST
    {
      id: 'trip-demo-7',
      travelerId: 'yuki-kyoto',
      hostId: 'demo-user',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
      guestsCount: 1,
      status: 'completed',
      depositStatus: 'released',
      notes: 'Lovely guest who taught me about tea ceremonies',
      purposeTags: ['cultural exchange', 'meditation'],
    },
  ];
};

const generateInitialPointsLedger = (): PointsLedgerEntry[] => {
  return [
    { id: 'pts-1', userId: 'demo-user', type: 'earn', amount: 100, reason: 'Welcome bonus', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    { id: 'pts-2', userId: 'demo-user', type: 'earn', amount: 100, reason: 'Hosted a traveler', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { id: 'pts-3', userId: 'demo-user', type: 'earn', amount: 50, reason: 'Received 5-star review', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { id: 'pts-4', userId: 'demo-user', type: 'earn', amount: 30, reason: 'Verified profile', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 'pts-5', userId: 'demo-user', type: 'spend', amount: 50, reason: 'Super Like boost', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  ];
};

// AI contextual response generator
const generateContextualResponse = (userMessage: string, otherUserName: string, otherUserCity: string): string => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Greeting responses
  if (lowerMsg.match(/^(hi|hey|hello|hola|bonjour|ciao)/)) {
    return `Hey there! So glad you reached out 😊 How are you doing? I'm excited about the possibility of connecting!`;
  }
  
  // Questions about the host/city
  if (lowerMsg.includes('neighborhood') || lowerMsg.includes('area') || lowerMsg.includes('where do you live')) {
    return `My neighborhood is one of my favorite parts of ${otherUserCity}! It's got this perfect mix of local charm and hidden gems. There are some amazing cafes and authentic restaurants nearby that tourists rarely find.`;
  }
  
  // Travel/visit related
  if (lowerMsg.includes('visit') || lowerMsg.includes('trip') || lowerMsg.includes('travel') || lowerMsg.includes('come')) {
    return `I'd love to have you visit ${otherUserCity}! When are you thinking of coming? I can help you plan an amazing itinerary with local experiences you won't find in guidebooks.`;
  }
  
  // Food related
  if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('restaurant') || lowerMsg.includes('cuisine')) {
    return `Oh, you're in for a treat! The food scene here in ${otherUserCity} is incredible. I know some family-run spots that serve the most authentic dishes. We should definitely do a food tour together!`;
  }
  
  // Positive/excited responses
  if (lowerMsg.match(/(great|awesome|amazing|excited|perfect|sounds good|yes|please|love|wonderful)/)) {
    return `I'm so glad you're excited! This is going to be such a great experience. Feel free to ask me anything about ${otherUserCity} or about staying with me. I'm here to help!`;
  }
  
  // Questions (detected by ?)
  if (lowerMsg.includes('?')) {
    return `That's a great question! Let me think... I'd say the best advice I can give is to come with an open mind. ${otherUserCity} has so much to offer beyond the tourist spots. I'll make sure you get the authentic local experience!`;
  }
  
  // Thanks/gratitude
  if (lowerMsg.includes('thank') || lowerMsg.includes('appreciate')) {
    return `You're so welcome! I really enjoy connecting with travelers and sharing my city. It's what Passport Pals is all about - real connections and cultural exchange! 🌍`;
  }
  
  // Default contextual responses
  const contextualResponses = [
    `That's really interesting! I love learning about other travelers' experiences. What draws you to ${otherUserCity}?`,
    `I totally understand! ${otherUserCity} has such a unique vibe. I think you'll really feel at home here.`,
    `Absolutely! I'm looking forward to showing you around and introducing you to some local friends too.`,
    `That sounds wonderful! By the way, is there anything specific you'd like to experience while you're here?`,
    `I couldn't agree more! Feel free to reach out anytime if you have questions about the trip or ${otherUserCity} in general.`,
  ];
  
  return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [allUsers] = useState<UserProfile[]>(SEED_USERS);
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pointsLedger, setPointsLedger] = useState<PointsLedgerEntry[]>([]);
  const [swipeStack, setSwipeStack] = useState<MatchResult[]>([]);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ageRange: { min: 18, max: 65 },
    languages: [],
    interests: [],
    hostingOnly: false,
    verifiedOnly: false,
    platonicOnly: false,
  });
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    emailUpdates: true,
    showOnlineStatus: true,
    language: 'en',
    darkMode: false,
  });

  const dedupeMatches = (list: Match[]): Match[] => {
    const byPair = new Map<string, Match>();

    for (const m of list) {
      const key = [m.user1Id, m.user2Id].sort().join('::');
      const existing = byPair.get(key);

      // Keep the most recently active match (fallback to createdAt)
      const existingTs = (existing?.lastMessageAt ?? existing?.createdAt)?.getTime?.() ?? 0;
      const currentTs = (m.lastMessageAt ?? m.createdAt)?.getTime?.() ?? 0;

      if (!existing || currentTs >= existingTs) {
        byPair.set(key, m);
      }
    }

    return Array.from(byPair.values()).sort((a, b) => {
      const aTs = (a.lastMessageAt ?? a.createdAt)?.getTime?.() ?? 0;
      const bTs = (b.lastMessageAt ?? b.createdAt)?.getTime?.() ?? 0;
      return bTs - aTs;
    });
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('passportpals_user');
    const savedOnboarding = localStorage.getItem('passportpals_onboarding');
    const savedSwipes = localStorage.getItem('passportpals_swipes');
    const savedMatches = localStorage.getItem('passportpals_matches');
    const savedTrips = localStorage.getItem('passportpals_trips');
    const savedPoints = localStorage.getItem('passportpals_points');
    const savedSettings = localStorage.getItem('passportpals_settings');
    const savedDemoMode = localStorage.getItem('passportpals_demomode');

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedOnboarding) {
      setOnboardingComplete(JSON.parse(savedOnboarding));
    }
    if (savedDemoMode) {
      setIsDemoMode(JSON.parse(savedDemoMode));
    }
    if (savedSwipes) {
      setSwipes(JSON.parse(savedSwipes));
    }
    if (savedMatches) {
      const parsedMatches = dedupeMatches(
        JSON.parse(savedMatches).map((m: Match) => ({
          ...m,
          createdAt: new Date(m.createdAt),
          lastMessageAt: m.lastMessageAt ? new Date(m.lastMessageAt) : undefined,
        }))
      );

      setMatches(parsedMatches);
      // Persist the cleaned list (migrates any duplicates out of storage)
      localStorage.setItem('passportpals_matches', JSON.stringify(parsedMatches));

      // Regenerate messages for demo matches (not stored in localStorage to save space)
      if (savedDemoMode && JSON.parse(savedDemoMode)) {
        setMessages(generateInitialMessages());
      }
    }
    if (savedTrips) {
      setTrips(JSON.parse(savedTrips).map((t: Trip) => ({
        ...t,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
      })));
    }
    if (savedPoints) {
      setPointsLedger(JSON.parse(savedPoints).map((p: PointsLedgerEntry) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      })));
    }
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Continuously enforce: only one match thread per user-pair
  useEffect(() => {
    if (!matches.length) return;

    const uniquePairCount = new Set(matches.map(m => [m.user1Id, m.user2Id].sort().join('::'))).size;
    if (uniquePairCount === matches.length) return;

    const deduped = dedupeMatches(matches);
    setMatches(deduped);
    localStorage.setItem('passportpals_matches', JSON.stringify(deduped));
  }, [matches]);

  // Refresh swipe stack when user, swipes, matches, or filters change
  useEffect(() => {
    if (currentUser) {
      refreshSwipeStack();
    }
  }, [currentUser, filters, swipes, matches]);

  const refreshSwipeStack = () => {
    if (!currentUser) return;

    // Exclude anyone you've already swiped on OR already matched with
    const excludedIds = new Set(swipes.filter(s => s.swiperId === currentUser.id).map(s => s.targetId));
    for (const m of matches) {
      if (m.user1Id === currentUser.id) excludedIds.add(m.user2Id);
      if (m.user2Id === currentUser.id) excludedIds.add(m.user1Id);
    }

    const ranked = getRankedMatches(currentUser, allUsers, excludedIds, filters);
    setSwipeStack(ranked);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock auth
    const user = allUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('passportpals_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const loginAsDemo = () => {
    setCurrentUser(DEMO_USER);
    setIsDemoMode(true);
    setOnboardingComplete(true);
    // Reset swipes for fresh demo experience
    setSwipes([]);
    const initialMatches = generateInitialMatches();
    const initialMessages = generateInitialMessages();
    const initialTrips = generateInitialTrips();
    const initialPoints = generateInitialPointsLedger();
    setMatches(initialMatches);
    setMessages(initialMessages);
    setTrips(initialTrips);
    setPointsLedger(initialPoints);
    localStorage.setItem('passportpals_user', JSON.stringify(DEMO_USER));
    localStorage.setItem('passportpals_onboarding', 'true');
    localStorage.setItem('passportpals_demomode', 'true');
    localStorage.removeItem('passportpals_swipes'); // Clear old swipes
    localStorage.setItem('passportpals_matches', JSON.stringify(initialMatches));
    // Don't store messages in localStorage - they're regenerated on load to save space
    localStorage.setItem('passportpals_trips', JSON.stringify(initialTrips));
    localStorage.setItem('passportpals_points', JSON.stringify(initialPoints));
  };

  const createUserFromOnboarding = (userData: { name: string; age: number; city: string; country: string; interests: string[]; hostingStatus: 'hosting' | 'traveling' | 'both'; photo?: string }) => {
    // Determine profile photo
    const photo = userData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop';
    
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: `${userData.name.toLowerCase().replace(/\s+/g, '')}@passportpals.app`,
      age: userData.age,
      city: userData.city,
      country: userData.country,
      bio: `Excited to explore the world and meet new friends through Passport Pals!`,
      photos: [photo],
      interests: userData.interests,
      languages: ['English'],
      primaryLanguage: 'English',
      hostingEnabled: userData.hostingStatus === 'hosting' || userData.hostingStatus === 'both',
      maxGuests: 2,
      houseRules: [],
      houseVibe: 'quiet-cozy',
      level: 'Explorer',
      avgRating: 0,
      reviewCount: 0,
      verificationStatus: 'unverified',
      hostingPointsBalance: 100,
      createdAt: new Date(),
      personalitySliders: { planningStyle: 50, socialBattery: 50, foodAdventure: 50, dailyPace: 50 },
      travelStyle: ['culture', 'people'],
      romanticIntent: 'open',
      agePreference: { min: 18, max: 65 },
      genderPreference: [],
      languagePreference: [],
    };

    setCurrentUser(newUser);
    setIsDemoMode(true); // Enable demo mode for initial content
    setOnboardingComplete(true);
    // Reset swipes for fresh experience
    setSwipes([]);
    
    // Give initial matches, messages, and trips for demo purposes
    const initialMatches = generateInitialMatches().map(m => ({ ...m, user1Id: newUser.id }));
    const initialMessages = generateInitialMessages();
    const initialTrips = generateInitialTrips().map(t => ({
      ...t,
      travelerId: t.travelerId === 'demo-user' ? newUser.id : t.travelerId,
      hostId: t.hostId === 'demo-user' ? newUser.id : t.hostId,
    }));
    const initialPoints: PointsLedgerEntry[] = [
      { id: 'pts-welcome', userId: newUser.id, type: 'earn', amount: 100, reason: 'Welcome bonus', createdAt: new Date() },
    ];
    
    setMatches(initialMatches);
    setMessages(initialMessages);
    setTrips(initialTrips);
    setPointsLedger(initialPoints);
    
    // Store minimal data in localStorage (not messages to avoid quota issues)
    localStorage.setItem('passportpals_user', JSON.stringify(newUser));
    localStorage.setItem('passportpals_onboarding', 'true');
    localStorage.setItem('passportpals_demomode', 'true');
    localStorage.removeItem('passportpals_swipes'); // Clear old swipes
    localStorage.setItem('passportpals_matches', JSON.stringify(initialMatches));
    localStorage.setItem('passportpals_trips', JSON.stringify(initialTrips));
    localStorage.setItem('passportpals_points', JSON.stringify(initialPoints));
  };

  const logout = () => {
    setCurrentUser(null);
    setIsDemoMode(false);
    setOnboardingComplete(false);
    setSwipes([]);
    setMatches([]);
    setMessages([]);
    setTrips([]);
    setPointsLedger([]);
    localStorage.removeItem('passportpals_user');
    localStorage.removeItem('passportpals_onboarding');
    localStorage.removeItem('passportpals_demomode');
    localStorage.removeItem('passportpals_swipes');
    localStorage.removeItem('passportpals_matches');
    localStorage.removeItem('passportpals_trips');
    localStorage.removeItem('passportpals_points');
    localStorage.removeItem('passportpals_settings');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('passportpals_user', JSON.stringify(updated));
  };

  const getUserById = (id: string) => {
    if (currentUser && (id === 'demo-user' || id === currentUser.id)) return currentUser;
    return allUsers.find(u => u.id === id);
  };

  const recordSwipe = (targetId: string, direction: 'like' | 'dislike' | 'superlike'): Match | null => {
    if (!currentUser) return null;

    const newSwipe: Swipe = {
      swiperId: currentUser.id,
      targetId,
      direction,
      createdAt: new Date(),
    };

    const updatedSwipes = [...swipes, newSwipe];
    setSwipes(updatedSwipes);
    localStorage.setItem('passportpals_swipes', JSON.stringify(updatedSwipes));

    const existingMatch = matches.find(m => {
      const key = [m.user1Id, m.user2Id].sort().join('::');
      const currentKey = [currentUser.id, targetId].sort().join('::');
      return key === currentKey;
    });

    // If a match already exists for this pair, don't create another one.
    if (existingMatch) {
      setSwipeStack(prev => prev.filter(m => m.user.id !== targetId));
      return existingMatch;
    }

    // Check for mutual like (simplified: assume target always likes back for demo)
    if (direction === 'like' || direction === 'superlike') {
      // 50% chance of mutual match for demo purposes
      if (Math.random() > 0.5 || direction === 'superlike') {
        const newMatch: Match = {
          id: `match-${Date.now()}`,
          user1Id: currentUser.id,
          user2Id: targetId,
          createdAt: new Date(),
        };

        const updatedMatches = [...matches, newMatch]
          .filter((m, idx, arr) => {
            const key = [m.user1Id, m.user2Id].sort().join('::');
            return arr.findIndex(x => [x.user1Id, x.user2Id].sort().join('::') === key) === idx;
          });

        setMatches(updatedMatches);
        localStorage.setItem('passportpals_matches', JSON.stringify(updatedMatches));

        // Remove from swipe stack
        setSwipeStack(prev => prev.filter(m => m.user.id !== targetId));

        return newMatch;
      }
    }

    // Remove from swipe stack
    setSwipeStack(prev => prev.filter(m => m.user.id !== targetId));
    return null;
  };

  const getMatchesForUser = () => {
    if (!currentUser) return [];

    const userMatches = matches.filter(m => m.user1Id === currentUser.id || m.user2Id === currentUser.id);

    // Safety: ensure only 1 conversation per other user
    const seenOtherUserIds = new Set<string>();
    return userMatches.filter(m => {
      const otherUserId = m.user1Id === currentUser.id ? m.user2Id : m.user1Id;
      if (seenOtherUserIds.has(otherUserId)) return false;
      seenOtherUserIds.add(otherUserId);
      return true;
    });
  };

  const createTripRequest = (
    hostId: string,
    startDate: Date,
    endDate: Date,
    guestsCount: number,
    notes: string,
    purposeTags: string[]
  ): Trip => {
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      travelerId: currentUser?.id || 'demo-user',
      hostId,
      startDate,
      endDate,
      guestsCount,
      status: 'requested',
      depositStatus: 'pending',
      notes,
      purposeTags,
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem('passportpals_trips', JSON.stringify(updatedTrips));

    // Simulate AI host accepting the request after 3-5 seconds
    const host = allUsers.find(u => u.id === hostId);
    if (host) {
      setTimeout(() => {
        setTrips(prev => {
          const updated = prev.map(t => 
            t.id === newTrip.id 
              ? { ...t, status: 'accepted' as const, depositStatus: 'held' as const }
              : t
          );
          localStorage.setItem('passportpals_trips', JSON.stringify(updated));
          return updated;
        });

        // Find the match to send an acceptance message
        const match = matches.find(m => 
          (m.user1Id === currentUser?.id && m.user2Id === hostId) ||
          (m.user2Id === currentUser?.id && m.user1Id === hostId)
        );
        
        if (match) {
          const acceptMessage: Message = {
            id: `msg-${Date.now()}-accept`,
            matchId: match.id,
            senderId: hostId,
            text: `Great news! 🎉 I've accepted your stay request for ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. I'm looking forward to hosting you in ${host.city}! Let's plan the details.`,
            createdAt: new Date(),
          };
          setMessages(prev => [...prev, acceptMessage]);
          setMatches(prev => prev.map(m => 
            m.id === match.id 
              ? { ...m, lastMessagePreview: acceptMessage.text, lastMessageAt: new Date() }
              : m
          ));
        }
      }, 3000 + Math.random() * 2000);
    }

    return newTrip;
  };

  const updateTripStatus = (tripId: string, status: Trip['status']) => {
    const updatedTrips = trips.map(t => {
      if (t.id === tripId) {
        let depositStatus = t.depositStatus;
        if (status === 'accepted') depositStatus = 'held';
        if (status === 'completed') depositStatus = 'released';
        if (status === 'declined') depositStatus = 'refunded';
        return { ...t, status, depositStatus };
      }
      return t;
    });
    setTrips(updatedTrips);
    localStorage.setItem('passportpals_trips', JSON.stringify(updatedTrips));
  };

  const getMessagesForMatch = (matchId: string) => {
    return messages
      .filter(m => m.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const sendMessage = (matchId: string, text: string): Message => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: currentUser?.id || 'demo-user',
      text,
      createdAt: new Date(),
    };
    let updatedMessages = [...messages, newMessage];
    
    // Simulate AI auto-reply after 1-2 seconds
    setTimeout(() => {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const otherUserId = match.user1Id === currentUser?.id ? match.user2Id : match.user1Id;
        const otherUser = allUsers.find(u => u.id === otherUserId);
        const aiReply: Message = {
          id: `msg-${Date.now()}-ai`,
          matchId,
          senderId: otherUserId,
          text: generateContextualResponse(text, otherUser?.name || 'Friend', otherUser?.city || 'my city'),
          createdAt: new Date(),
        };
        setMessages(prev => [...prev, aiReply]);
        setMatches(prev => prev.map(m => 
          m.id === matchId 
            ? { ...m, lastMessagePreview: aiReply.text, lastMessageAt: new Date() }
            : m
        ));
      }
    }, 1000 + Math.random() * 1000);

    setMessages(updatedMessages);

    // Update match last message
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, lastMessagePreview: text, lastMessageAt: new Date() }
        : m
    ));

    return newMessage;
  };

  const createReview = (
    tripId: string,
    revieweeId: string,
    ratings: Review['ratings'],
    comment: string
  ): Review => {
    const newReview: Review = {
      id: `review-${Date.now()}`,
      tripId,
      reviewerId: currentUser?.id || 'demo-user',
      revieweeId,
      ratings,
      comment,
      createdAt: new Date(),
    };
    setReviews(prev => [...prev, newReview]);

    // Award points for completing review
    addPoints(25, 'Completed trip review');

    return newReview;
  };

  const addPoints = (amount: number, reason: string) => {
    if (!currentUser) return;
    
    const entry: PointsLedgerEntry = {
      id: `points-${Date.now()}`,
      userId: currentUser.id,
      type: 'earn',
      amount,
      reason,
      createdAt: new Date(),
    };
    const updatedLedger = [...pointsLedger, entry];
    setPointsLedger(updatedLedger);
    localStorage.setItem('passportpals_points', JSON.stringify(updatedLedger));
    updateProfile({ hostingPointsBalance: currentUser.hostingPointsBalance + amount });
  };

  const spendPoints = (amount: number, reason: string): boolean => {
    if (!currentUser || currentUser.hostingPointsBalance < amount) return false;
    
    const entry: PointsLedgerEntry = {
      id: `points-${Date.now()}`,
      userId: currentUser.id,
      type: 'spend',
      amount,
      reason,
      createdAt: new Date(),
    };
    const updatedLedger = [...pointsLedger, entry];
    setPointsLedger(updatedLedger);
    localStorage.setItem('passportpals_points', JSON.stringify(updatedLedger));
    updateProfile({ hostingPointsBalance: currentUser.hostingPointsBalance - amount });
    return true;
  };

  const updateFilters = (updates: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    localStorage.setItem('passportpals_settings', JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isDemoMode,
        login,
        loginAsDemo,
        logout,
        updateProfile,
        createUserFromOnboarding,
        allUsers,
        getUserById,
        swipeStack,
        swipes,
        recordSwipe,
        refreshSwipeStack,
        matches,
        getMatchesForUser,
        trips,
        createTripRequest,
        updateTripStatus,
        messages,
        getMessagesForMatch,
        sendMessage,
        reviews,
        createReview,
        pointsLedger,
        addPoints,
        spendPoints,
        filters,
        updateFilters,
        onboardingComplete,
        setOnboardingComplete,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
