import PageLayout from '@/layout/PageLayout';
import styles from './index.module.scss';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PageLayout>
      <article className={styles.content}>{children}</article>
    </PageLayout>
  );
}
