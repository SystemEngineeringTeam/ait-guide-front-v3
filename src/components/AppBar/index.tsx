'use client';

import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { MapIcon, QuestionIcon, SearchIcon } from '@/components/Icons';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useOverlay } from '@/hooks/useOverlay';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppBar() {
  const { open, closeAll } = useOverlay('search');
  const router = useRouter();

  useKeyboardShortcut({
    onMap: () => {
      closeAll();
      router.push('/');
    },
    onHelp: () => {
      closeAll();
      router.push('/help');
    },
    onSearch: () => open(),
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.appbar}>
        <IconButton<LinkProps> icon={<MapIcon />} as={Link} href="/" onClick={closeAll}>
          <span>Map</span>
        </IconButton>

        <IconButton<LinkProps> icon={<QuestionIcon />} as={Link} href="/help" onClick={closeAll}>
          <span>Help</span>
        </IconButton>

        <IconButton icon={<SearchIcon />} onClick={open}>
          <span>Search</span>
        </IconButton>
      </div>
    </div>
  );
}
