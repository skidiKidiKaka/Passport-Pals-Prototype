import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Users, Tag, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

const PURPOSE_TAGS = [
  'Cultural Exchange',
  'Food Tour',
  'Language Practice',
  'Sightseeing',
  'Work/Study',
  'Adventure',
  'Relaxation',
  'Local Life',
];

interface TripRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
  hostCity: string;
  onSubmit: (data: {
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    notes: string;
    purposeTags: string[];
  }) => void;
}

export const TripRequestModal = ({
  open,
  onOpenChange,
  hostName,
  hostCity,
  onSubmit,
}: TripRequestModalProps) => {
  const [startDate, setStartDate] = useState<Date>(addDays(new Date(), 14));
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 21));
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      startDate,
      endDate,
      guestsCount,
      notes,
      purposeTags: selectedTags,
    });
    onOpenChange(false);
    // Reset form
    setNotes('');
    setSelectedTags([]);
  };

  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <span>🏠</span> Request a Stay
          </DrawerTitle>
          <DrawerDescription>
            Send a hosting request to {hostName} in {hostCity}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-5 overflow-y-auto">
          {/* Date Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">When do you want to visit?</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(startDate, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <span className="self-center text-muted-foreground">→</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(endDate, 'MMM d')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => date <= startDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-xs text-muted-foreground">{nights} night{nights !== 1 ? 's' : ''}</p>
          </div>

          {/* Guest Count */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" /> How many guests?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(num => (
                <Button
                  key={num}
                  variant={guestsCount === num ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGuestsCount(num)}
                  className="flex-1"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Purpose Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" /> What's your trip about?
            </label>
            <div className="flex flex-wrap gap-2">
              {PURPOSE_TAGS.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    selectedTags.includes(tag) && 'bg-primary'
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Personal Note */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Personal note to {hostName}</label>
            <Textarea
              placeholder={`Hi ${hostName}! I'd love to stay with you because...`}
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 300))}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/300</p>
          </div>

          {/* Points Preview */}
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated points for this stay:</span>
              <span className="font-semibold text-primary">{nights * 10} pts</span>
            </div>
          </div>
        </div>

        <DrawerFooter className="pt-2">
          <Button onClick={handleSubmit} className="w-full gap-2">
            <Send className="w-4 h-4" /> Send Request
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
