import { LinkIcon, RouteIcon } from '@/components/Icons';
import styles from './index.module.scss';
import IconButton from '@/components/IconButton';
import { GeoJSONFacilities } from '@/types/facilities';
import { useCallback } from 'react';
import { useDestinationId, useRouteLoading } from '@/hooks/useRoute';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import Spinner from '@/components/Spinner';
import { errorToast, infoToast } from '@/utils/toast';

interface Props {
  facility: GeoJSONFacilities;
}

export default function FacilityDataHeader({ facility }: Props) {
  const [destinationId, setDestinationId] = useDestinationId();
  const isLoading = useRouteLoading();

  const handleClickRoute = useCallback(() => {
    if (facility?.id) setDestinationId(facility.id);
  }, [facility?.id, setDestinationId]);

  useKeyboardShortcut({
    onRouteSearch: () => handleClickRoute(),
  });

  const copyLink = useCallback(
    () => () => {
      if (facility.id == undefined) {
        errorToast('施設が選択されていません');
        return;
      }

      const url = new URL('/', window.location.href);
      url.searchParams.set('toId', facility.id.toString());
      navigator.clipboard.writeText(url.toString());
      infoToast('共有リンクをコピーしました');
    },
    [],
  );

  return (
    <h2 className={styles.header}>
      <span className={styles.name}>{facility.name}</span>

      <div className={styles.buttons}>
        <IconButton
          icon={isLoading ? <Spinner className={styles.icon} /> : <RouteIcon className={styles.icon} />}
          onClick={handleClickRoute}
          className={styles.iconButton}
          data-active={destinationId === facility.id}
        >
          経路
        </IconButton>
        <IconButton
          icon={<LinkIcon className={styles.icon} />}
          onClick={copyLink()}
          className={styles.iconButton}
          data-active={destinationId === facility.id}
        >
          共有
        </IconButton>
      </div>
    </h2>
  );
}
