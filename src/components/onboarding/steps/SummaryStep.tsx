import { Badge } from "@/components/ui/badge";

interface SummaryStepProps {
  data: {
    name: string;
    age: string;
    location: string;
    interests: string[];
    hostingStatus: string;
    adventureLevel: number;
    socialLevel: number;
  };
}

const interestLabels: Record<string, string> = {
  photography: "📸 Photography",
  hiking: "🥾 Hiking",
  food: "🍳 Food & Cooking",
  music: "🎵 Music",
  art: "🎨 Art & Museums",
  nightlife: "🌙 Nightlife",
  history: "🏛️ History",
  nature: "🌿 Nature",
  sports: "⚽ Sports",
  yoga: "🧘 Yoga & Wellness",
  tech: "💻 Tech & Startups",
  languages: "🗣️ Languages",
  volunteering: "🤝 Volunteering",
  surfing: "🏄 Surfing",
  reading: "📖 Reading",
  gaming: "🎮 Gaming",
};

const hostingLabels: Record<string, string> = {
  definitely: "🏠 Ready to host",
  maybe: "🤔 Sometimes hosting",
  traveling: "✈️ Just traveling",
  both: "🔄 Host & travel",
};

const SummaryStep = ({ data }: SummaryStepProps) => {
  const getTravelerType = () => {
    const adventure = data.adventureLevel;
    const social = data.socialLevel;

    if (adventure > 70 && social > 70) return "The Life of the Party 🎉";
    if (adventure > 70 && social <= 30) return "The Solo Adventurer 🧗";
    if (adventure <= 30 && social > 70) return "The Social Butterfly 🦋";
    if (adventure <= 30 && social <= 30) return "The Zen Explorer 🧘";
    if (adventure > 50) return "The Thrill Seeker ⚡";
    if (social > 50) return "The Connector 🤝";
    return "The Balanced Traveler ⚖️";
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">You're all set, {data.name}! 🎉</h2>
        <p className="text-muted-foreground mt-2">Here's your traveler profile</p>
      </div>

      <div className="bg-gradient-hero p-1 rounded-2xl">
        <div className="bg-card rounded-xl p-6 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">
                {data.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-bold">{data.name}, {data.age}</h3>
            <p className="text-muted-foreground">📍 {data.location}</p>
          </div>

          <div className="text-center py-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Your traveler type</p>
            <p className="text-xl font-bold text-primary">{getTravelerType()}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Your interests</p>
            <div className="flex flex-wrap gap-2">
              {data.interests.slice(0, 6).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interestLabels[interest] || interest}
                </Badge>
              ))}
              {data.interests.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{data.interests.length - 6} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Hosting status</span>
            <span className="font-medium">{hostingLabels[data.hostingStatus] || data.hostingStatus}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Ready to find your perfect travel buddies and hosts? 🌍
      </p>
    </div>
  );
};

export default SummaryStep;
