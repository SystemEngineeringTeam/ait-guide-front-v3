'use client';

import styles from './index.module.scss';
import FacilityList from './FacilityList';
import SearchResults from './SearchResults';
import { useRef } from 'react';
import { useOverlayEvent } from '@/hooks/useOverlay';
import Input from './Input';

interface Props {
  text: string;
  setText: (text: string) => void;
}

export default function SearchArea({ text, setText }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useOverlayEvent({
    onOpen: () => {
      inputRef.current?.focus();
    },
  });

  return (
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

      {text.length == 0 ? <FacilityList /> : <SearchResults />}
    </div>
  );
}
