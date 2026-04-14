import { z } from 'zod';
import { createEndpoint } from 'zite-integrations-backend-sdk';

const ALL_LOCATIONS = [
  // San Francisco
  { name: 'Noisebridge', city: 'San Francisco', lat: 37.7625, lng: -122.4196, type: 'makerspace', capabilities: ['3D Printing', 'CNC', 'Laser Cutting', 'Electronics', 'PCB', 'Sewing'], membership_info: 'Free (donate what you can)', source_url: 'https://www.noisebridge.net', description: 'Community-run hackerspace. Do-ocracy. Open 24/7 for members.' },
  { name: 'SFPL Main Branch — Tech Lab', city: 'San Francisco', lat: 37.7786, lng: -122.4162, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut', 'Electronics'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/main-library', description: 'Tech Lab on the 5th floor. Book equipment time online.' },
  { name: 'SFPL Eureka Valley Branch', city: 'San Francisco', lat: 37.7633, lng: -122.4326, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/eureka-valley', description: 'Harvey Milk Memorial Library. Maker Lab available.' },
  { name: 'SFPL Mission Branch', city: 'San Francisco', lat: 37.7488, lng: -122.4241, type: 'library', capabilities: ['3D Printing'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/mission', description: 'Drop-in maker hours available.' },
  { name: 'SFPL Portola Branch', city: 'San Francisco', lat: 37.7244, lng: -122.4066, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/portola', description: 'Makerspace sessions on weekends.' },
  { name: 'SFPL Anza Branch', city: 'San Francisco', lat: 37.7729, lng: -122.4986, type: 'library', capabilities: ['3D Printing'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/anza', description: 'Maker equipment available during open hours.' },
  { name: 'SFPL Chinatown / Him Mark Lai Branch', city: 'San Francisco', lat: 37.7960, lng: -122.4079, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/chinatown', description: 'Creative tech resources available.' },
  { name: 'Exploratorium Tinkering Studio', city: 'San Francisco', lat: 37.8014, lng: -122.3974, type: 'makerspace', capabilities: ['Electronics', 'Sewing', 'Woodworking'], membership_info: 'Admission required (~$30 adult)', source_url: 'https://www.exploratorium.edu/tinkering', description: 'World-class tinkering lab at Pier 15. Hands-on making for all ages.' },
  { name: 'Gray Area', city: 'San Francisco', lat: 37.7517, lng: -122.4186, type: 'makerspace', capabilities: ['Laser Cutting', 'Electronics', 'Vinyl Cutting / Cricut'], membership_info: 'Membership from $75/month', source_url: 'https://grayarea.org', description: 'Arts and technology nonprofit. Equipment access with membership.' },
  { name: 'SFPL Ocean View Branch', city: 'San Francisco', lat: 37.7150, lng: -122.4503, type: 'library', capabilities: ['3D Printing'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/ocean-view', description: 'Scheduled maker sessions available.' },
  { name: 'SFPL Richmond Branch', city: 'San Francisco', lat: 37.7797, lng: -122.4631, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (SF library card required)', source_url: 'https://sfpl.org/locations/richmond', description: 'Maker Lab with scheduled equipment sessions.' },
  // Los Angeles
  { name: 'Los Angeles Central Library', city: 'Los Angeles', lat: 34.0505, lng: -118.2571, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (LAPL card required)', source_url: 'https://www.lapl.org/branches/central-library', description: 'LAPL Innovation Lab on the lower level. Book equipment sessions online.' },
  { name: 'LAPL Mar Vista Branch', city: 'Los Angeles', lat: 34.0000, lng: -118.4260, type: 'library', capabilities: ['3D Printing'], membership_info: 'Free (LAPL card required)', source_url: 'https://www.lapl.org/branches/mar-vista', description: 'Maker sessions available. Check branch schedule.' },
  { name: 'Supplyframe DesignLab', city: 'Los Angeles', lat: 34.1476, lng: -118.1467, type: 'makerspace', capabilities: ['CNC', 'Laser Cutting', 'PCB', 'Electronics', '3D Printing'], membership_info: 'Application-based access', source_url: 'https://designlab.supplyframe.com', description: 'Hardware-focused design lab in Pasadena. Focused on electronics and product development.' },
  { name: 'MAKEiT LA', city: 'Los Angeles', lat: 34.0190, lng: -118.4785, type: 'makerspace', capabilities: ['3D Printing', 'Laser Cutting', 'CNC', 'Vinyl Cutting / Cricut'], membership_info: 'Membership from $50/month', source_url: 'https://www.makeitla.com', description: 'Community makerspace in Santa Monica area. Day passes and memberships available.' },
  // New York City
  { name: 'NYPL Mid-Manhattan Library', city: 'New York City', lat: 40.7532, lng: -73.9822, type: 'library', capabilities: ['3D Printing', 'Electronics', 'Vinyl Cutting / Cricut'], membership_info: 'Free (NYPL card required)', source_url: 'https://www.nypl.org/locations/mid-manhattan', description: 'The Hub — NYPL\'s space for learning and making. Multiple maker tools available.' },
  { name: 'NYC Resistor', city: 'New York City', lat: 40.6802, lng: -73.9838, type: 'makerspace', capabilities: ['Electronics', 'PCB', 'Laser Cutting', '3D Printing', 'CNC'], membership_info: '$100/month or $5 per class', source_url: 'https://www.nycresistor.com', description: 'Hacker collective in Brooklyn. Classes and open hack nights. Strong electronics focus.' },
  { name: 'Brooklyn Public Library — Central', city: 'New York City', lat: 40.6726, lng: -73.9694, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (BPL card required)', source_url: 'https://www.bklynlibrary.org/locations/central', description: 'Maker space with regular programming and equipment access for cardholders.' },
  { name: 'Genspace', city: 'New York City', lat: 40.6865, lng: -73.9877, type: 'makerspace', capabilities: ['Electronics', 'PCB', '3D Printing'], membership_info: 'Membership from $100/month', source_url: 'https://www.genspace.org', description: 'Community biolab and makerspace in Brooklyn. Unique focus on biology + electronics.' },
  // Boston
  { name: 'Boston Public Library — Copley', city: 'Boston', lat: 42.3499, lng: -71.0780, type: 'library', capabilities: ['3D Printing', 'Electronics', 'Vinyl Cutting / Cricut'], membership_info: 'Free (BPL card required)', source_url: 'https://www.bpl.org/locations/central', description: 'Digital Media Lab on the lower level. Booking required for equipment.' },
  { name: "Artisan's Asylum", city: 'Boston', lat: 42.3850, lng: -71.1044, type: 'makerspace', capabilities: ['CNC', 'Laser Cutting', '3D Printing', 'Sewing', 'Electronics', 'Woodworking', 'Resin Printing'], membership_info: 'Membership from $50/month', source_url: 'https://artisansasylum.com', description: "One of the largest makerspaces in the US. Somerville, MA. Huge range of tools and equipment." },
  { name: 'Cambridge Public Library', city: 'Boston', lat: 42.3659, lng: -71.1064, type: 'library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membership_info: 'Free (Cambridge library card)', source_url: 'https://www.cambridgema.gov/cpl', description: 'Maker lab at the main branch with equipment booking available.' },
  { name: 'MIT Libraries — Makerspace', city: 'Boston', lat: 42.3601, lng: -71.0942, type: 'makerspace', capabilities: ['3D Printing', 'Laser Cutting', 'CNC', 'Electronics', 'PCB'], membership_info: 'MIT community only', source_url: 'https://libraries.mit.edu/fabrication', description: 'MIT community makerspace. Limited public access — check for open events.' },
];

export default createEndpoint({
  description: 'Seeds Supabase with all location data (run once)',
  inputSchema: z.object({ secret: z.string() }),
  outputSchema: z.object({ inserted: z.number(), errors: z.number() }),
  execute: async ({ input }) => {
    if (input.secret !== 'seed-fabnetwork-2025') throw new Error('Unauthorized');

    const url = process.env.ZITE_SUPABASE_URL ?? '';
    const key = process.env.ZITE_SUPABASE_ANON_KEY ?? '';

    const res = await fetch(`${url}/rest/v1/locations`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(ALL_LOCATIONS),
    });

    return { inserted: res.ok ? ALL_LOCATIONS.length : 0, errors: res.ok ? 0 : 1 };
  },
});
