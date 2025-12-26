import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TravelStyleStepProps {
  data: {
    adventureLevel: number;
    socialLevel: number;
    planningStyle: number;
    budgetLevel: number;
  };
  onChange: (data: Partial<TravelStyleStepProps["data"]>) => void;
}

const sliderConfig = [
  {
    key: "adventureLevel" as const,
    label: "Adventure Level",
    leftEmoji: "🏖️",
    rightEmoji: "🧗",
    leftLabel: "Relaxed vibes",
    rightLabel: "Thrill seeker",
  },
  {
    key: "socialLevel" as const,
    label: "Social Energy",
    leftEmoji: "📚",
    rightEmoji: "🎉",
    leftLabel: "Quiet explorer",
    rightLabel: "Party animal",
  },
  {
    key: "planningStyle" as const,
    label: "Planning Style",
    leftEmoji: "🎲",
    rightEmoji: "📋",
    leftLabel: "Go with the flow",
    rightLabel: "Detailed planner",
  },
  {
    key: "budgetLevel" as const,
    label: "Travel Budget",
    leftEmoji: "🎒",
    rightEmoji: "💎",
    leftLabel: "Backpacker life",
    rightLabel: "Treat yourself",
  },
];

const TravelStyleStep = ({ data, onChange }: TravelStyleStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">What's your travel style? 🌍</h2>
        <p className="text-muted-foreground mt-2">Slide to show us your vibe</p>
      </div>

      <div className="space-y-8">
        {sliderConfig.map((slider) => (
          <div key={slider.key} className="space-y-4">
            <Label className="text-base font-semibold">{slider.label}</Label>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center w-16 text-center">
                <span className="text-2xl mb-1">{slider.leftEmoji}</span>
                <span className="text-xs text-muted-foreground">{slider.leftLabel}</span>
              </div>
              <Slider
                value={[data[slider.key]]}
                onValueChange={(value) => onChange({ [slider.key]: value[0] })}
                max={100}
                step={1}
                className="flex-1"
              />
              <div className="flex flex-col items-center w-16 text-center">
                <span className="text-2xl mb-1">{slider.rightEmoji}</span>
                <span className="text-xs text-muted-foreground">{slider.rightLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelStyleStep;
