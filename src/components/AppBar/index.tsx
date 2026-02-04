import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { MapIcon, QuestionIcon, SearchIcon } from '@/components/Icons';
import Link, { type LinkProps } from 'next/link';

export default function AppBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.abbbar}>
        <IconButton<LinkProps> className={styles.iconButton} icon={<MapIcon />} as={Link} href="/">
          <span>Map</span>
        </IconButton>

        <IconButton<LinkProps> className={styles.iconButton} icon={<QuestionIcon />} as={Link} href="/help">
          <span>Help</span>
        </IconButton>

        <IconButton<LinkProps> className={styles.iconButton} icon={<SearchIcon />} as={Link} href="/search">
          <span>Search</span>
        </IconButton>
      </div>
    </div>
  );
}
