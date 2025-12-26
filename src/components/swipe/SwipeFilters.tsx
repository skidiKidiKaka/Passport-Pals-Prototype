import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Filter, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { INTERESTS, LANGUAGES } from "@/data/seedData";
import { useState } from "react";

const SwipeFilters = () => {
  const { filters, updateFilters, refreshSwipeStack } = useApp();
  const [open, setOpen] = useState(false);

  const toggleInterest = (interest: string) => {
    const current = filters.interests;
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    updateFilters({ interests: updated });
  };

  const toggleLanguage = (lang: string) => {
    const current = filters.languages;
    const updated = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    updateFilters({ languages: updated });
  };

  const clearFilters = () => {
    updateFilters({
      ageRange: { min: 18, max: 65 },
      languages: [],
      interests: [],
      hostingOnly: false,
      verifiedOnly: false,
      platonicOnly: false,
    });
  };

  const handleApply = () => {
    refreshSwipeStack();
    setOpen(false);
  };

  const activeCount = 
    (filters.ageRange.min !== 18 || filters.ageRange.max !== 65 ? 1 : 0) +
    filters.languages.length +
    filters.interests.length +
    (filters.hostingOnly ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.platonicOnly ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Age Range */}
          <div className="space-y-3">
            <Label>Age Range: {filters.ageRange.min} - {filters.ageRange.max}</Label>
            <Slider
              min={18}
              max={65}
              step={1}
              value={[filters.ageRange.min, filters.ageRange.max]}
              onValueChange={([min, max]) => updateFilters({ ageRange: { min, max } })}
              className="py-2"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hosting">Hosting available only</Label>
              <Switch
                id="hosting"
                checked={filters.hostingOnly}
                onCheckedChange={(checked) => updateFilters({ hostingOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="verified">Verified profiles only</Label>
              <Switch
                id="verified"
                checked={filters.verifiedOnly}
                onCheckedChange={(checked) => updateFilters({ verifiedOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="platonic">Platonic connections only</Label>
              <Switch
                id="platonic"
                checked={filters.platonicOnly}
                onCheckedChange={(checked) => updateFilters({ platonicOnly: checked })}
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>Languages</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.slice(0, 12).map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filters.languages.includes(lang)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.slice(0, 15).map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filters.interests.includes(interest)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Apply button */}
          <Button className="w-full" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SwipeFilters;
