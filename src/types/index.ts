export interface VisitorLog {
  id: string;
  visitorId: string;
  visitorName: string;
  world: 'diner' | 'voyages' | 'expo';
  action: string;
  createdAt: string;
}

export interface Postcard {
  id: string;
  visitorName: string;
  destination: string;
  message: string;
  createdAt: string;
}

export interface Prediction {
  id: string;
  visitorName: string;
  prediction: string;
  votes: number;
  createdAt: string;
}

export interface CommunityDish {
  id: string;
  visitorName: string;
  dishName: string;
  description: string;
  votes: number;
  createdAt: string;
}

export type HotspotId =
  | 'jukebox' | 'menuBoard' | 'servo' | 'counter' | 'window'
  | 'travelPosters' | 'ticketCounter' | 'captainCosmo' | 'launchWindow' | 'brochureRack'
  | 'jetpackDemo' | 'robotButler' | 'timeCapsule' | 'moonColony' | 'videophone';

export type PanelColor = 'red' | 'teal' | 'gold';

export interface HotspotConfig {
  id: HotspotId;
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
