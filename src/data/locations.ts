export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: 'Library' | 'Makerspace';
  capabilities: string[];
  membershipCost: string;
  sourceLink: string;
  notes: string;
}
