import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OpportunityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  onClearFilters: () => void;
}

const opportunityTypes = [
  { value: 'internship', label: 'Internships', className: 'badge-internship' },
  { value: 'competition', label: 'Competitions', className: 'badge-competition' },
  { value: 'scholarship', label: 'Scholarships', className: 'badge-scholarship' },
  { value: 'program', label: 'Programs', className: 'badge-program' },
];

export function OpportunityFilters({
  searchQuery,
  onSearchChange,
  selectedTypes,
  onTypeToggle,
  onClearFilters,
}: OpportunityFiltersProps) {
  const hasActiveFilters = searchQuery || selectedTypes.length > 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {opportunityTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeToggle(type.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedTypes.includes(type.value)
                ? `${type.className} ring-2 ring-offset-2 ring-primary/50`
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {type.label}
          </button>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-2">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
