'use client';

import { useRouter } from 'next/navigation';
import SceneContainer from '@/components/SceneContainer';
import HubScene from '@/illustrations/HubScene';
import RetroButton from '@/components/RetroButton';
import StarburstBadge from '@/components/StarburstBadge';
import VisitorTicker from '@/components/VisitorTicker';
import sceneStyles from '@/styles/scene.module.css';

const HUB_ZONES = [
  { id: 'diner',   href: '/diner',   top: '20%', left: '5%',  width: '25%', height: '60%', label: 'ASTRO DINER' },
  { id: 'voyages', href: '/voyages', top: '15%', left: '35%', width: '30%', height: '65%', label: 'COSMIC VOYAGES' },
  { id: 'expo',    href: '/expo',    top: '20%', left: '68%', width: '25%', height: '60%', label: 'ATOMIC EXPO' },
] as const;

export default function HubPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="page-title">RETRO UNIVERSE</h1>
      <p className="page-subtitle">Three worlds. One groovy atomic-age internet.</p>

      <div style={{ position: 'relative' }}>
        <SceneContainer>
          <HubScene />
          {HUB_ZONES.map((z) => (
            <div
              key={z.id}
              data-hub-zone={z.id}
              role="button"
              tabIndex={0}
              aria-label={z.label}
              className={sceneStyles.hotspot}
              style={{
                position: 'absolute',
                top: z.top,
                left: z.left,
                width: z.width,
                height: z.height,
                cursor: 'pointer',
              }}
              onClick={() => router.push(z.href)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(z.href);
                }
              }}
            />
          ))}
        </SceneContainer>

        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
          <StarburstBadge>EXPLORE 3 WORLDS</StarburstBadge>
        </div>
      </div>

      <p className={sceneStyles.hint}>Click a zone to enter, or pick a portal below.</p>

      <div className="button-row">
        <RetroButton href="/diner" color="red" size="lg">
          ASTRO DINER
        </RetroButton>
        <RetroButton href="/voyages" color="teal" size="lg">
          COSMIC VOYAGES
        </RetroButton>
        <RetroButton href="/expo" color="gold" size="lg">
          ATOMIC EXPO
        </RetroButton>
      </div>

      <div style={{ maxWidth: 640, margin: '1rem auto' }}>
        <VisitorTicker />
      </div>
    </div>
  );
}
