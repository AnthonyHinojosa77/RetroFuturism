'use client';

import Link from 'next/link';
import styles from '@/styles/components.module.css';

export default function Nav() {
  return (
    <nav className={styles.navBar}>
      <Link href="/" className={styles.navBrand}>
        ✦ RETRO UNIVERSE
      </Link>
      <div className={styles.navLinks}>
        <Link href="/diner" className={styles.navBrand} style={{ fontSize: '1rem' }}>
          DINER
        </Link>
        <Link href="/voyages" className={styles.navBrand} style={{ fontSize: '1rem' }}>
          VOYAGES
        </Link>
        <Link href="/expo" className={styles.navBrand} style={{ fontSize: '1rem' }}>
          EXPO
        </Link>
      </div>
    </nav>
  );
}
