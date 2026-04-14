import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuggest: () => void;
}

const CAPABILITIES = [
  '3D Printing', 'Resin Printing', 'CNC', 'PCB',
  'Laser Cutting', 'Vinyl Cutting / Cricut', 'Electronics', 'Woodworking', 'Sewing',
];

function LibraryPin() {
  return (
    <svg viewBox="0 0 30 40" width="20" height="27" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15C0 24.941 15 40 15 40C15 40 30 24.941 30 15C30 6.716 23.284 0 15 0Z" fill="hsl(var(--lib-color))"/>
      <g transform="translate(6,5) scale(0.75)" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
    </svg>
  );
}

function MakerspacePin() {
  return (
    <svg viewBox="0 0 30 40" width="20" height="27" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15C0 24.941 15 40 15 40C15 40 30 24.941 30 15C30 6.716 23.284 0 15 0Z" fill="hsl(var(--make-color))"/>
      <g transform="translate(6,5) scale(0.75)" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </g>
    </svg>
  );
}

export default function InfoPanel({ open, onClose, onSuggest }: Props) {
  return (
    <Sheet open={open} onOpenChange={v => !v && onClose()}>
      <SheetContent side="left" className="w-72 sm:w-80 flex flex-col gap-6 pt-10">
        <SheetHeader>
          <SheetTitle className="font-black uppercase tracking-tight text-xl">fabnetwork</SheetTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Discover fabrication-capable locations — makerspaces, public libraries with maker equipment, and labs across multiple cities.
          </p>
        </SheetHeader>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Pin types</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <LibraryPin />
              <div>
                <p className="text-sm font-medium">Library</p>
                <p className="text-xs text-muted-foreground">Public libraries with maker tech</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MakerspacePin />
              <div>
                <p className="text-sm font-medium">Makerspace</p>
                <p className="text-xs text-muted-foreground">Hackerspaces, fab labs & studios</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Equipment types</p>
          <div className="flex flex-wrap gap-1.5">
            {CAPABILITIES.map(c => (
              <span key={c} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{c}</span>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xs text-muted-foreground mb-3">No accounts. No tracking. Discovery only.</p>
          <Button onClick={onSuggest} className="w-full gap-2">
            <Plus size={14} />
            Suggest a place
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
