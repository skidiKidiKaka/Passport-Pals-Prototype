import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Users, 
  Heart, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

const concepts = [
  {
    icon: ArrowLeftRight,
    title: 'Host & Get Hosted',
    description: 'Open your home to travelers — and experience the world by staying with locals who host you back. It\'s a two-way street.',
    color: 'bg-primary/10 text-primary',
    accent: 'group-hover:bg-primary/20',
  },
  {
    icon: Users,
    title: 'Travel Through People',
    description: 'Skip hotels and tour buses. Explore a country through a real person who lives there — their favorite spots, their daily life, their culture.',
    color: 'bg-secondary/10 text-secondary',
    accent: 'group-hover:bg-secondary/20',
  },
  {
    icon: Heart,
    title: 'Matched Like Friends',
    description: 'We match you based on interests, personality, language, and travel style — like a dating app, but for finding travel companions and hosts.',
    color: 'bg-accent/10 text-accent-foreground',
    accent: 'group-hover:bg-accent/20',
  },
  {
    icon: GraduationCap,
    title: 'A Modern Cultural Exchange',
    description: 'Think Student Exchange, Couchsurfing, Tinder — reimagined for adults, adventurers, remote workers, and curious minds who want real connection.',
    color: 'bg-primary/10 text-primary',
    accent: 'group-hover:bg-primary/20',
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        {/* Transition statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xl md:text-2xl font-medium text-muted-foreground italic">
            "This isn't tourism. It's connection."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            The Philosophy
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Passport Pals Is Really About
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Not another booking platform. A community built on mutual exchange, 
            authentic connection, and the belief that the best way to see the world is through its people.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 rounded-xl ${concept.color} ${concept.accent} flex items-center justify-center mb-6 transition-colors`}>
                <concept.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{concept.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{concept.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
