'use client';

import Link from 'next/link';
import styles from '@/styles/components.module.css';

interface Props {
  color: 'gold' | 'red' | 'teal';
  onClick?: () => void;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function RetroButton({
  color,
  onClick,
  href,
  size = 'md',
  children,
  disabled,
  type = 'button',
}: Props) {
  const sizeClass =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const cls = `${styles.retroBtn} ${styles[color]} ${sizeClass}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
