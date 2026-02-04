'use client';

import PageLayout from '@/layout/PageLayout';
import Map, { HandleClickFeatureFn } from '@/components/Map';
import BuildingPolygons from '@/components/BuildingsPolygon';
import { GEO_JSON_DATA } from '@/consts/buildings';
import BottomSheet from '@/components/BottomSheet';
import { useCallback, useState } from 'react';
import BuildingHighlight from '@/components/BuildingHighlight';
import BuildingData from '@/components/BuildingData';

export default function MapPage() {
  const [open, setOpen] = useState(false);
  const [featureId, setFeatureId] = useState<string>();

  const onClickFeature: HandleClickFeatureFn = useCallback((id) => {
    setFeatureId(id);
    setOpen(true);
  }, []);

  const onBottomSheetClose = useCallback(() => {
    setOpen(false);
    setFeatureId(undefined);
  }, []);

  return (
    <PageLayout>
      <Map onClickFeature={onClickFeature}>
        <BuildingPolygons data={GEO_JSON_DATA} />
        {featureId && <BuildingHighlight id={featureId} key={featureId} />}
      </Map>

      <BottomSheet open={open} onClose={onBottomSheetClose}>
        <BuildingData id={featureId} />
      </BottomSheet>
    </PageLayout>
  );
}
