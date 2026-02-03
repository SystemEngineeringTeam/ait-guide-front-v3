import styles from './index.module.scss';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <main className={styles.pagelayout}>{children}</main>;
}
