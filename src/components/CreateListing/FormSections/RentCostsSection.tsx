
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { FormSectionProps } from "./types";

export const RentCostsSection = ({ data, onChange }: FormSectionProps) => {
  const rentIncludesOptions = ['Electricity', 'Water', 'Internet', 'Maintenance', 'Gas'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rent">Monthly Rent (₹)</Label>
          <Input
            id="rent"
            type="number"
            placeholder="25000"
            value={data.rent.amount}
            onChange={(e) => onChange('rent.amount', parseInt(e.target.value) || 0)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="deposit">Security Deposit (₹)</Label>
          <Input
            id="deposit"
            type="number"
            placeholder="50000"
            value={data.rent.deposit}
            onChange={(e) => onChange('rent.deposit', parseInt(e.target.value) || 0)}
            className="mt-2"
          />
        </div>
      </div>
      <div>
        <Label>Rent Includes</Label>
        <div className="mt-2 space-y-2">
          {rentIncludesOptions.map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={data.rent.includes.includes(item)}
                onCheckedChange={(checked) => {
                  const newIncludes = checked 
                    ? [...data.rent.includes, item]
                    : data.rent.includes.filter(i => i !== item);
                  onChange('rent.includes', newIncludes);
                }}
              />
              <Label htmlFor={item}>{item}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
