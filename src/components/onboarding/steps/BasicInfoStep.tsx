import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoStepProps {
  data: {
    name: string;
    age: string;
    location: string;
    gender: string;
  };
  onChange: (data: Partial<BasicInfoStepProps["data"]>) => void;
  errors: Record<string, string>;
}

const BasicInfoStep = ({ data, onChange, errors }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Let's start with the basics ✨</h2>
        <p className="text-muted-foreground mt-2">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input
            id="name"
            placeholder="Your first name"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">How old are you?</Label>
          <Input
            id="age"
            type="number"
            placeholder="Your age"
            value={data.age}
            onChange={(e) => onChange({ age: e.target.value })}
            className={errors.age ? "border-destructive" : ""}
          />
          {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Where are you based?</Label>
          <Input
            id="location"
            placeholder="City, Country"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">How do you identify?</Label>
          <Select value={data.gender} onValueChange={(value) => onChange({ gender: value })}>
            <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
