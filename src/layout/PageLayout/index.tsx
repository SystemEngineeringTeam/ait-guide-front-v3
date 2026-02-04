import styles from './index.module.scss';
import classNames from 'classnames';
import AppBar from '@/components/AppBar';
import Overlay from '@/components/Overlay';
import SearchArea from '@/components/SearchArea';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <main className={classNames(styles.pagelayout, className)} {...props}>
      <Overlay>
        <SearchArea />
      </Overlay>
      {children}
      <AppBar />
    </main>
  );
}
