import type { Location } from './locations';

const la: Location[] = [
  { id: 'la-1', name: 'Los Angeles Central Library', latitude: 34.0505, longitude: -118.2571, type: 'Library', capabilities: ['3D Printing', 'Vinyl Cutting / Cricut'], membershipCost: 'Free (LAPL card required)', sourceLink: 'https://www.lapl.org/branches/central-library', notes: 'LAPL Innovation Lab on the lower level. Book equipment sessions online.' },
  { id: 'la-2', name: 'LAPL Mar Vista Branch', latitude: 34.0000, longitude: -118.4260, type: 'Library', capabilities: ['3D Printing'], membershipCost: 'Free (LAPL card required)', sourceLink: 'https://www.lapl.org/branches/mar-vista', notes: 'Maker sessions available. Check branch schedule.' },
  { id: 'la-3', name: 'Supplyframe DesignLab', latitude: 34.1476, longitude: -118.1467, type: 'Makerspace', capabilities: ['CNC', 'Laser Cutting', 'PCB', 'Electronics', '3D Printing'], membershipCost: 'Application-based access', sourceLink: 'https://designlab.supplyframe.com', notes: 'Hardware-focused design lab in Pasadena. Focused on electronics and product development.' },
  { id: 'la-4', name: 'MAKEiT LA', latitude: 34.0190, longitude: -118.4785, type: 'Makerspace', capabilities: ['3D Printing', 'Laser Cutting', 'CNC', 'Vinyl Cutting / Cricut'], membershipCost: 'Membership from $50/month', sourceLink: 'https://www.makeitla.com', notes: 'Community makerspace in Santa Monica area. Day passes and memberships available.' },
  { id: 'la-5', name: 'LAPL Palms Branch', latitude: 34.0271, longitude: -118.4003, type: 'Library', capabilities: ['3D Printing', 'Electronics'], membershipCost: 'Free (LAPL card required)', sourceLink: 'https://www.lapl.org/branches/palms', notes: 'Maker workshops and equipment access for cardholders.' },
];

export default la;
