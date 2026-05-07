import React from 'react';
import { ChevronDown } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
  expandable?: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  accent,
  onClick,
  expandable = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="h-[60px] rounded-lg border border-slate-200 bg-white px-4 text-left transition hover:border-blue-200 hover:shadow-sm"
  >
    <div className="flex h-full items-center gap-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-md text-white ${accent}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 truncate text-xs text-slate-400">{description}</div>
      </div>
      {expandable && <ChevronDown className="h-4 w-4 text-slate-300" />}
    </div>
  </button>
);

export default QuickActionCard;
