'use client';

import { useSearchText } from '@/hooks/useSearch';
import FacilityList from './FacilityList';
import SearchResults from './SearchResults';

export default function SearchArea() {
  const [searchText, setSearchText] = useSearchText();

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="教室名・建物名で検索"
      />

      {searchText.length == 0 ? <FacilityList /> : <SearchResults />}
    </div>
  );
}
