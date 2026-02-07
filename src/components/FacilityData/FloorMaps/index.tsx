import { useMemo, useState } from 'react';
import { FloorImages, FloorName } from '@/types/facilities';
import styles from './index.module.scss';
import { entries } from '@/utils/object';
import Button from '@/components/Button';
import { StaticImageData } from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface Floor {
  name: FloorName;
  img: StaticImageData;
}

interface Props {
  floorImages: FloorImages;
}

export default function FloorMaps({ floorImages }: Props) {
  const floors: Floor[] = useMemo(
    () =>
      entries(floorImages)
        .map((f) => ({ name: f[0], img: f[1] }))
        .sort((fa, fb) => {
          const toOrder = (name: string) => {
            // B = マイナス階
            if (name.startsWith('B')) return -Number(name.slice(1));
            // M = 同じ階の少し後ろ
            if (name.startsWith('M')) return Number(name.slice(1)) + 0.5;
            // 通常階
            return Number(name);
          };

          return toOrder(fa.name) - toOrder(fb.name);
        }),
    [floorImages],
  );
  const [activeFloor, setActiveFloor] = useState<Floor | undefined>(floors.at(0));

  if (floors.length === 0 || !activeFloor) return null;

  return (
    <div className={styles.floorMaps}>
      {activeFloor && (
        <div id={`floor-panel-${activeFloor.name}`} role="tabpanel" className={styles.floorSection}>
          <h3 className={styles.floorHeader}>{activeFloor.name}F フロアマップ</h3>

          <div
            className={styles.floorImageWrapper}
            // BottomSheet のスクロールとの競合対策
            onPointerDownCapture={(e) => e.stopPropagation()}
            onTouchStartCapture={(e) => e.stopPropagation()}
            onWheelCapture={(e) => e.stopPropagation()}
          >
            <TransformWrapper>
              <TransformComponent>
                <img src={activeFloor.img.src} alt={`フロア ${activeFloor.name}F の見取り図`} />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}

      <div className={styles.tabs} role="tablist" aria-label="フロア選択">
        {floors.map((floor) => (
          <Button key={floor.name} role="tab" onClick={() => setActiveFloor(floor)} data-active={floor === activeFloor}>
            {floor.name}F
          </Button>
        ))}
      </div>
    </div>
  );
}
