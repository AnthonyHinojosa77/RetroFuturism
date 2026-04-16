'use client';

import { useEffect, useState } from 'react';
import SceneContainer from '@/components/SceneContainer';
import DinerScene from '@/illustrations/DinerScene';
import Hotspot from '@/components/Hotspot';
import DiscoveryPanel from '@/components/DiscoveryPanel';
import RetroButton from '@/components/RetroButton';
import ComicCard from '@/components/ComicCard';
import VisitorTicker from '@/components/VisitorTicker';
import { DINER_HOTSPOTS } from '@/lib/hotspots';
import { getVisitorId, getVisitorName } from '@/lib/session';
import {
  getCommunityDishes,
  addCommunityDish,
  incrementDishVote,
  addVisitorLog,
} from '@/lib/storage';
import type { HotspotId, CommunityDish } from '@/types';
import sceneStyles from '@/styles/scene.module.css';
import compStyles from '@/styles/components.module.css';

const MENU = [
  { name: 'Nebula Noodle Soup', desc: 'Swirling broth from the Orion arm. Served hot, 500° K.' },
  { name: 'Meteor Malt', desc: 'Vanilla shake with crushed chondrite sprinkles.' },
  { name: 'Plutonium Pudding', desc: 'Glows gently. Perfectly safe. Mostly.' },
  { name: 'Saturn Ring Onion', desc: 'Seven concentric onion rings, stacked.' },
  { name: 'Comet Cola', desc: 'Fizz so cold your tongue sees stars.' },
  { name: 'Asteroid Fries', desc: 'Hand-cut, meteorite-salted, craggy edges.' },
];

const JUKEBOX_TRACKS = [
  'A-01  "Moonlight Martini" — The Cosmic Tones',
  'A-02  "Rocket Romance" — Stella & the Starlights',
  'B-03  "Chromium Shuffle" — The Atomic Three',
  'B-04  "Gravity Waltz" — Hugo Nova',
  'C-05  "Neon Diner Blues" — The Chrome Spoons',
];

const SERVO_LINES = [
  '"BEEP. WELCOME, VALUED ORGANIC LIFE-FORM."',
  '"TODAY\'S SPECIAL IS PLUTONIUM PUDDING."',
  '"PLEASE DO NOT PET MY ANTENNA."',
];

export default function DinerPage() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [discovered, setDiscovered] = useState<Set<HotspotId>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [dishes, setDishes] = useState<CommunityDish[]>([]);
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVisitorName(getVisitorName());
  }, []);

  function refreshDishes() {
    setDishes(getCommunityDishes());
  }

  useEffect(() => {
    if (activeHotspot === 'counter') refreshDishes();
  }, [activeHotspot]);

  function logVisit(action: string) {
    addVisitorLog({
      visitorId: getVisitorId(),
      visitorName: getVisitorName(),
      world: 'diner',
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

  function submitDish(e: React.FormEvent) {
    e.preventDefault();
    if (!dishName.trim() || !dishDesc.trim() || !visitorName.trim()) return;
    setSubmitting(true);
    try {
      addCommunityDish({ visitorName, dishName, description: dishDesc });
      setDishName('');
      setDishDesc('');
      handleSuccess();
      refreshDishes();
      logVisit(`invented dish "${dishName}"`);
    } finally {
      setSubmitting(false);
    }
  }

  function voteDish(id: string) {
    incrementDishVote(id);
    refreshDishes();
  }

  return (
    <div>
      <h1 className="page-title">ASTRO DINER</h1>
      <p className="page-subtitle">Where the malts are cold and the gravity is optional.</p>

      <SceneContainer>
        <DinerScene />
        {DINER_HOTSPOTS.map((h) => (
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

      {activeHotspot === 'jukebox' && (
        <DiscoveryPanel title="THE ATOMIC JUKEBOX" color="red" onClose={() => setActiveHotspot(null)}>
          <p>Drop a credit, pick a track, and let the chrome spin.</p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }}>
            {JUKEBOX_TRACKS.map((t) => (
              <li key={t} style={{ padding: '4px 0', borderBottom: '1px dashed #160E08' }}>
                {t}
              </li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'menuBoard' && (
        <DiscoveryPanel title="TODAY'S SPECIALS" color="gold" onClose={() => setActiveHotspot(null)}>
          <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {MENU.map((m) => (
              <ComicCard key={m.name}>
                <strong style={{ fontFamily: 'Bangers, cursive', fontSize: '1.1rem' }}>{m.name}</strong>
                <p style={{ marginTop: 4, fontSize: '0.9rem' }}>{m.desc}</p>
              </ComicCard>
            ))}
          </div>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'servo' && (
        <DiscoveryPanel title="SERVO-3, YOUR WAITER" color="teal" onClose={() => setActiveHotspot(null)}>
          <p>Servo-3 whirs to life. His eye-bulbs blink in greeting.</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {SERVO_LINES.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'counter' && (
        <DiscoveryPanel title="INVENT A DISH" color="red" onClose={() => setActiveHotspot(null)}>
          <p>Pitch the cook. If the universe approves, it joins the menu.</p>
          <form onSubmit={submitDish}>
            <label htmlFor="visitorName">Your name</label>
            <input
              id="visitorName"
              name="visitorName"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
            <label htmlFor="dishName">Dish name</label>
            <input
              id="dishName"
              name="dishName"
              placeholder="Name your dish"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />
            <label htmlFor="dishDesc">Description</label>
            <textarea
              id="dishDesc"
              name="dishDesc"
              placeholder="Describe your dish..."
              value={dishDesc}
              onChange={(e) => setDishDesc(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <RetroButton color="gold" type="submit" disabled={submitting}>
                PITCH IT
              </RetroButton>
            </div>
          </form>

          {dishes.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>FAN-SUBMITTED MENU</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {dishes.map((d) => (
                  <ComicCard key={d.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontFamily: 'Bangers, cursive' }}>{d.dishName}</strong>
                      <small>by {d.visitorName}</small>
                    </div>
                    <p style={{ margin: '0.25rem 0 0.5rem' }}>{d.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RetroButton color="teal" size="sm" onClick={() => voteDish(d.id)}>
                        VOTE
                      </RetroButton>
                      <span>
                        <span data-vote-count>{d.votes}</span> votes
                      </span>
                    </div>
                  </ComicCard>
                ))}
              </div>
            </div>
          )}
        </DiscoveryPanel>
      )}

      {activeHotspot === 'window' && (
        <DiscoveryPanel title="OBSERVATION WINDOW" color="teal" onClose={() => setActiveHotspot(null)}>
          <p>
            Beyond the chrome frame: a red-dust desert where twin moons sit low and a dirigible drifts toward the horizon.
            Far below, a freight-train of cargo pods slides silently toward the spaceport.
          </p>
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
