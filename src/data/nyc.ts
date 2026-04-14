import type { Location } from './locations';

const nyc: Location[] = [
  { id: 'nyc-1', name: 'NYPL Mid-Manhattan Library', latitude: 40.7532, longitude: -73.9822, type: 'Library', capabilities: ['3D Printing', 'Electronics', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (NYPL card required)', sourceLink: 'https://www.nypl.org/locations/mid-manhattan', notes: 'The Hub — NYPL\'s space for learning and making. Multiple maker tools available.' },
  { id: 'nyc-2', name: 'NYC Resistor', latitude: 40.6802, longitude: -73.9838, type: 'Makerspace', capabilities: ['Electronics', 'PCB', 'Laser Cutting', '3D Printing', 'CNC'], membershipCost: '$100/month or $5 per class', sourceLink: 'https://www.nycresistor.com', notes: 'Hacker collective in Brooklyn. Classes and open hack nights. Strong electronics focus.' },
  { id: 'nyc-3', name: 'Brooklyn Public Library — Central', latitude: 40.6726, longitude: -73.9694, type: 'Library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (BPL card required)', sourceLink: 'https://www.bklynlibrary.org/locations/central', notes: 'Maker space with regular programming and equipment access for cardholders.' },
  { id: 'nyc-4', name: 'Genspace', latitude: 40.6865, longitude: -73.9877, type: 'Makerspace', capabilities: ['Electronics', 'PCB', '3D Printing'], membershipCost: 'Membership from $100/month', sourceLink: 'https://www.genspace.org', notes: 'Community biolab and makerspace in Brooklyn. Unique focus on biology + electronics.' },
  { id: 'nyc-5', name: 'NYPL Staten Island', latitude: 40.6445, longitude: -74.0786, type: 'Library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (NYPL card required)', sourceLink: 'https://www.nypl.org/locations/new-dorp', notes: 'Maker programming available at select Staten Island branches.' },
];

export default nyc;
