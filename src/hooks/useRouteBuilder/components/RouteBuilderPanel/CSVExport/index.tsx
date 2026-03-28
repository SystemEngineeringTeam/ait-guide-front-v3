'use client';

import { useCSVExport } from '@/hooks/useRouteBuilder/hooks/useCSVIO';
import styles from './index.module.scss';
import PanelButton from '@/components/PanelButton';

export default function CSVExport() {
  const exportCSV = useCSVExport();

  return (
    <div className={styles.container}>
      <PanelButton emoji="📂" selected onClick={exportCSV}>
        エクスポート
      </PanelButton>
    </div>
  );
}
