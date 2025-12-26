import { AppLayout } from '@/components/layout/AppLayout';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Mail, Eye, Globe, Moon, Shield, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SettingsPage = () => {
  const { settings, updateSettings, logout } = useApp();
  const navigate = useNavigate();

  const handleDarkModeToggle = (checked: boolean) => {
    updateSettings({ darkMode: checked });
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      logout();
      toast.success('Account deleted');
      navigate('/');
    }
  };

  return (
    <AppLayout showBottomNav>
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Notifications */}
        <Card className="p-6 mb-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex items-center gap-2">
                Push notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email updates
              </Label>
              <Switch
                id="email"
                checked={settings.emailUpdates}
                onCheckedChange={(checked) => updateSettings({ emailUpdates: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6 mb-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="online" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Show online status
              </Label>
              <Switch
                id="online"
                checked={settings.showOnlineStatus}
                onCheckedChange={(checked) => updateSettings({ showOnlineStatus: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6 mb-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Appearance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Dark mode
              </Label>
              <Switch
                id="dark"
                checked={settings.darkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="p-6 border-destructive/20">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
