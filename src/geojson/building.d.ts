// src/geojson/building.d.ts

declare module '*/buildings/*.json' {
  import { FeatureCollection } from 'geojson';
  const value: FeatureCollection;
  export default value;
}

declare module '@/geojson/buildings/*.json' {
  import { FeatureCollection } from 'geojson';
  const value: FeatureCollection;
  export default value;
}
