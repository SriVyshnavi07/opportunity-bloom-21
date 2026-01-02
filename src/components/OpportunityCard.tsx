import { Calendar, MapPin, Bookmark, BookmarkCheck, ExternalLink, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface OpportunityCardProps {
  id: string;
  title: string;
  organization: string;
  type: 'internship' | 'competition' | 'scholarship' | 'program';
  location?: string | null;
  deadline?: string | null;
  stipend?: string | null;
  description: string;
  applyLink?: string | null;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
  showActions?: boolean;
}

const typeLabels: Record<string, string> = {
  internship: 'Internship',
  competition: 'Competition',
  scholarship: 'Scholarship',
  program: 'Program',
};

const typeBadgeClasses: Record<string, string> = {
  internship: 'badge-internship',
  competition: 'badge-competition',
  scholarship: 'badge-scholarship',
  program: 'badge-program',
};

export function OpportunityCard({
  id,
  title,
  organization,
  type,
  location,
  deadline,
  stipend,
  description,
  applyLink,
  isSaved = false,
  onSave,
  onUnsave,
  showActions = true,
}: OpportunityCardProps) {
  const handleSaveClick = () => {
    if (isSaved && onUnsave) {
      onUnsave(id);
    } else if (!isSaved && onSave) {
      onSave(id);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border card-hover p-6 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <Badge className={`${typeBadgeClasses[type]} mb-3 font-medium`}>
            {typeLabels[type]}
          </Badge>
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-primary font-semibold">{organization}</p>
        </div>
        {showActions && (
          <button
            onClick={handleSaveClick}
            className="p-2 rounded-full hover:bg-secondary transition-colors flex-shrink-0"
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
        {description}
      </p>

      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        )}
        {deadline && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(deadline), 'MMM d, yyyy')}</span>
          </div>
        )}
        {stipend && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span>{stipend}</span>
          </div>
        )}
      </div>

      {applyLink && (
        <Button variant="outline" className="w-full mt-auto" asChild>
          <a href={applyLink} target="_blank" rel="noopener noreferrer">
            Apply Now
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
      )}
    </div>
  );
}
