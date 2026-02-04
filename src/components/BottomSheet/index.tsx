'use client';

import { Sheet } from 'react-modal-sheet';
import { useState } from 'react';

interface Props {
  children?: React.ReactNode;
}

export default function BottomSheet({ children }: Props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open sheet</button>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)} snapPoints={[0, 0.1, 0.2, 1]} initialSnap={2}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>{children}</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
