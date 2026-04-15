'use client';

import styles from '@/styles/scene.module.css';

interface Props {
  children: React.ReactNode;
}

export default function SceneContainer({ children }: Props) {
  return <div className={styles.sceneContainer}>{children}</div>;
}
