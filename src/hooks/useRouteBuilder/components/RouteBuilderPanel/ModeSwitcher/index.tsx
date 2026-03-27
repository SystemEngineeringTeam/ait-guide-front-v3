'use client';

import styles from './index.module.scss';
import PanelButton from '@/components/PanelButton';
import { useRouteMode } from '@/hooks/useRouteBuilder/hooks/useRouteMode';

interface Props {
  nodeMode: React.ReactNode;
  edgeMode: React.ReactNode;
}

export default function RouteModeSwitcher({ nodeMode, edgeMode }: Props) {
  const [mode, setMode] = useRouteMode();

  return (
    <div className={styles.modeSwitcher}>
      <div className={styles.buttons}>
        <PanelButton onClick={() => setMode('node')} emoji="📍" selected={mode === 'node'}>
          Node
        </PanelButton>
        <PanelButton onClick={() => setMode('edge')} emoji="🛣️" selected={mode === 'edge'}>
          Edge
        </PanelButton>
      </div>

      <div className={styles.content}>{mode === 'node' ? nodeMode : edgeMode}</div>
    </div>
  );
}
