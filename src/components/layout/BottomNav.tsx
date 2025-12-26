import { Link, useLocation } from 'react-router-dom';
import { Heart, Plane, MessageCircle, User, Star } from 'lucide-react';

const navItems = [
  { path: '/swipe', label: 'Swipe', icon: Heart },
  { path: '/messages', label: 'Chat', icon: MessageCircle },
  { path: '/trips', label: 'Trips', icon: Plane },
  { path: '/points', label: 'Points', icon: Star },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
