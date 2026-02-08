'use client';

import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { ClearIcon, MapIcon, QuestionIcon, SearchIcon } from '@/components/Icons';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useOverlay } from '@/hooks/useOverlay';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppBar() {
  const { isSomeOpen, open, closeAll } = useOverlay('search');
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
        <IconButton<LinkProps> icon={<MapIcon />} className={styles.button} as={Link} href="/" onClick={closeAll}>
          <span>Map</span>
        </IconButton>

        <IconButton<LinkProps>
          icon={<QuestionIcon />}
          className={styles.button}
          as={Link}
          href="/help"
          onClick={closeAll}
        >
          <span>Help</span>
        </IconButton>

        {isSomeOpen ? (
          <IconButton icon={<ClearIcon />} className={styles.button} onClick={closeAll}>
            <span>Close</span>
          </IconButton>
        ) : (
          <IconButton icon={<SearchIcon />} className={styles.button} onClick={open}>
            <span>Search</span>
          </IconButton>
        )}
      </div>
    </div>
  );
}
