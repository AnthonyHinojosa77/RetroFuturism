'use client';

import styles from '@/styles/components.module.css';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function StarburstBadge({ children, style }: Props) {
  return (
    <div className={styles.starburst} style={style}>
      {children}
    </div>
  );
}
