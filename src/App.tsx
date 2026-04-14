import { useState, useEffect, useRef, useMemo } from 'react';
import MapView from '@/components/MapView';
import LocationCard from '@/components/LocationCard';
import LocationDrawer from '@/components/LocationDrawer';
import SuggestModal from '@/components/SuggestModal';
import InfoPanel from '@/components/InfoPanel';
import { Toaster } from '@/components/ui/sonner';
import { Menu, Plus, ZoomIn, ZoomOut, Info, MapPin, X, Palette, ChevronDown } from 'lucide-react';
import { CITIES, type CityConfig } from '@/data/cities';
import type { Location } from '@/data/locations';
import { getLocations } from 'zite-endpoints-sdk';
import SeedRunner from '@/components/SeedRunner';

const SEED_MODE = new URLSearchParams(window.location.search).get('seed') === '1';

const ALL_CAPS = ['3D Printing', 'Resin Printing', 'Laser Cutting', 'CNC', 'PCB', 'Vinyl Cutting / Cricut', 'Electronics', 'Woodworking', 'Sewing'];
const toHashtag = (cap: string) => '#' + cap.toLowerCase().replace(/[^a-z0-9]/g, '');

function haversineKm([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapBtn({ onClick, children, active }: { onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button onClick={onClick} className={`w-10 h-10 border border-foreground/70 backdrop-blur-sm flex items-center justify-center transition-colors ${active ? 'bg-foreground text-background' : 'bg-background/90 hover:bg-background'}`}>
      {children}
    </button>
  );
}

export default function App() {
  const [city, setCity] = useState<CityConfig>(() => CITIES.find(c => c.id === (localStorage.getItem('fab-city') ?? 'sf')) ?? CITIES[0]);
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [selected, setSelected] = useState<{ location: Location; x: number; y: number } | null>(null);
  const [drawerLocation, setDrawerLocation] = useState<Location | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedCaps, setSelectedCaps] = useState<Set<string>>(new Set());
  const [zipInput, setZipInput] = useState('');
  const [activeZip, setActiveZip] = useState('');
  const [zipOpen, setZipOpen] = useState(false);
  const [zipError, setZipError] = useState('');
  const [theme, setTheme] = useState<'default' | 'pink' | 'catppuccin'>(() =>
    (localStorage.getItem('fab-theme') as 'default' | 'pink' | 'catppuccin') ?? 'default'
  );
  const mapRef = useRef<any>(null);

  // Theme: apply class to <html> — defined outside @layer so it wins
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('theme-pink', 'theme-catppuccin');
    if (theme === 'pink') html.classList.add('theme-pink');
    if (theme === 'catppuccin') html.classList.add('theme-catppuccin');
    localStorage.setItem('fab-theme', theme);
  }, [theme]);

  function cycleTheme() {
    setTheme(t => t === 'default' ? 'pink' : t === 'pink' ? 'catppuccin' : 'default');
  }

  // Fetch locations from Supabase when city changes
  useEffect(() => {
    let cancelled = false;
    setLocationsLoading(true);
    setLocations([]);
    getLocations({ city: city.name })
      .then(data => {
        if (!cancelled) {
          setLocations(data.locations as unknown as Location[]);
          setLocationsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLocationsLoading(false);
      });
    return () => { cancelled = true; };
  }, [city.name]);

  // City change: recenter map, reset filters
  function selectCity(c: CityConfig) {
    setCity(c);
    setCityMenuOpen(false);
    setSelected(null);
    setDrawerOpen(false);
    setActiveZip('');
    setZipInput('');
    setSelectedCaps(new Set());
    localStorage.setItem('fab-city', c.id);
    mapRef.current?.setView(c.center, c.zoom);
  }

  const filtered = useMemo(() => {
    let result = locations;
    if (selectedCaps.size > 0)
      result = result.filter(l => l.capabilities.some(c => selectedCaps.has(c)));
    if (activeZip) {
      const center = city.zips[activeZip];
      if (center) result = result.filter(l => haversineKm(center, [l.latitude, l.longitude]) <= 2.5);
    }
    return result;
  }, [locations, city, selectedCaps, activeZip]);

  function handleTagClick(cap: string) {
    setSelectedCaps(prev => { const s = new Set(prev); s.has(cap) ? s.delete(cap) : s.add(cap); return s; });
  }

  function handleMoreInfo() {
    if (!selected) return;
    setDrawerLocation(selected.location);
    setDrawerOpen(true);
    setSelected(null);
  }

  function applyZip() {
    const z = zipInput.trim();
    if (!city.zips[z]) { setZipError(`Not a valid ZIP for ${city.name}.`); return; }
    setZipError(''); setActiveZip(z);
    const [lat, lng] = city.zips[z];
    mapRef.current?.setView([lat, lng], 15);
    setZipOpen(false); setSelected(null);
  }

  if (SEED_MODE) return <SeedRunner />;

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-background" onClick={() => setCityMenuOpen(false)}>
      <MapView
        locations={filtered}
        initialCenter={city.center}
        initialZoom={city.zoom}
        theme={theme}
        onMarkerClick={(loc, x, y) => { setDrawerOpen(false); setSelected({ location: loc, x, y }); }}
        onMapClick={() => { setSelected(null); setCityMenuOpen(false); }}
        onReady={map => { mapRef.current = map; }}
      />

      {/* Top-left: menu + theme toggle */}
      <div className="absolute top-4 left-4 z-[1001] flex flex-col -space-y-px">
        <MapBtn onClick={() => setInfoOpen(true)}><Menu size={17} strokeWidth={1.8} /></MapBtn>
        <MapBtn onClick={cycleTheme} active={theme !== 'default'}>
          <Palette size={15} strokeWidth={1.8} />
        </MapBtn>
      </div>

      {/* Top-center: title + city selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] text-center" onClick={e => e.stopPropagation()}>
        <h1 className="font-black uppercase leading-none tracking-tight text-foreground select-none pointer-events-none" style={{ fontSize: '1.3rem' }}>fabnetwork</h1>
        <div className="relative mt-1 flex justify-center">
          <button
            onClick={() => setCityMenuOpen(o => !o)}
            className="flex items-center gap-1 text-[10px] font-semibold tracking-widest uppercase text-foreground/50 hover:text-foreground/80 transition-colors bg-background/80 backdrop-blur-sm border border-border/60 rounded-full px-2.5 py-1"
          >
            {city.name} <ChevronDown size={9} className={`transition-transform ${cityMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {cityMenuOpen && (
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-background border border-border rounded-xl shadow-lg py-1 min-w-[160px] z-[1002]">
              {CITIES.map(c => (
                <button key={c.id} onClick={() => selectCity(c)}
                  className={`w-full px-4 py-2 text-xs text-left transition-colors ${c.id === city.id ? 'font-semibold text-foreground bg-muted' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top-right: suggest */}
      {!drawerOpen && (
        <div className="absolute top-4 right-4 z-[1001]">
          <MapBtn onClick={() => setSuggestOpen(true)}><Plus size={18} strokeWidth={1.8} /></MapBtn>
        </div>
      )}

      {/* Bottom-right: zoom + info */}
      <div className={`absolute bottom-8 z-[1001] flex flex-col -space-y-px transition-all duration-300 ${drawerOpen ? 'right-[calc(440px+1rem)]' : 'right-4'}`}>
        <MapBtn onClick={() => mapRef.current?.zoomIn()}><ZoomIn size={15} strokeWidth={1.8} /></MapBtn>
        <MapBtn onClick={() => mapRef.current?.zoomOut()}><ZoomOut size={15} strokeWidth={1.8} /></MapBtn>
        <MapBtn onClick={() => setInfoOpen(true)}><Info size={15} strokeWidth={1.8} /></MapBtn>
      </div>

      {/* Bottom-left: ZIP search */}
      <div className="absolute bottom-8 left-4 z-[1001] flex flex-col items-start gap-2">
        {zipOpen && (
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg w-52">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Search by ZIP code</p>
            <div className="flex gap-1.5">
              <input className="flex-1 border border-border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-foreground/20 font-mono bg-background text-foreground"
                placeholder={`e.g. ${Object.keys(city.zips)[0] ?? '94110'}`} value={zipInput}
                onChange={e => { setZipInput(e.target.value); setZipError(''); }}
                onKeyDown={e => e.key === 'Enter' && applyZip()} maxLength={5} autoFocus />
              <button onClick={applyZip} className="bg-foreground text-background rounded-lg px-2.5 py-1.5 text-xs font-semibold hover:opacity-80 transition-opacity">Go</button>
            </div>
            {zipError && <p className="text-[10px] text-destructive mt-1.5">{zipError}</p>}
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapBtn onClick={() => { setZipOpen(o => !o); setZipError(''); }}>
            <MapPin size={15} strokeWidth={1.8} className={activeZip ? 'text-primary' : ''} />
          </MapBtn>
          {activeZip && (
            <div className="flex items-center gap-1.5 bg-foreground text-background rounded-full px-2.5 py-1 text-xs font-semibold">
              {activeZip} <button onClick={() => { setActiveZip(''); setZipInput(''); }}><X size={11} /></button>
            </div>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {locationsLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2.5 text-xs text-muted-foreground font-medium shadow">
            Loading locations…
          </div>
        </div>
      )}

      {/* Empty state */}
      {!locationsLoading && filtered.length === 0 && locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[999] pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-6 py-5 text-center max-w-xs shadow-lg">
            <p className="font-semibold text-foreground mb-1">{city.name} is coming soon</p>
            <p className="text-xs text-muted-foreground">Know a makerspace or library with fab equipment here?</p>
            <button onClick={() => setSuggestOpen(true)} className="mt-3 pointer-events-auto text-xs font-semibold underline underline-offset-2 text-foreground/70 hover:text-foreground">
              Suggest a place →
            </button>
          </div>
        </div>
      )}

      {/* Active filter count badge */}
      {selectedCaps.size > 0 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
          <div className="bg-foreground/90 text-background backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-semibold whitespace-nowrap">
            {selectedCaps.size} filter{selectedCaps.size > 1 ? 's' : ''} active
          </div>
        </div>
      )}

      {/* Capability filter chips */}
      <div className="absolute bottom-0 left-0 right-0 z-[998] pointer-events-none">
        <div className="pointer-events-auto px-3 pb-3 pt-2">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {ALL_CAPS.map(cap => {
              const active = selectedCaps.has(cap);
              return (
                <button key={cap} onClick={() => handleTagClick(cap)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-mono border transition-all whitespace-nowrap ${
                    active ? 'bg-foreground text-background border-foreground' : 'bg-background/88 backdrop-blur-sm text-foreground/70 border-border hover:border-foreground/40'
                  }`}>
                  {toHashtag(cap)}
                </button>
              );
            })}
            {selectedCaps.size > 0 && (
              <button onClick={() => setSelectedCaps(new Set())}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-destructive/50 text-destructive bg-background/88 backdrop-blur-sm hover:bg-destructive/10 transition-all whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pin popup card */}
      {selected && (
        <LocationCard location={selected.location} x={selected.x} y={selected.y}
          onClose={() => setSelected(null)} onTagClick={handleTagClick}
          onMoreInfo={handleMoreInfo} selectedCaps={selectedCaps} />
      )}

      {/* Right detail drawer */}
      <LocationDrawer location={drawerLocation} open={drawerOpen}
        onClose={() => setDrawerOpen(false)} onTagClick={handleTagClick} selectedCaps={selectedCaps} />

      <InfoPanel open={infoOpen} onClose={() => setInfoOpen(false)} onSuggest={() => { setInfoOpen(false); setSuggestOpen(true); }} />
      <SuggestModal open={suggestOpen} onClose={() => setSuggestOpen(false)} city={city.name} />
      <Toaster position="top-center" />
    </div>
  );
}
