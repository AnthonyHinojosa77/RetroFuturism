'use client';

import { useEffect, useState } from 'react';
import SceneContainer from '@/components/SceneContainer';
import VoyagesScene from '@/illustrations/VoyagesScene';
import Hotspot from '@/components/Hotspot';
import DiscoveryPanel from '@/components/DiscoveryPanel';
import RetroButton from '@/components/RetroButton';
import ComicCard from '@/components/ComicCard';
import VisitorTicker from '@/components/VisitorTicker';
import { VOYAGES_HOTSPOTS } from '@/lib/hotspots';
import { getVisitorId, getVisitorName } from '@/lib/session';
import { getPostcards, addPostcard, addVisitorLog } from '@/lib/storage';
import type { HotspotId, Postcard } from '@/types';
import sceneStyles from '@/styles/scene.module.css';
import compStyles from '@/styles/components.module.css';

const DESTINATIONS = ['Mars', 'Venus', 'Europa', 'Titan', 'Pluto'];

const POSTERS = [
  { place: 'Mars', slogan: 'Come for the dust, stay for the canals!' },
  { place: 'Venus', slogan: 'Cloudtop resorts — sunsets every 12 minutes.' },
  { place: 'Europa', slogan: 'Ice-skate across an ocean roof.' },
  { place: 'Titan', slogan: 'Methane lakes, maximum chill.' },
];

const CAPTAIN_BIO = [
  'Commander of the SS Apogee.',
  '4 trips around Saturn, 2 through a wormhole.',
  'Favorite snack: freeze-dried banana.',
];

const BROCHURES = [
  'THE GRAND TOUR — Inner planets in 90 days.',
  'OUTER RIM EXPRESS — Luxury ice-giant cruise.',
  'ASTEROID ADVENTURER — DIY prospecting kits.',
];

export default function VoyagesPage() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [discovered, setDiscovered] = useState<Set<HotspotId>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [postcards, setPostcards] = useState<Postcard[]>([]);
  const [visitorName, setVisitorName] = useState('');
  const [destination, setDestination] = useState('Mars');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVisitorName(getVisitorName());
  }, []);

  function refreshPostcards() {
    setPostcards(getPostcards());
  }

  useEffect(() => {
    if (activeHotspot === 'ticketCounter') refreshPostcards();
  }, [activeHotspot]);

  function logVisit(action: string) {
    addVisitorLog({
      visitorId: getVisitorId(),
      visitorName: getVisitorName(),
      world: 'voyages',
      action,
    });
  }

  function handleHotspotClick(id: string) {
    const hid = id as HotspotId;
    setActiveHotspot(hid);
    setDiscovered((prev) => new Set([...prev, hid]));
    logVisit(`examined ${hid}`);
  }

  function handleSuccess() {
    setSuccessMsg('✦ TRANSMISSION RECEIVED! ✦');
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  function submitPostcard(e: React.FormEvent) {
    e.preventDefault();
    if (!visitorName.trim() || !destination.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      addPostcard({ visitorName, destination, message });
      setMessage('');
      handleSuccess();
      refreshPostcards();
      logVisit(`sent a postcard from ${destination}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">COSMIC VOYAGES</h1>
      <p className="page-subtitle">Book passage to anywhere. Pack light. Pack groovy.</p>

      <SceneContainer>
        <VoyagesScene />
        {VOYAGES_HOTSPOTS.map((h) => (
          <Hotspot
            key={h.id}
            id={h.id}
            top={h.top}
            left={h.left}
            width={h.width}
            height={h.height}
            label={h.label}
            isActive={activeHotspot === h.id}
            isDiscovered={discovered.has(h.id)}
            onClick={handleHotspotClick}
          />
        ))}
      </SceneContainer>

      <p className={sceneStyles.hint}>Click the glowing ✦ indicators to explore.</p>
      <p className={sceneStyles.counter}>Discovered: {discovered.size}/5 ✦</p>

      {successMsg && <div className={compStyles.successMsg}>{successMsg}</div>}

      {activeHotspot === 'travelPosters' && (
        <DiscoveryPanel title="TRAVEL POSTERS" color="gold" onClose={() => setActiveHotspot(null)}>
          <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {POSTERS.map((p) => (
              <ComicCard key={p.place}>
                <strong style={{ fontFamily: 'Bangers, cursive' }}>{p.place}</strong>
                <p style={{ marginTop: 4, fontSize: '0.9rem' }}>{p.slogan}</p>
              </ComicCard>
            ))}
          </div>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'ticketCounter' && (
        <DiscoveryPanel title="SEND A POSTCARD" color="red" onClose={() => setActiveHotspot(null)}>
          <p>Pick a destination, scribble a note, and we&apos;ll beam it home.</p>

          <label>Destination</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {DESTINATIONS.map((d) => (
              <RetroButton
                key={d}
                color={destination === d ? 'gold' : 'teal'}
                size="sm"
                onClick={() => setDestination(d)}
              >
                {d}
              </RetroButton>
            ))}
          </div>

          <form onSubmit={submitPostcard}>
            <label htmlFor="visitorName">Your name</label>
            <input
              id="visitorName"
              name="visitorName"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Wish you were here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <RetroButton color="red" type="submit" disabled={submitting}>
                SEND POSTCARD
              </RetroButton>
            </div>
          </form>

          {postcards.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>POSTCARD WALL</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {postcards.map((p) => (
                  <ComicCard key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontFamily: 'Bangers, cursive' }}>From: {p.visitorName}</strong>
                      <small>→ {p.destination}</small>
                    </div>
                    <p style={{ marginTop: '0.25rem' }}>{p.message}</p>
                  </ComicCard>
                ))}
              </div>
            </div>
          )}
        </DiscoveryPanel>
      )}

      {activeHotspot === 'captainCosmo' && (
        <DiscoveryPanel title="CAPTAIN COSMO" color="teal" onClose={() => setActiveHotspot(null)}>
          <p>A grinning face, a gleaming helmet. He leans in conspiratorially.</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {CAPTAIN_BIO.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'launchWindow' && (
        <DiscoveryPanel title="LAUNCH WINDOW" color="gold" onClose={() => setActiveHotspot(null)}>
          <p>
            Through the reinforced glass: a silver rocket sits on pad 4, venting vapor into the pink sky.
            A countdown clock — 00:14:02 — ticks down in bold orange numerals.
          </p>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'brochureRack' && (
        <DiscoveryPanel title="BROCHURE RACK" color="red" onClose={() => setActiveHotspot(null)}>
          <ul style={{ paddingLeft: '1rem' }}>
            {BROCHURES.map((b) => (
              <li key={b} style={{ margin: '0.5rem 0' }}>{b}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      <div className="button-row">
        <RetroButton href="/" color="gold">← BACK TO HUB</RetroButton>
      </div>

      <div style={{ maxWidth: 640, margin: '1rem auto' }}>
        <VisitorTicker />
      </div>
    </div>
  );
}
