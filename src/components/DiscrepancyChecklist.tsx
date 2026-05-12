import React, { useState } from 'react';
import { CircleCheck, Circle } from 'lucide-react';

export const CONSUMABLE_ITEMS = [
  "Handle with Care Sticker",
  "Different Quantity and Kit Sticker",
  "Clear Tape",
  "Brown Tape",
  "Latex Gloves",
  "Cotton Gloves",
  "Cardboard 4\" X 7\"",
  "Cardboard 6\" X 6\"",
  "Cardboard 6\" X 9\"",
  "Cardboard 9\" X 12\"",
  "Cardboard 10\" X 10.5\"",
  "Shrink Wrap",
  "Coating Oil",
  "Thermal Ribbon",
  "Picking Label",
  "Material Label",
  "CTN142",
  "CTN132",
  "CTN182",
  "Rubbish Bag",
  "CT100",
  "CT45",
  "CT95",
  "CT130",
  "VCI Plastic 4\" X 7\"",
  "VCI Plastic 6\" X 9\"",
  "VCI Plastic 8\" X 12\"",
  "VCI Plastic 9\" X 18\"",
  "VCI Plastic 12\" X 16\"",
  "VCI Plastic 14\" X 28\"",
  "VCI Plastic 25\" X 22\"",
  "Clear Plastic 4\" X 7\"",
  "Clear Plastic 6\" X 6\"",
  "Clear Plastic 6\" X 9\"",
  "Clear Plastic 9\" X 14\"",
  "Clear Plastic 10\" X 12\"",
  "Clear Plastic 13.5\" X 16\"",
  "Clear Plastic 16\" X 24\"",
  "Long Clear Plastic",
  "Long VCI Plastic",
  "CT360",
  "CT390",
  "CT240",
  "CT250"
];

interface DiscrepancyChecklistProps {
  selectedItems: string[];
  onChange: (items: string[]) => void;
}

const ChecklistCategory: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-bold text-brand-orange/80 uppercase tracking-widest border-b border-border-dim pb-1">
      {title}
    </h3>
    <div className="space-y-2.5">
      {children}
    </div>
  </div>
);

const DiscrepancyChecklist: React.FC<DiscrepancyChecklistProps> = ({ selectedItems, onChange }) => {
  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      onChange(selectedItems.filter((i) => i !== item));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  const renderItem = (item: string) => {
    const isSelected = selectedItems.includes(item);
    return (
      <label key={item} className="flex items-center group cursor-pointer">
        <input 
          type="checkbox" 
          className="peer hidden" 
          checked={isSelected}
          onChange={() => toggleItem(item)}
        />
        <div className="w-4 h-4 border border-border-bright peer-checked:bg-brand-orange peer-checked:border-brand-orange mr-3 flex items-center justify-center transition-all group-hover:border-brand-orange/50">
          {isSelected && <div className="w-2 h-2 bg-black"></div>}
        </div>
        <span className={`text-xs transition-colors ${isSelected ? 'text-white font-medium' : 'text-text-main group-hover:text-white'}`}>
          {item}
        </span>
      </label>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 overflow-y-auto pr-4 custom-scrollbar h-full">
      <ChecklistCategory title="Adhesives & Tape">
        {CONSUMABLE_ITEMS.slice(2, 4).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(17, 18).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(15, 16).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(0, 2).map(renderItem)}
      </ChecklistCategory>

      <ChecklistCategory title="Protection & Labels">
        {CONSUMABLE_ITEMS.slice(4, 6).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(12, 13).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(18, 20).map(renderItem)}
      </ChecklistCategory>

      <ChecklistCategory title="Cartons & Boxes">
        {CONSUMABLE_ITEMS.slice(20, 23).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(24, 28).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(6, 11).map(renderItem)}
      </ChecklistCategory>

      <ChecklistCategory title="Plastics (VCI/Clear)">
        {CONSUMABLE_ITEMS.slice(28, 35).map(renderItem)}
        {CONSUMABLE_ITEMS.slice(35, 44).map(renderItem)}
      </ChecklistCategory>

      <ChecklistCategory title="C-Series">
        {CONSUMABLE_ITEMS.slice(44).map(renderItem)}
      </ChecklistCategory>
    </div>
  );
};

export default DiscrepancyChecklist;
