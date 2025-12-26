import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, MapPin, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stories = [
  {
    id: 1,
    names: 'Hiro & Janik',
    connection: 'Connected October 2024',
    quote: "I was nervous about hosting my first traveler. But when Janik arrived from Bologna, it felt like reuniting with an old friend. We spent evenings making pasta in my Tokyo kitchen, mixing Italian tradition with Japanese ingredients. Now I'm planning my trip to visit him – he promised to show me his grandmother's secret tagliatelle recipe.",
    route: 'Tokyo → Bologna',
    rating: 5.0,
    photos: ['https://randomuser.me/api/portraits/men/1.jpg', 'https://randomuser.me/api/portraits/men/2.jpg'],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
    activity: 'Cooking together',
    location: 'Shimokitazawa, Tokyo',
    flags: ['🇯🇵', '🇮🇹'],
  },
  {
    id: 2,
    names: 'Priya & Sofia',
    connection: 'Connected August 2024',
    quote: "Sofia showed me hidden flamenco bars in Seville that I never would have found. We stayed up until 3am talking about life, love, and dreams. When she visited Mumbai last month, I took her to my favorite chai stalls. True friendship has no borders.",
    route: 'Mumbai → Seville',
    rating: 4.9,
    photos: ['https://randomuser.me/api/portraits/women/44.jpg', 'https://randomuser.me/api/portraits/women/68.jpg'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
    activity: 'Dancing together',
    location: 'Triana, Seville',
    flags: ['🇮🇳', '🇪🇸'],
  },
  {
    id: 3,
    names: 'Lucas & Min-jun',
    connection: 'Connected June 2024',
    quote: "I was solo traveling through Seoul when I matched with Min-jun. He took me on a midnight street food tour and taught me basic Korean phrases. Six months later, I hosted him in São Paulo and introduced him to Brazilian BBQ. We video chat every week now!",
    route: 'São Paulo → Seoul',
    rating: 5.0,
    photos: ['https://randomuser.me/api/portraits/men/32.jpg', 'https://randomuser.me/api/portraits/men/91.jpg'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop',
    activity: 'Street food tour',
    location: 'Myeongdong, Seoul',
    flags: ['🇧🇷', '🇰🇷'],
  },
  {
    id: 4,
    names: 'Emma & Yuki',
    connection: 'Connected December 2024',
    quote: "Yuki welcomed me into her home during cherry blossom season. We did morning yoga, visited temples, and she taught me the art of making matcha. It wasn't just a trip – it was a life-changing experience that taught me to slow down and appreciate every moment.",
    route: 'Melbourne → Kyoto',
    rating: 5.0,
    photos: ['https://randomuser.me/api/portraits/women/22.jpg', 'https://randomuser.me/api/portraits/women/79.jpg'],
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&h=600&fit=crop',
    activity: 'Tea ceremony',
    location: 'Higashiyama, Kyoto',
    flags: ['🇦🇺', '🇯🇵'],
  },
];

export const StorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % stories.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);

  const story = stories[currentIndex];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            Real Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            From strangers to lifelong friends
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl shadow-elevated p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex -space-x-4">
                      {story.photos.map((photo, i) => (
                        <img 
                          key={i}
                          src={photo}
                          alt=""
                          className="w-16 h-16 rounded-full border-4 border-card object-cover"
                        />
                      ))}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{story.names}</h3>
                      <p className="text-muted-foreground text-sm">{story.connection}</p>
                    </div>
                  </div>

                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
                    "{story.quote}"
                  </blockquote>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{story.route}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent" />
                      <span>{story.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative aspect-square rounded-2xl overflow-hidden">
                    <img 
                      src={story.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                      <p className="text-sm font-medium">{story.activity}</p>
                      <p className="text-xs opacity-80">{story.location}</p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -right-4 top-8 bg-card rounded-xl shadow-card p-3 border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{story.flags[0]}</span>
                      <span className="text-2xl">→</span>
                      <span className="text-2xl">{story.flags[1]}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -left-4 bottom-16 bg-card rounded-xl shadow-card p-3 border"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-lg">✨</span>
                      <span>{story.activity}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile nav + dots */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="ghost" size="icon" onClick={prev} className="md:hidden">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={next} className="md:hidden">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
