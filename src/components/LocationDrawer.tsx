import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import type { Location } from '@/data/locations';

const toHashtag = (cap: string) => '#' + cap.toLowerCase().replace(/[^a-z0-9]/g, '');

interface Props {
  location: Location | null;
  open: boolean;
  onClose: () => void;
  onTagClick: (cap: string) => void;
  selectedCaps: Set<string>;
}

export default function LocationDrawer({ location, open, onClose, onTagClick, selectedCaps }: Props) {
  if (!location) return null;
  const isLib = location.type === 'Library';
  const colorVar = isLib ? '--lib-color' : '--make-color';

  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      {/* hideCloseButton via className trick — we render our own */}
      <SheetContent side="right" className="w-full sm:w-[440px] p-0 flex flex-col overflow-hidden [&>button]:hidden">
        {/* Color stripe + header */}
        <div className="flex-shrink-0" style={{ background: `hsl(var(${colorVar}))` }}>
          <div className="h-1" />
          <div className="bg-background px-6 pt-4 pb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `hsl(var(${colorVar}))` }}>
                {location.type}
              </span>
              <h2 className="text-lg font-bold text-foreground leading-tight mt-0.5 truncate">{location.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 mt-1 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Tags */}
          {(location.capabilities?.length ?? 0) > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Equipment</p>
              <div className="flex flex-wrap gap-1.5">
                {location.capabilities.map(cap => {
                  const active = selectedCaps.has(cap);
                  return (
                    <button key={cap} onClick={() => onTagClick(cap)} title={active ? 'Remove filter' : 'Filter by tag'}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                        active ? 'bg-foreground text-background border-foreground' : 'bg-muted text-foreground/70 border-transparent hover:border-foreground/20'
                      }`}>
                      {toHashtag(cap)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {location.membershipCost && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Access & Membership</p>
              <p className="text-sm text-foreground">{location.membershipCost}</p>
            </div>
          )}

          {location.notes && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">About</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{location.notes}</p>
            </div>
          )}
        </div>

        {location.sourceLink && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-border">
            <a href={location.sourceLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full gap-2" style={{ background: `hsl(var(${colorVar}))` }}>
                Visit website <ExternalLink size={14} />
              </Button>
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
