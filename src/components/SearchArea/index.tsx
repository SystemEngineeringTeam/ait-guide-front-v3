"use client";

import { useState } from "react";
import FacilityList from "./FacilityList";

export default function SearchArea() {
  const [searchText, setSearchText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="教室名・建物名で検索"
      />

      <FacilityList />
    </div>
  );
}
