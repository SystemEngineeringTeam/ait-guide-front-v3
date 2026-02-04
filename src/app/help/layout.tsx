import styles from './index.module.scss';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <article className={styles.content}>{children}</article>;
}
