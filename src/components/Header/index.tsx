import Link from 'next/link';
import styles from './index.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        <h1 className={styles.title}>AIT ガイド</h1>
        <p className={styles.createdBy}>created by シス研</p>
      </Link>
    </header>
  );
}
