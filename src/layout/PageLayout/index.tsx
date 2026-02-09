import styles from './index.module.scss';
import classNames from 'classnames';
import AppBar from '@/components/AppBar';
import Penguin from '@/components/Penguin';
import RouteSummary from '@/components/RouteSummary';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hiddenAppBar?: boolean;
}

export default function PageLayout({ children, className, hiddenAppBar = false, ...props }: PageLayoutProps) {
  return (
    <>
      <main className={classNames(styles.pagelayout, className)} {...props}>
        {children}
        <Penguin />
        <RouteSummary />
        {!hiddenAppBar && <AppBar />}
      </main>
    </>
  );
}
