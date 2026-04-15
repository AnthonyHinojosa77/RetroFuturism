'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/components.module.css';
import type { VisitorLog } from '@/types';

export default function VisitorTicker() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/visitor-log', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as VisitorLog[];
        if (!cancelled) setLogs(Array.isArray(data) ? data : []);
      } catch {
        /* ignore */
      }
    }
    load();
    const id = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (logs.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % logs.length);
    }, 3000);
    return () => clearInterval(id);
  }, [logs.length]);

  if (logs.length === 0) {
    return (
      <div className={styles.ticker} aria-live="polite">
        <span>No visitors yet — be the first explorer!</span>
      </div>
    );
  }

  const current = logs[index % logs.length];
  return (
    <div className={styles.ticker} aria-live="polite">
      <span key={current.id} className={styles.tickerText}>
        {current.visitorName} {current.action} in {current.world}
      </span>
    </div>
  );
}
