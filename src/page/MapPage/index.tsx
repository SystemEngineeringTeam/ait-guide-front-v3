import PageLayout from '@/layout/PageLayout';
import Map from '@/components/Map';
import BuildingPolygons from '@/components/BuildingsPolygon';
import { GEO_JSON_DATA } from '@/geojson';

export default function MapPage() {
  return (
    <PageLayout>
      <Map>
        <BuildingPolygons data={GEO_JSON_DATA} />
      </Map>
    </PageLayout>
  );
}
