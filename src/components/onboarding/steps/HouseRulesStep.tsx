import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface HouseRulesStepProps {
  data: {
    smokingOk: boolean | null;
    petsOk: boolean | null;
    kidsOk: boolean | null;
    preferredVibe: string;
  };
  onChange: (data: Partial<HouseRulesStepProps["data"]>) => void;
}

const yesNoOptions = [
  { value: true, label: "Yes", emoji: "✅" },
  { value: false, label: "No", emoji: "❌" },
  { value: null, label: "Flexible", emoji: "🤷" },
];

const vibeOptions = [
  { id: "quiet", label: "Quiet & Peaceful", emoji: "🧘", description: "Chill evenings, early nights" },
  { id: "social", label: "Social & Fun", emoji: "🎉", description: "Hangouts, dinners, maybe drinks" },
  { id: "balanced", label: "Best of Both", emoji: "⚖️", description: "Depends on the day" },
  { id: "independent", label: "Do Your Thing", emoji: "🚀", description: "Come and go as you please" },
];

const HouseRulesStep = ({ data, onChange }: HouseRulesStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">House vibes check 🏠</h2>
        <p className="text-muted-foreground mt-2">So everyone knows what to expect</p>
      </div>

      <div className="space-y-6">
        {[
          { key: "smokingOk" as const, label: "Smoking okay?", emoji: "🚬" },
          { key: "petsOk" as const, label: "Pet-friendly?", emoji: "🐕" },
          { key: "kidsOk" as const, label: "Kids welcome?", emoji: "👶" },
        ].map((rule) => (
          <div key={rule.key} className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <span>{rule.emoji}</span>
              {rule.label}
            </Label>
            <div className="flex gap-2">
              {yesNoOptions.map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => onChange({ [rule.key]: option.value })}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    data[rule.key] === option.value
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <span>{option.emoji}</span>
                  <span className="font-medium text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <Label className="text-base font-semibold">What's the vibe at your place?</Label>
          <div className="grid grid-cols-2 gap-3">
            {vibeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onChange({ preferredVibe: option.id })}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
                  "hover:scale-[1.02] active:scale-[0.98]",
                  data.preferredVibe === option.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <span className="text-2xl mb-1">{option.emoji}</span>
                <span className="font-medium text-sm">{option.label}</span>
                <span className="text-xs text-muted-foreground text-center">{option.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseRulesStep;
