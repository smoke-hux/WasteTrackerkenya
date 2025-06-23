import { Checkbox } from '@/components/ui/checkbox';
import { WASTE_TYPES, type WasteTypeOption } from '@/lib/types';
import { Leaf, Wine, Newspaper, Cog, WineOff, Computer } from 'lucide-react';

interface WasteTypeSelectorProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
}

const iconMap = {
  leaf: Leaf,
  'wine-bottle': Wine,
  newspaper: Newspaper,
  cog: Cog,
  'wine-glass': WineOff,
  computer: Computer,
};

export default function WasteTypeSelector({ selectedTypes, onTypesChange }: WasteTypeSelectorProps) {
  const handleTypeToggle = (typeId: string) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter(id => id !== typeId));
    } else {
      onTypesChange([...selectedTypes, typeId]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {WASTE_TYPES.map((type) => {
        const Icon = iconMap[type.icon as keyof typeof iconMap] || Leaf;
        const isSelected = selectedTypes.includes(type.id);
        
        return (
          <label 
            key={type.id}
            className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${
              isSelected 
                ? 'border-eco-green bg-eco-green bg-opacity-10' 
                : 'border-gray-200 hover:border-eco-green'
            }`}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleTypeToggle(type.id)}
              className="mr-3"
            />
            <div className="flex items-center">
              <Icon className={`w-4 h-4 mr-2 ${type.color}`} />
              <span className="text-sm">{type.label}</span>
            </div>
          </label>
        );
      })}
    </div>
  );
}
