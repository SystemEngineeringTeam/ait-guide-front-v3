import { FacilityId } from "@/consts/facilityId";
import type { ReactElement } from "react";
import BusStopData from "./BusStopData";

export const FACILITY_DATA: Partial<Record<FacilityId, ReactElement>> = {
  [FacilityId.BUS_STOP]: <BusStopData />
};
