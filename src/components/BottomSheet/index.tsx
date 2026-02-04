'use client';

import { Sheet } from 'react-modal-sheet';

interface Props {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function BottomSheet({ children, open, onClose }: Props) {
  return (
    <Sheet isOpen={open} onClose={onClose} snapPoints={[0, 0.1, 0.2, 1]} initialSnap={2}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
