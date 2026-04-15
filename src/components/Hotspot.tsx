'use client';

import styles from '@/styles/scene.module.css';

interface Props {
  id: string;
  top: string;
  left: string;
  width: string;
  height: string;
  label: string;
  isActive: boolean;
  isDiscovered: boolean;
  onClick: (id: string) => void;
}

export default function Hotspot({
  id,
  top,
  left,
  width,
  height,
  label,
  isActive,
  isDiscovered,
  onClick,
}: Props) {
  return (
    <div
      data-hotspot={id}
      title={label}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={isActive}
      className={styles.hotspot}
      style={{ top, left, width, height, position: 'absolute' }}
      onClick={() => onClick(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      <div className={styles.indicator} />
      {isDiscovered && <span className="discovered-badge" aria-hidden>✦</span>}
    </div>
  );
}
