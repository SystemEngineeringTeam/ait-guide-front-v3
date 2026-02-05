'use client';

import styles from './index.module.scss';
import { useSearchText } from '@/hooks/useSearch';
import FacilityList from './FacilityList';
import SearchResults from './SearchResults';
import { useRef } from 'react';
import { useOverlayEvent } from '@/hooks/useOverlay';
import Input from './Input';

export default function SearchArea() {
  const [searchText, setSearchText] = useSearchText();
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
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText('')}
          placeholder="教室名・建物名を入力"
          clearable
        />
      </div>

      {searchText.length == 0 ? <FacilityList /> : <SearchResults />}
    </div>
  );
}
