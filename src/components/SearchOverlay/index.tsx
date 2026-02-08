'use client';

import styles from './index.module.scss';
import FacilityList from './FacilityList';
import SearchResults from './SearchResults';
import { type OverlayKey, useOverlayEvent } from '@/hooks/useOverlay';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useRef } from 'react';
import Input from './Input';
import type { SelectedFacilityId, SetSelectedFacilityIdFn } from '@/hooks/useSelectedFacilityId';

interface Props {
  overlayKey: OverlayKey;
  isOpen: boolean;
  close: () => void;
  text: string;
  setText: (text: string) => void;
  selectedFacilityId: SelectedFacilityId;
  setSelectedFacilityId: SetSelectedFacilityIdFn;
}

export default function SearchOverlay({
  overlayKey,
  isOpen,
  close,
  text,
  setText,
  selectedFacilityId,
  setSelectedFacilityId,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useOverlayEvent(overlayKey, {
    onOpen: () => {
      inputRef.current?.focus();
    },
  });

  useKeyboardShortcut({
    onEscape: () => close(),
  });

  return (
    <div className={styles.overlay} data-open={isOpen}>
      <div className={styles.searchArea}>
        <div className={styles.inputWrapper}>
          <Input
            ref={inputRef}
            className={styles.input}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClear={() => setText('')}
            placeholder="教室名・建物名を入力"
            clearable
          />
        </div>

        {text.length == 0 ? (
          <FacilityList selectedId={selectedFacilityId} setSelectedId={setSelectedFacilityId} />
        ) : (
          <SearchResults setSelectedId={setSelectedFacilityId} />
        )}
      </div>
    </div>
  );
}
