import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { User, MapPin, Star, Shield, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { currentUser, isAuthenticated, loginAsDemo, logout } = useApp();
  const navigate = useNavigate();

  if (!isAuthenticated || !currentUser) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <User className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground mb-6">Login to see your profile</p>
          <Button variant="hero" onClick={loginAsDemo}>Try Demo</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="bg-card rounded-3xl p-6 shadow-card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <img src={currentUser.photos[0]} alt={currentUser.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h1>
                {currentUser.verificationStatus === 'verified' && <Shield className="w-5 h-5 text-secondary" />}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {currentUser.city}, {currentUser.country}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">{currentUser.avgRating.toFixed(1)} ({currentUser.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{currentUser.bio}</p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate('/points')}>
            <Star className="w-5 h-5" /> {currentUser.hostingPointsBalance} Host Points
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" /> Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="w-5 h-5" /> Logout
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;