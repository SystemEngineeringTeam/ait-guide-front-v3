'use client';

import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { MapIcon, QuestionIcon, SearchIcon } from '@/components/Icons';
import { useOverlay } from '@/hooks/useOverlay';
import Link, { type LinkProps } from 'next/link';

export default function AppBar() {
  const { close, open } = useOverlay();

  return (
    <div className={styles.wrapper}>
      <div className={styles.appbar}>
        <IconButton<LinkProps> icon={<MapIcon />} as={Link} href="/" onClick={close}>
          <span>Map</span>
        </IconButton>

        <IconButton<LinkProps> icon={<QuestionIcon />} as={Link} href="/help" onClick={close}>
          <span>Help</span>
        </IconButton>

        <IconButton icon={<SearchIcon />} onClick={open}>
          <span>Search</span>
        </IconButton>
      </div>
    </div>
  );
}
