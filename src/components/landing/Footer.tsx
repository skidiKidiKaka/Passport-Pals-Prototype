import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo size="md" />
              <span className="font-bold text-xl">Passport Pals</span>
            </div>
            <p className="text-background/70 max-w-md mb-6">
              A cultural exchange platform where travelers stay with hosts who are present. 
              Real connections, not just accommodations.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-background/70">
              <li><Link to="/swipe" className="hover:text-background transition-colors">Find Pals</Link></li>
              <li><Link to="/matches" className="hover:text-background transition-colors">Matches</Link></li>
              <li><Link to="/trips" className="hover:text-background transition-colors">Trips</Link></li>
              <li><Link to="/points" className="hover:text-background transition-colors">Host Points</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-background/70">
              <li><Link to="/portfolio" className="hover:text-background transition-colors">Portfolio</Link></li>
              <li><a href="#" className="hover:text-background transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © 2024 Passport Pals. This is a portfolio prototype.
            </p>
            <div className="flex gap-6 text-sm text-background/50">
              <a href="#" className="hover:text-background transition-colors">Privacy</a>
              <a href="#" className="hover:text-background transition-colors">Terms</a>
              <a href="#" className="hover:text-background transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};