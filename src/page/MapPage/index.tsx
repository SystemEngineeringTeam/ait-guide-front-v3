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
  const [selectedId, setSelectedId] = useState<string>();
  const [hoverId, setHoverId] = useState<string>();

  const onClickFeature: HandleClickFeatureFn = useCallback((id) => {
    setSelectedId(id);
    setOpen(true);
  }, []);

  const onBottomSheetClose = useCallback(() => {
    setOpen(false);
    setSelectedId(undefined);
  }, []);

  return (
    <PageLayout>
      <Map onClickFeature={onClickFeature} onHoverFeature={setHoverId}>
        <BuildingPolygons data={GEO_JSON_DATA} />
        {selectedId && <BuildingHighlight id={selectedId} key={`select-${selectedId}`} outline fill />}
        {hoverId && <BuildingHighlight id={hoverId} key={`hover-${hoverId}`} outline />}
      </Map>

      <BottomSheet open={open} onClose={onBottomSheetClose}>
        <BuildingData id={selectedId} />
      </BottomSheet>
    </PageLayout>
  );
}
