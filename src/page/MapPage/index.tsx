import PageLayout from '@/layout/PageLayout';
import Map from '@/components/Map';
import BuildingPolygons from '@/components/BuildingsPolygon';
import { GEO_JSON_DATA } from '@/geojson';
import BottomSheet from '@/components/BottomSheet';

export default function MapPage() {
  return (
    <PageLayout>
      <Map>
        <BottomSheet>
          <p>hello</p>
        </BottomSheet>
        <BuildingPolygons data={GEO_JSON_DATA} />
      </Map>
    </PageLayout>
  );
}
