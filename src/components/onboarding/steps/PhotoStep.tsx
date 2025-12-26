import { Button } from "@/components/ui/button";
import { User, Smile, Shuffle } from "lucide-react";
import { useState } from "react";

interface PhotoStepProps {
  data: {
    photo: string;
    photoType: 'avatar' | 'emoji' | 'random';
  };
  onChange: (data: Partial<PhotoStepProps["data"]>) => void;
}

const RANDOM_AVATARS = [
  'https://randomuser.me/api/portraits/lego/1.jpg',
  'https://randomuser.me/api/portraits/lego/2.jpg',
  'https://randomuser.me/api/portraits/lego/3.jpg',
  'https://randomuser.me/api/portraits/lego/4.jpg',
  'https://randomuser.me/api/portraits/lego/5.jpg',
  'https://randomuser.me/api/portraits/lego/6.jpg',
];

const EMOJI_AVATARS = [
  { emoji: '😊', bg: 'bg-yellow-100' },
  { emoji: '🌟', bg: 'bg-purple-100' },
  { emoji: '🌍', bg: 'bg-blue-100' },
  { emoji: '🎒', bg: 'bg-green-100' },
  { emoji: '✈️', bg: 'bg-sky-100' },
  { emoji: '🏔️', bg: 'bg-orange-100' },
  { emoji: '🌺', bg: 'bg-pink-100' },
  { emoji: '🦋', bg: 'bg-cyan-100' },
];

const PhotoStep = ({ data, onChange }: PhotoStepProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);

  const handleRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_AVATARS.length);
    onChange({ 
      photo: RANDOM_AVATARS[randomIndex], 
      photoType: 'random' 
    });
  };

  const handleEmojiSelect = (index: number) => {
    setSelectedEmoji(index);
    onChange({ 
      photo: `emoji:${EMOJI_AVATARS[index].emoji}:${EMOJI_AVATARS[index].bg}`, 
      photoType: 'emoji' 
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Compress the image to avoid localStorage quota issues
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        // Resize to max 200x200 for profile photos
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onChange({ 
          photo: compressedDataUrl, 
          photoType: 'avatar' 
        });
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const renderPreview = () => {
    if (!data.photo) {
      return (
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
          <User className="w-16 h-16 text-muted-foreground" />
        </div>
      );
    }

    if (data.photo.startsWith('emoji:')) {
      const [, emoji, bg] = data.photo.split(':');
      return (
        <div className={`w-32 h-32 rounded-full ${bg} flex items-center justify-center text-5xl`}>
          {emoji}
        </div>
      );
    }

    return (
      <img 
        src={data.photo} 
        alt="Profile" 
        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Add a profile picture 📸</h2>
        <p className="text-muted-foreground mt-2">Show the world who you are</p>
      </div>

      {/* Preview */}
      <div className="flex justify-center mb-8">
        {renderPreview()}
      </div>

      {/* Options */}
      <div className="space-y-6">
        {/* Upload photo */}
        <div className="space-y-2">
          <label 
            htmlFor="photo-upload" 
            className="flex items-center justify-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <User className="w-5 h-5 text-primary" />
            <span className="font-medium">Upload a photo</span>
          </label>
          <input 
            id="photo-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Random avatar */}
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={handleRandomAvatar}
        >
          <Shuffle className="w-4 h-4" />
          Use a random avatar
        </Button>

        {/* Emoji selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Smile className="w-4 h-4" />
            Or pick an emoji
          </p>
          <div className="grid grid-cols-4 gap-3">
            {EMOJI_AVATARS.map((item, index) => (
              <button
                key={index}
                onClick={() => handleEmojiSelect(index)}
                className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center text-2xl hover:scale-110 transition-transform ${
                  selectedEmoji === index ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoStep;
