import type { Location } from './locations';

const boston: Location[] = [
  { id: 'bos-1', name: 'Boston Public Library — Copley', latitude: 42.3499, longitude: -71.0780, type: 'Library', capabilities: ['3D Printing', 'Electronics', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (BPL card required)', sourceLink: 'https://www.bpl.org/locations/central', notes: 'Digital Media Lab on the lower level. Booking required for equipment.' },
  { id: 'bos-2', name: "Artisan's Asylum", latitude: 42.3850, longitude: -71.1044, type: 'Makerspace', capabilities: ['CNC', 'Laser Cutting', '3D Printing', 'Sewing', 'Electronics', 'Woodworking', 'Resin Printing'], membershipCost: 'Membership from $50/month', sourceLink: 'https://artisansasylum.com', notes: 'One of the largest makerspaces in the US. Somerville, MA. Huge range of tools and equipment.' },
  { id: 'bos-3', name: 'Cambridge Public Library', latitude: 42.3659, longitude: -71.1064, type: 'Library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (Cambridge library card)', sourceLink: 'https://www.cambridgema.gov/cpl', notes: 'Maker lab at the main branch with equipment booking available.' },
  { id: 'bos-4', name: 'MIT Libraries — Makerspace', latitude: 42.3601, longitude: -71.0942, type: 'Makerspace', capabilities: ['3D Printing', 'Laser Cutting', 'CNC', 'Electronics', 'PCB'], membershipCost: 'MIT community only', sourceLink: 'https://libraries.mit.edu/fabrication', notes: 'MIT community makerspace. Limited public access — check for open events.' },
  { id: 'bos-5', name: 'BPL East Boston Branch', latitude: 42.3728, longitude: -71.0397, type: 'Library', capabilities: ['3D Printing'], membershipCost: 'Free (BPL card required)', sourceLink: 'https://www.bpl.org/locations/east-boston', notes: 'Maker programming available. Check branch calendar for sessions.' },
];

export default boston;
