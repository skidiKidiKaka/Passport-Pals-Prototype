import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Globe, Heart, Award, Code, Rocket, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/landing/Footer';

const PortfolioPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            Portfolio Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Passport Pals</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A full-stack prototype for a cultural exchange platform where travelers stay with present hosts.
          </p>
        </motion.div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-destructive" />
              The Problem
            </h2>
            <p className="text-muted-foreground">
              Existing platforms like Airbnb focus on empty apartments. Couchsurfing lacks modern UX. 
              There's no platform that combines Tinder-style matching with meaningful cultural exchange 
              where hosts are present.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              The Solution
            </h2>
            <p className="text-muted-foreground">
              Passport Pals matches travelers with hosts based on personality, interests, and language. 
              Hosts must be present, creating genuine cultural exchanges. A points system incentivizes hosting.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Swipe Matching', desc: 'Tinder-style UI with compatibility scores' },
              { icon: Award, title: 'Host Points', desc: 'Gamified rewards for hosting travelers' },
              { icon: Globe, title: 'Auto-Translation', desc: 'Chat in any language seamlessly' },
            ].map((f, i) => (
              <div key={i} className="bg-muted rounded-xl p-6 text-center">
                <f.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-card rounded-2xl p-8 shadow-card mb-16">
          <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Router', 'Context API'].map(tech => (
              <span key={tech} className="px-4 py-2 rounded-full bg-muted text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="xl" onClick={() => navigate('/')}>
            Explore the Demo
          </Button>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
};

export default PortfolioPage;