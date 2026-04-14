import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitSuggestion } from 'zite-endpoints-sdk';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SuggestModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ locationName: '', suggestedChange: '', sourceUrl: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.locationName || !form.suggestedChange || !form.sourceUrl) return;
    setLoading(true);
    try {
      await submitSuggestion(form);
      toast('Thanks! Your suggestion has been received.');
      setForm({ locationName: '', suggestedChange: '', sourceUrl: '', notes: '' });
      onClose();
    } catch {
      toast('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Suggest a place</DialogTitle>
          <DialogDescription>
            Know a makerspace or library with fab equipment? Tell us — submissions are reviewed before being added.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label htmlFor="locationName">Location name *</Label>
            <Input id="locationName" name="locationName" value={form.locationName} onChange={handleChange} placeholder="e.g. Noisebridge" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="suggestedChange">Suggested change *</Label>
            <Textarea id="suggestedChange" name="suggestedChange" value={form.suggestedChange} onChange={handleChange} placeholder="What's wrong or missing? e.g. They added a laser cutter in 2024" rows={3} required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sourceUrl">Source URL *</Label>
            <Input id="sourceUrl" name="sourceUrl" type="url" value={form.sourceUrl} onChange={handleChange} placeholder="https://..." required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes <span className="text-muted-foreground">(optional)</span></Label>
            <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Anything else we should know..." rows={2} />
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending…' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
