'use client';

import styles from '@/styles/components.module.css';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ComicCard({ children, style }: Props) {
  return (
    <div className={styles.comicPanel} style={style}>
      {children}
    </div>
  );
}
