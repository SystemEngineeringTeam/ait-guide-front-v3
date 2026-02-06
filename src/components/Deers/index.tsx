import { COORD_NARA_PARK } from '@/consts/coords';
import styles from './index.module.scss';
import { Layer, Marker, Source } from 'react-map-gl/maplibre';
import { random } from '@/utils/random';
import type { CSSProperties } from 'react';
import classNames from 'classnames';

interface Props {
  num?: number;
  zoom?: number;
}

const MIN_ZOOM = 16;
const MIN_SIZE = 20;
const MIN_MOVE_SCALE = 1;

const deers = Array.from({ length: 50 }).map((_, i) => ({
  longitude: COORD_NARA_PARK[0] + random(-0.002 * i, 0.002 * i),
  latitude: COORD_NARA_PARK[1] + random(-0.002 * i, 0.002 * i),
  dx: random(100, 200),
  dy: random(-50, 50),
  duration: random(15, 60),
  delay: random(0, 4),
  step: random(6, 14),
  stepDuration: random(0.6, 1.2),
  direction: random(0, 1) < 0.5 ? -1 : 1,
}));

export default function Deers({ num = 100, zoom }: Props) {
  const dz = (zoom ?? MIN_ZOOM) - MIN_ZOOM;
  const scale = Math.pow(2, dz);
  const moveScale = MIN_MOVE_SCALE * scale;
  const size = MIN_SIZE * scale;

  return (
    <>
      {deers.slice(0, num).map((deer, i) => {
        const style: CSSProperties = {
          ['--fontsize' as string]: `${size}px`,
          ['--dx' as string]: `${deer.dx * moveScale}px`,
          ['--dy' as string]: `${deer.dy * moveScale}px`,
          ['--dur' as string]: `${deer.duration}s`,
          ['--delay' as string]: `${deer.delay}s`,
          ['--step' as string]: `${deer.step}px`,
          ['--step-dur' as string]: `${deer.stepDuration}s`,
          ['--direction' as string]: deer.direction,
        };
        return (
          <Marker longitude={deer.longitude} latitude={deer.latitude} anchor="bottom" key={i}>
            <div className={classNames(styles.deer)} style={style}>
              <div className={styles.message}>やあ</div>
              <span className={styles.deerWalk}>
                <span className={styles.deerIcon}>🦌</span>
              </span>
            </div>
          </Marker>
        );
      })}

      <Source
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: COORD_NARA_PARK,
              },
              properties: {
                label: '奈良公園',
              },
            },
          ],
        }}
      >
        <Layer
          type="symbol"
          layout={{
            'text-field': '奈良公園',
            'text-size': 20,
            'text-offset': [0, 0],
            'text-anchor': 'center',
          }}
          paint={{
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 2,
          }}
        />
      </Source>
    </>
  );
}
