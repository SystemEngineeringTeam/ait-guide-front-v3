import styles from './index.module.scss';
import classNames from 'classnames';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <main className={classNames(styles.pagelayout, className)} {...props}>
      {children}
    </main>
  );
}
