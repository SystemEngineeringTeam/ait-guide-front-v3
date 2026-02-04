'use client';

import { useCallback, useRef, useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import SheetHeader from './SheetHeader';

interface Props {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

const SNAP_POINTS = [0, 0.1, 0.2, 1];

export default function BottomSheet({ children, open, onClose }: Props) {
  const sheetRef = useRef<SheetRef>(null);
  const [up, setUp] = useState(true);

  const handleSnap = useCallback((snapIndex: number) => {
    const snap = SNAP_POINTS[snapIndex];
    setUp(snap <= 0.5);
  }, []);

  const handleHeaderClick = useCallback(
    (up: boolean) => {
      if (up) sheetRef.current?.snapTo(3);
      else sheetRef.current?.snapTo(1);
    },
    [onClose],
  );

  return (
    <Sheet
      ref={sheetRef}
      isOpen={open}
      onClose={onClose}
      onSnap={handleSnap}
      snapPoints={SNAP_POINTS}
      initialSnap={2}
      tweenConfig={{
        duration: 0.4,
        ease: 'easeInOut',
      }}
    >
      <Sheet.Container>
        <Sheet.Header>
          <SheetHeader up={up} onClick={handleHeaderClick} />
        </Sheet.Header>
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
