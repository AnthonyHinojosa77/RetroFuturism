'use client';

import { useEffect, useState } from 'react';
import SceneContainer from '@/components/SceneContainer';
import ExpoScene from '@/illustrations/ExpoScene';
import Hotspot from '@/components/Hotspot';
import DiscoveryPanel from '@/components/DiscoveryPanel';
import RetroButton from '@/components/RetroButton';
import ComicCard from '@/components/ComicCard';
import VisitorTicker from '@/components/VisitorTicker';
import { EXPO_HOTSPOTS } from '@/lib/hotspots';
import { getVisitorId, getVisitorName } from '@/lib/session';
import {
  getPredictions,
  addPrediction,
  incrementPredictionVote,
  addVisitorLog,
} from '@/lib/storage';
import type { HotspotId, Prediction } from '@/types';
import sceneStyles from '@/styles/scene.module.css';
import compStyles from '@/styles/components.module.css';

const JETPACK_STATS = [
  'Thrust: 14 kN',
  'Flight time: 6 minutes',
  'Top speed: 120 km/h',
  'Landing style: controlled shuffle',
];

const BUTLER_MENU = [
  'Assist with afternoon tea',
  'Read the newspaper aloud',
  'Play phonograph records',
  'Fetch the evening slippers',
];

const MOON_FACTS = [
  'Population: 412 pioneers',
  'Main crop: hydroponic tomatoes',
  'Gravity: 1/6 Earth',
  'Dome height: 90 meters',
];

const VIDEOPHONE_LOG = [
  '"Grandma, the future is wild!"',
  '"Send more taco recipes."',
  '"Does your dog have a jetpack yet?"',
];

export default function ExpoPage() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [discovered, setDiscovered] = useState<Set<HotspotId>>(new Set());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [visitorName, setVisitorName] = useState('');
  const [predictionText, setPredictionText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVisitorName(getVisitorName());
  }, []);

  function refreshPredictions() {
    setPredictions(getPredictions());
  }

  useEffect(() => {
    if (activeHotspot === 'timeCapsule') refreshPredictions();
  }, [activeHotspot]);

  function logVisit(action: string) {
    addVisitorLog({
      visitorId: getVisitorId(),
      visitorName: getVisitorName(),
      world: 'expo',
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

  function submitPrediction(e: React.FormEvent) {
    e.preventDefault();
    if (!visitorName.trim() || !predictionText.trim()) return;
    setSubmitting(true);
    try {
      addPrediction({ visitorName, prediction: predictionText });
      setPredictionText('');
      handleSuccess();
      refreshPredictions();
      logVisit('sealed a prediction');
    } finally {
      setSubmitting(false);
    }
  }

  function votePrediction(id: string) {
    incrementPredictionVote(id);
    refreshPredictions();
  }

  return (
    <div>
      <h1 className="page-title">ATOMIC EXPO</h1>
      <p className="page-subtitle">The world of tomorrow — today.</p>

      <SceneContainer>
        <ExpoScene />
        {EXPO_HOTSPOTS.map((h) => (
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

      {activeHotspot === 'jetpackDemo' && (
        <DiscoveryPanel title="JETPACK DEMO" color="red" onClose={() => setActiveHotspot(null)}>
          <p>A technician fires up the Personal Atomic Lift. Onlookers applaud.</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {JETPACK_STATS.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'robotButler' && (
        <DiscoveryPanel title="ROBOT BUTLER" color="teal" onClose={() => setActiveHotspot(null)}>
          <p>Jeeves-9 bows politely. His brass monocle gleams.</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {BUTLER_MENU.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'timeCapsule' && (
        <DiscoveryPanel title="TIME CAPSULE 2050" color="gold" onClose={() => setActiveHotspot(null)}>
          <p>Leave a prediction. We&apos;ll reopen this capsule in 2050.</p>
          <form onSubmit={submitPrediction}>
            <label htmlFor="visitorName">Your name</label>
            <input
              id="visitorName"
              name="visitorName"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
            />
            <label htmlFor="prediction">Your prediction</label>
            <textarea
              id="prediction"
              name="prediction"
              placeholder="By 2050, I predict..."
              value={predictionText}
              onChange={(e) => setPredictionText(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <RetroButton color="gold" type="submit" disabled={submitting}>
                SEAL IN CAPSULE
              </RetroButton>
            </div>
          </form>

          {predictions.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>SEALED PREDICTIONS</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {predictions.map((p) => (
                  <ComicCard key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontFamily: 'Bangers, cursive' }}>{p.visitorName}</strong>
                    </div>
                    <p style={{ margin: '0.25rem 0 0.5rem' }}>{p.prediction}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RetroButton color="teal" size="sm" onClick={() => votePrediction(p.id)}>
                        VOTE
                      </RetroButton>
                      <span>
                        <span data-vote-count>{p.votes}</span> votes
                      </span>
                    </div>
                  </ComicCard>
                ))}
              </div>
            </div>
          )}
        </DiscoveryPanel>
      )}

      {activeHotspot === 'moonColony' && (
        <DiscoveryPanel title="MOON COLONY ALPHA" color="teal" onClose={() => setActiveHotspot(null)}>
          <p>A scale diorama under a glass dome. Tiny settlers tend tiny tomato plants.</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {MOON_FACTS.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
            ))}
          </ul>
        </DiscoveryPanel>
      )}

      {activeHotspot === 'videophone' && (
        <DiscoveryPanel title="VIDEOPHONE EXCHANGE" color="red" onClose={() => setActiveHotspot(null)}>
          <p>A live relay to families back home. Recent messages scroll past:</p>
          <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
            {VIDEOPHONE_LOG.map((l) => (
              <li key={l} style={{ margin: '0.25rem 0' }}>{l}</li>
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
