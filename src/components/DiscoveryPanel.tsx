'use client';

import styles from '@/styles/panels.module.css';
import type { PanelColor } from '@/types';

interface Props {
  title: string;
  color: PanelColor;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DiscoveryPanel({ title, color, onClose, children }: Props) {
  const headerClass =
    color === 'red' ? styles.headerRed : color === 'teal' ? styles.headerTeal : styles.headerGold;
  return (
    <div className={styles.panel} role="dialog" aria-label={title}>
      <div className={`${styles.header} ${headerClass}`}>
        <span>{title}</span>
        <button
          type="button"
          aria-label="Close panel"
          className={styles.closeBtn}
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
