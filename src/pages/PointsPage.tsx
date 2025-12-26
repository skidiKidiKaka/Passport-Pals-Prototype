import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Gift, Star, History, ArrowUp, ArrowDown, Trophy, Target, Zap, Users } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const PointsPage = () => {
  const { currentUser, isAuthenticated, loginAsDemo, pointsLedger, spendPoints, addPoints } = useApp();

  if (!isAuthenticated || !currentUser) {
    return (
      <AppLayout showBottomNav>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
          <Award className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Host Points</h1>
          <p className="text-muted-foreground mb-6">Login to see your points</p>
          <Button variant="hero" onClick={loginAsDemo}>Try Demo</Button>
        </div>
      </AppLayout>
    );
  }

  const levelColors = {
    'Explorer': 'bg-muted text-muted-foreground',
    'Connector': 'bg-secondary text-secondary-foreground',
    'Local Legend': 'bg-accent text-accent-foreground',
  };

  const levelThresholds = {
    'Explorer': { min: 0, max: 200 },
    'Connector': { min: 200, max: 500 },
    'Local Legend': { min: 500, max: 1000 },
  };

  const currentLevelData = levelThresholds[currentUser.level];
  const progressToNextLevel = Math.min(100, 
    ((currentUser.hostingPointsBalance - currentLevelData.min) / (currentLevelData.max - currentLevelData.min)) * 100
  );

  const rewards = [
    { name: 'Waive security deposit', points: 200, icon: Zap },
    { name: 'Priority trip request', points: 100, icon: Target },
    { name: 'Featured profile (7 days)', points: 150, icon: Trophy },
    { name: 'Super Like boost (5x)', points: 50, icon: Star },
  ];

  const dailyChallenges = [
    { name: 'Complete your profile', points: 20, completed: currentUser.bio.length > 50 },
    { name: 'Swipe on 5 profiles', points: 10, completed: false },
    { name: 'Send a message', points: 15, completed: false },
    { name: 'Update your interests', points: 10, completed: currentUser.interests.length >= 5 },
  ];

  const handleRedeem = (reward: { name: string; points: number }) => {
    if (spendPoints(reward.points, reward.name)) {
      toast.success(`Redeemed: ${reward.name}`);
    } else {
      toast.error('Not enough points');
    }
  };

  const handleClaimChallenge = (challenge: { name: string; points: number; completed: boolean }) => {
    if (challenge.completed) {
      addPoints(challenge.points, challenge.name);
      toast.success(`+${challenge.points} points earned!`);
    }
  };

  const sortedLedger = [...pointsLedger].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalEarned = pointsLedger.filter(e => e.type === 'earn').reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = pointsLedger.filter(e => e.type === 'spend').reduce((sum, e) => sum + e.amount, 0);

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Host Points</h1>

        {/* Balance card */}
        <Card className="bg-gradient-hero p-8 text-primary-foreground mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Your Balance</p>
              <p className="text-4xl font-bold">{currentUser.hostingPointsBalance}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${levelColors[currentUser.level]}`}>
            <Star className="w-4 h-4" />
            <span className="font-medium">{currentUser.level}</span>
          </div>
          
          {/* Progress to next level */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-primary-foreground/80 mb-2">
              <span>Progress to next level</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2 bg-primary-foreground/20" />
          </div>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <ArrowUp className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary">{totalEarned}</p>
            <p className="text-xs text-muted-foreground">Total Earned</p>
          </Card>
          <Card className="p-4 text-center">
            <ArrowDown className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold text-destructive">{totalSpent}</p>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </Card>
        </div>

        {/* Daily Challenges */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Daily Challenges
          </h2>
          <div className="space-y-3">
            {dailyChallenges.map((challenge, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    challenge.completed ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                  }`}>
                    {challenge.completed && <Zap className="w-3 h-3" />}
                  </div>
                  <span className="text-sm">{challenge.name}</span>
                </div>
                <Button
                  size="sm"
                  variant={challenge.completed ? 'default' : 'outline'}
                  disabled={!challenge.completed}
                  onClick={() => handleClaimChallenge(challenge)}
                >
                  +{challenge.points}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* How to earn */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            How to Earn
          </h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Host a traveler</span>
              </div>
              <span className="font-medium text-secondary">+100 pts</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span>Get 5-star review</span>
              </div>
              <span className="font-medium text-secondary">+50 pts</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <span>Complete trip review</span>
              </div>
              <span className="font-medium text-secondary">+25 pts</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span>Verify your profile</span>
              </div>
              <span className="font-medium text-secondary">+30 pts</span>
            </li>
            <li className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-muted-foreground" />
                <span>Refer a friend</span>
              </div>
              <span className="font-medium text-secondary">+75 pts</span>
            </li>
          </ul>
        </Card>

        {/* Redeem */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent" />
            Redeem Points
          </h2>
          <div className="space-y-3">
            {rewards.map(reward => (
              <div key={reward.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <reward.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{reward.name}</span>
                </div>
                <Button
                  size="sm"
                  variant={currentUser.hostingPointsBalance >= reward.points ? 'default' : 'outline'}
                  disabled={currentUser.hostingPointsBalance < reward.points}
                  onClick={() => handleRedeem(reward)}
                >
                  {reward.points} pts
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* History */}
        <Card className="p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            Recent Activity
          </h2>
          {sortedLedger.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {sortedLedger.slice(0, 10).map(entry => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {entry.type === 'earn' ? (
                      <ArrowUp className="w-4 h-4 text-secondary" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-destructive" />
                    )}
                    <span>{entry.reason}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={entry.type === 'earn' ? 'text-secondary font-medium' : 'text-destructive font-medium'}>
                      {entry.type === 'earn' ? '+' : '-'}{entry.amount}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.createdAt), 'MMM d')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default PointsPage;
