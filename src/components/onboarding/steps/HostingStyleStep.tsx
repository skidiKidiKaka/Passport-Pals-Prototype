import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface HostingStyleStepProps {
  data: {
    hostingStatus: string;
    maxGuests: number;
    preferredStayLength: string;
  };
  onChange: (data: Partial<HostingStyleStepProps["data"]>) => void;
}

const hostingOptions = [
  { id: "definitely", label: "Yes, I love hosting!", emoji: "🏠", description: "My door is open" },
  { id: "maybe", label: "Maybe sometimes", emoji: "🤔", description: "Depends on my schedule" },
  { id: "traveling", label: "Just traveling now", emoji: "✈️", description: "Not hosting currently" },
  { id: "both", label: "Both!", emoji: "🔄", description: "Host and travel equally" },
];

const stayLengthOptions = [
  { id: "1-3", label: "1-3 nights", emoji: "🌙" },
  { id: "4-7", label: "4-7 nights", emoji: "📅" },
  { id: "1-2weeks", label: "1-2 weeks", emoji: "🗓️" },
  { id: "flexible", label: "Flexible", emoji: "🤙" },
];

const HostingStyleStep = ({ data, onChange }: HostingStyleStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Are you up for hosting? 🏡</h2>
        <p className="text-muted-foreground mt-2">Help us match you with the right people</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Your hosting style</Label>
          <div className="grid grid-cols-2 gap-3">
            {hostingOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ hostingStatus: option.id })}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  data.hostingStatus === option.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <span className="text-3xl mb-2">{option.emoji}</span>
                <span className="font-medium text-sm">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        {(data.hostingStatus === "definitely" || data.hostingStatus === "maybe" || data.hostingStatus === "both") && (
          <>
            <div className="space-y-4">
              <Label className="text-base font-semibold">How many guests can you host?</Label>
              <div className="flex items-center gap-4">
                <span className="text-2xl">👤</span>
                <Slider
                  value={[data.maxGuests]}
                  onValueChange={(value) => onChange({ maxGuests: value[0] })}
                  min={1}
                  max={6}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xl font-bold text-primary w-8 text-center">{data.maxGuests}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Preferred stay length</Label>
              <div className="grid grid-cols-2 gap-3">
                {stayLengthOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange({ preferredStayLength: option.id })}
                    className={cn(
                      "flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      data.preferredStayLength === option.id
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HostingStyleStep;
