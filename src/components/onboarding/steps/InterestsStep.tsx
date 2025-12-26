import { cn } from "@/lib/utils";

interface InterestsStepProps {
  data: {
    interests: string[];
  };
  onChange: (data: { interests: string[] }) => void;
}

const interestOptions = [
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "hiking", label: "Hiking", emoji: "🥾" },
  { id: "food", label: "Food & Cooking", emoji: "🍳" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "art", label: "Art & Museums", emoji: "🎨" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "history", label: "History", emoji: "🏛️" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "yoga", label: "Yoga & Wellness", emoji: "🧘" },
  { id: "tech", label: "Tech & Startups", emoji: "💻" },
  { id: "languages", label: "Languages", emoji: "🗣️" },
  { id: "volunteering", label: "Volunteering", emoji: "🤝" },
  { id: "surfing", label: "Surfing", emoji: "🏄" },
  { id: "reading", label: "Reading", emoji: "📖" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
];

const InterestsStep = ({ data, onChange }: InterestsStepProps) => {
  const toggleInterest = (id: string) => {
    const newInterests = data.interests.includes(id)
      ? data.interests.filter((i) => i !== id)
      : [...data.interests, id];
    onChange({ interests: newInterests });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">What are you into? 🎯</h2>
        <p className="text-muted-foreground mt-2">Pick at least 3 interests to find like-minded travelers</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {interestOptions.map((interest) => (
          <button
            key={interest.id}
            type="button"
            onClick={() => toggleInterest(interest.id)}
            className={cn(
              "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
              "hover:scale-[1.02] active:scale-[0.98]",
              data.interests.includes(interest.id)
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <span className="text-xl">{interest.emoji}</span>
            <span className="text-sm font-medium">{interest.label}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {data.interests.length} selected {data.interests.length < 3 && "(pick at least 3)"}
      </p>
    </div>
  );
};

export default InterestsStep;
