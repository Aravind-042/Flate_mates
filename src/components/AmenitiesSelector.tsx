
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Wifi, Car, Dumbbell, Swimming, TreePine, ShieldCheck, Utensils, Waves } from "lucide-react";

interface AmenitiesSelectorProps {
  selected: string[];
  onChange: (amenities: string[]) => void;
}

export const AmenitiesSelector = ({ selected, onChange }: AmenitiesSelectorProps) => {
  const amenitiesList = [
    { id: 'wifi', label: 'High Speed Internet', icon: Wifi },
    { id: 'parking', label: 'Parking Space', icon: Car },
    { id: 'gym', label: 'Gym/Fitness Center', icon: Dumbbell },
    { id: 'swimming', label: 'Swimming Pool', icon: Swimming },
    { id: 'garden', label: 'Garden/Balcony', icon: TreePine },
    { id: 'security', label: '24/7 Security', icon: ShieldCheck },
    { id: 'kitchen', label: 'Modular Kitchen', icon: Utensils },
    { id: 'laundry', label: 'Laundry Facility', icon: Waves },
    { id: 'ac', label: 'Air Conditioning', icon: null },
    { id: 'tv', label: 'Cable TV', icon: null },
    { id: 'fridge', label: 'Refrigerator', icon: null },
    { id: 'washing-machine', label: 'Washing Machine', icon: null },
    { id: 'geyser', label: 'Water Heater', icon: null },
    { id: 'power-backup', label: 'Power Backup', icon: null },
    { id: 'furnished', label: 'Fully Furnished', icon: null },
    { id: 'elevator', label: 'Elevator', icon: null },
  ];

  const handleToggle = (amenityId: string) => {
    const newSelected = selected.includes(amenityId)
      ? selected.filter(id => id !== amenityId)
      : [...selected, amenityId];
    onChange(newSelected);
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Select Available Amenities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenitiesList.map((amenity) => {
          const IconComponent = amenity.icon;
          return (
            <div key={amenity.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
              <Checkbox
                id={amenity.id}
                checked={selected.includes(amenity.id)}
                onCheckedChange={() => handleToggle(amenity.id)}
              />
              {IconComponent && <IconComponent className="h-4 w-4 text-gray-500" />}
              <Label htmlFor={amenity.id} className="cursor-pointer flex-1">
                {amenity.label}
              </Label>
            </div>
          );
        })}
      </div>
      
      {selected.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Selected {selected.length} amenit{selected.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
      )}
    </div>
  );
};
