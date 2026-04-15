import type { HotspotConfig } from '@/types';

export const DINER_HOTSPOTS: HotspotConfig[] = [
  { id: 'jukebox',   top: '15%', left: '5%',  width: '12%', height: '55%', label: 'Atomic Jukebox' },
  { id: 'menuBoard', top: '5%',  left: '30%', width: '25%', height: '30%', label: 'Menu Board' },
  { id: 'servo',     top: '20%', left: '44%', width: '14%', height: '50%', label: 'Robot Waiter Servo' },
  { id: 'counter',   top: '60%', left: '20%', width: '40%', height: '20%', label: 'Chrome Counter' },
  { id: 'window',    top: '10%', left: '75%', width: '18%', height: '40%', label: 'Observation Window' },
];

export const VOYAGES_HOTSPOTS: HotspotConfig[] = [
  { id: 'travelPosters', top: '5%',  left: '2%',  width: '20%', height: '70%', label: 'Travel Posters' },
  { id: 'ticketCounter', top: '55%', left: '30%', width: '28%', height: '30%', label: 'Ticket Counter' },
  { id: 'captainCosmo',  top: '15%', left: '38%', width: '16%', height: '60%', label: 'Captain Cosmo' },
  { id: 'launchWindow',  top: '10%', left: '68%', width: '18%', height: '45%', label: 'Launch Window' },
  { id: 'brochureRack',  top: '20%', left: '86%', width: '12%', height: '50%', label: 'Brochure Rack' },
];

export const EXPO_HOTSPOTS: HotspotConfig[] = [
  { id: 'jetpackDemo', top: '10%', left: '3%',  width: '16%', height: '65%', label: 'Jetpack Demo' },
  { id: 'robotButler', top: '15%', left: '22%', width: '14%', height: '55%', label: 'Robot Butler' },
  { id: 'timeCapsule', top: '30%', left: '42%', width: '14%', height: '45%', label: 'Time Capsule' },
  { id: 'moonColony',  top: '10%', left: '60%', width: '18%', height: '55%', label: 'Moon Colony Alpha' },
  { id: 'videophone',  top: '15%', left: '80%', width: '14%', height: '55%', label: 'Videophone Exchange' },
];
