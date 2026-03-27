import { GEO_JSON_FACILITIES } from '@/consts/facilities';
import styles from './index.module.scss';
import Map from '@/components/Map';
import FacilitiesPolygons from '@/components/FacilityPolygons';
import EntranceMarkers from '@/components/EntranceMarkers';
import FacilityNames from '@/components/FacilitiesNames';
import { GEO_JSON_PASSAGES } from '@/consts/passages';
import { GEO_JSON_ENTRANCES } from '@/consts/entrances';

export default function RouteBuildPage() {
  return (
    <Map className={styles.map} minZoom={16} maxZoom={24} dragRotate={false}>
      <FacilitiesPolygons facilities={[...GEO_JSON_FACILITIES, ...GEO_JSON_PASSAGES]} />
      <EntranceMarkers entrances={GEO_JSON_ENTRANCES} />
      <FacilityNames facilities={GEO_JSON_FACILITIES} />
    </Map>
  );
}
