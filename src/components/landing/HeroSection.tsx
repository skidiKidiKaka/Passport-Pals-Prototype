import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Users, Heart, GraduationCap, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

// World cities with flags and positions
const worldStamps = [
  { city: 'Tokyo', flag: '🇯🇵', top: '15%', left: '85%', rotate: -12, delay: 0, size: 'lg' },
  { city: 'Rome', flag: '🇮🇹', top: '70%', left: '8%', rotate: 8, delay: 0.2, size: 'md' },
  { city: 'Paris', flag: '🇫🇷', top: '25%', left: '12%', rotate: -5, delay: 0.4, size: 'lg' },
  { city: 'Seoul', flag: '🇰🇷', top: '35%', left: '92%', rotate: 15, delay: 0.6, size: 'sm' },
  { city: 'Mumbai', flag: '🇮🇳', top: '55%', left: '78%', rotate: -8, delay: 0.8, size: 'md' },
  { city: 'NYC', flag: '🇺🇸', top: '20%', left: '25%', rotate: 10, delay: 1, size: 'md' },
  { city: 'Barcelona', flag: '🇪🇸', top: '45%', left: '5%', rotate: -15, delay: 1.2, size: 'sm' },
  { city: 'Kyoto', flag: '🇯🇵', top: '75%', left: '88%', rotate: 5, delay: 1.4, size: 'sm' },
  { city: 'Lisbon', flag: '🇵🇹', top: '60%', left: '18%', rotate: -10, delay: 1.6, size: 'md' },
  { city: 'Sydney', flag: '🇦🇺', top: '80%', left: '70%', rotate: 12, delay: 1.8, size: 'sm' },
  { city: 'Berlin', flag: '🇩🇪', top: '30%', left: '70%', rotate: -7, delay: 2, size: 'sm' },
  { city: 'Cape Town', flag: '🇿🇦', top: '85%', left: '35%', rotate: 8, delay: 2.2, size: 'sm' },
];

const getStampSize = (size: string) => {
  switch (size) {
    case 'lg': return { stamp: 'w-28 h-28', text: 'text-sm', border: 'border-[3px]' };
    case 'md': return { stamp: 'w-22 h-22', text: 'text-xs', border: 'border-2' };
    default: return { stamp: 'w-18 h-18', text: 'text-[10px]', border: 'border-2' };
  }
};

// Philosophy pillars for hero
const pillars = [
  { 
    icon: Home, 
    label: 'Host & Get Hosted', 
    desc: 'Open your home, explore theirs' 
  },
  { 
    icon: Users, 
    label: 'Travel Through People', 
    desc: 'Skip hotels, meet locals' 
  },
  { 
    icon: Heart, 
    label: 'Matched Like Friends', 
    desc: 'By interests & personality' 
  },
  { 
    icon: GraduationCap, 
    label: 'Modern Exchange', 
    desc: 'Student Exchange, Couchsurfing, Tinder, reimagined' 
  },
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useApp();

  const handleTryDemo = () => {
    loginAsDemo();
    navigate('/swipe');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-warm" />
      
      {/* Decorative blur orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-secondary/20 blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Floating world stamps */}
      {worldStamps.map((stamp, i) => {
        const sizes = getStampSize(stamp.size);
        return (
          <motion.div
            key={stamp.city}
            className="absolute pointer-events-none animate-drift-slow"
            style={{ 
              top: stamp.top, 
              left: stamp.left,
              '--rotate': `${stamp.rotate}deg`,
              '--opacity-start': stamp.size === 'lg' ? '0.2' : '0.12',
              '--opacity-end': stamp.size === 'lg' ? '0.3' : '0.2',
              animationDelay: `${i * 0.5}s`,
            } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: stamp.rotate }}
            transition={{ delay: stamp.delay, duration: 0.6 }}
          >
            <div className={`${sizes.stamp} ${sizes.border} border-primary/40 rounded-full flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm`}>
              <span className="text-lg mb-0.5">{stamp.flag}</span>
              <span className={`${sizes.text} font-bold text-primary/70 tracking-wide`}>{stamp.city}</span>
              <span className={`${sizes.text} text-muted-foreground/60`}>2024</span>
            </div>
          </motion.div>
        );
      })}

      {/* Subtle static path lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }}>
        <path
          d="M100,200 Q300,100 500,250 T900,200"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <path
          d="M800,500 Q600,350 400,450 T100,400"
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
      </svg>

      {/* Moving planes along paths */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-plane-path-1 text-primary/40">
          <Plane className="w-5 h-5" />
        </div>
        <div className="animate-plane-path-2 text-secondary/40">
          <Plane className="w-4 h-4" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Home className="w-4 h-4" />
            Host. Travel. Connect.
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            Travel through people,
            <br />
            <span className="text-gradient">not places.</span>
          </motion.h1>


          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Real cultural exchange, not check-ins. Because the best trips aren't about rooms, they're about people.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleTryDemo}
              className="group"
            >
              <span>Try Demo</span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              onClick={() => navigate('/onboarding')}
            >
              Create Profile
            </Button>
          </motion.div>

          {/* Philosophy pillars */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center p-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{pillar.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{pillar.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};
