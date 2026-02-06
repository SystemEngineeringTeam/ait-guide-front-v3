import { FeatureCollection } from 'geojson';
import { GeoJSONFacilities } from '@/types/facilities';
import { FacilityId } from '@/consts/facilityId';
import { values } from '@/utils/object';
import b1 from './geojson/1.json';
import b2 from './geojson/2.json';
import b3 from './geojson/3.json';
import b3annex from './geojson/annex3.json';
import b4 from './geojson/4.json';
import b4annex from './geojson/annex4.json';
import b5 from './geojson/5.json';
import b6 from './geojson/6.json';
import b7 from './geojson/7.json';
import b8 from './geojson/8.json';
import b9 from './geojson/9.json';
import b10 from './geojson/10.json';
import b10old1 from './geojson/10-old1.json';
import b11 from './geojson/11.json';
import b12 from './geojson/12.json';
import b13 from './geojson/13.json';
import b14 from './geojson/14.json';
import bio from './geojson/bio.json';
import plaza from './geojson/plaza.json';
import aiwa from './geojson/aiwa.json';
import centralTerrace from './geojson/central-terrace.json';
import disasterCenter from './geojson/disaster-center.json';
import seirexCenter from './geojson/seirex-center.json';
import clubhouse3 from './geojson/clubhouse3.json';
import clubhouse4 from './geojson/clubhouse4.json';
import clubhouse5 from './geojson/clubhouse5.json';
import hangar from './geojson/hangar.json';
import kyudoHall from './geojson/kyudo-hall.json';
import golf from './geojson/golf.json';
import prefab from './geojson/prefab.json';
import tennisFieldManagementHouse from './geojson/tennis-field-management-house.json';
import playgroundManagement from './geojson/playground-management.json';
import vibration from './geojson/vibration.json';
import civilEngineeringArchitecture from './geojson/civil-engineering-architecture.json';
import centralGarden from './geojson/central-garden.json';
import centralSquare from './geojson/central-square.json';
import tennisCourt from './geojson/tennis-court.json';
import soccerField from './geojson/soccer-field.json';
import ballGameField from './geojson/ball-game-field.json';
import baseballField from './geojson/baseball-field.json';
import athleticsField from './geojson/athletics-field.json';
import archeryField from './geojson/archery-field.json';
import headquarters from './geojson/headquarters.json';
import headquarters1 from './geojson/headquarters1.json';
import headquarters2 from './geojson/headquarters2.json';
import research from './geojson/research.json';
import ecoPower from './geojson/eco-power.json';
import computer from './geojson/computer.json';
import information from './geojson/information.json';
import library from './geojson/library.json';
import gym from './geojson/gym.json';
import gymMin from './geojson/gym-min.json';
import parkingBike from './geojson/parking-bike.json';
import parking1 from './geojson/parking1.json';
import parking2 from './geojson/parking2.json';
import parking3 from './geojson/parking3.json';
import bus from './geojson/bus.json';
import busGetoffOnly from './geojson/bus-getoff-only.json';
import mainGate from './geojson/main-gate.json';
import securityRoom from './geojson/security-room.json';
import trainingDormitory from './geojson/training-dormitory.json';
import studentDormitory from './geojson/student-dormitory.json';
import internationalExchangeHall from './geojson/international-exchange-hall.json';
import dormitoryCafeteria from './geojson/dormitory-cafeteria.json';

export const FACILITIES_MAP: Record<FacilityId, GeoJSONFacilities> = {
  [FacilityId.B1]: {
    id: FacilityId.B1,
    type: 'academic',
    name: '1号館',
    data: b1 as FeatureCollection,
  },
  [FacilityId.B2]: {
    id: FacilityId.B2,
    type: 'academic',
    name: '2号館',
    data: b2 as FeatureCollection,
  },
  [FacilityId.B3]: {
    id: FacilityId.B3,
    type: 'academic',
    name: '3号館',
    data: b3 as FeatureCollection,
  },
  [FacilityId.B3_ANNEX]: {
    id: FacilityId.B3_ANNEX,
    type: 'academic',
    name: '3号館別館',
    data: b3annex as FeatureCollection,
  },
  [FacilityId.B4]: {
    id: FacilityId.B4,
    type: 'academic',
    name: '4号館',
    data: b4 as FeatureCollection,
  },
  [FacilityId.B4_ANNEX]: {
    id: FacilityId.B4_ANNEX,
    type: 'academic',
    name: '4号館別館',
    data: b4annex as FeatureCollection,
  },
  [FacilityId.B5]: {
    id: FacilityId.B5,
    type: 'academic',
    name: '5号館講義実験棟',
    data: b5 as FeatureCollection,
  },
  [FacilityId.B6]: {
    id: FacilityId.B6,
    type: 'academic',
    name: '6号館',
    data: b6 as FeatureCollection,
  },
  [FacilityId.B7]: {
    id: FacilityId.B7,
    type: 'academic',
    name: '7号館',
    data: b7 as FeatureCollection,
  },
  [FacilityId.B8]: {
    id: FacilityId.B8,
    type: 'academic',
    name: '8号館',
    data: b8 as FeatureCollection,
  },
  [FacilityId.B9]: {
    id: FacilityId.B9,
    type: 'academic',
    name: '9号館',
    data: b9 as FeatureCollection,
  },
  [FacilityId.B10]: {
    id: FacilityId.B10,
    type: 'academic',
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  [FacilityId.B10_OLD1]: {
    id: FacilityId.B10_OLD1,
    type: 'academic',
    name: '10号館・旧1号館',
    data: b10old1 as FeatureCollection,
  },
  [FacilityId.B11]: {
    id: FacilityId.B11,
    type: 'academic',
    name: '11号館',
    data: b11 as FeatureCollection,
  },
  [FacilityId.B12]: {
    id: FacilityId.B12,
    type: 'academic',
    name: '12号館',
    data: b12 as FeatureCollection,
  },
  [FacilityId.B13]: {
    id: FacilityId.B13,
    type: 'academic',
    name: '13号館',
    data: b13 as FeatureCollection,
  },
  [FacilityId.B14]: {
    id: FacilityId.B14,
    type: 'academic',
    name: '14号館',
    data: b14 as FeatureCollection,
  },
  [FacilityId.BIO]: {
    id: FacilityId.BIO,
    type: 'academic',
    name: 'バイオ環境化学実験棟',
    data: bio as FeatureCollection,
  },
  [FacilityId.AIT_PLAZA]: {
    id: FacilityId.AIT_PLAZA,
    type: 'cafeteria',
    name: 'AITプラザ',
    data: plaza as FeatureCollection,
  },
  [FacilityId.AIWA_KAIKAN]: {
    id: FacilityId.AIWA_KAIKAN,
    type: 'cafeteria',
    name: '愛和会館',
    candidate: ['愛和食堂'],
    data: aiwa as FeatureCollection,
  },
  [FacilityId.CENTRAL_TERRACE]: {
    id: FacilityId.CENTRAL_TERRACE,
    type: 'cafeteria',
    name: 'セントラルテラス',
    candidate: ['セントレア'],
    data: centralTerrace as FeatureCollection,
  },
  [FacilityId.CLUBHOUSE3]: {
    id: FacilityId.CLUBHOUSE3,
    type: 'clubhouse',
    name: '第3クラブハウス',
    data: clubhouse3 as FeatureCollection,
  },
  [FacilityId.CLUBHOUSE4]: {
    id: FacilityId.CLUBHOUSE4,
    type: 'clubhouse',
    name: '第4クラブハウス',
    data: clubhouse4 as FeatureCollection,
  },
  [FacilityId.CLUBHOUSE5]: {
    id: FacilityId.CLUBHOUSE5,
    type: 'clubhouse',
    name: '第5クラブハウス',
    data: clubhouse5 as FeatureCollection,
  },
  [FacilityId.HANGAR]: {
    id: FacilityId.HANGAR,
    type: 'clubhouse',
    name: '格納庫',
    data: hangar as FeatureCollection,
  },
  [FacilityId.FORMULA_PREFAB]: {
    id: FacilityId.FORMULA_PREFAB,
    type: 'clubhouse',
    name: 'プレハブ',
    data: prefab as FeatureCollection,
  },
  [FacilityId.TENNIS_HOUSE]: {
    id: FacilityId.TENNIS_HOUSE,
    type: 'clubhouse',
    name: '庭球場管理ハウス',
    data: tennisFieldManagementHouse as FeatureCollection,
  },
  [FacilityId.KYUDO_HALL]: {
    id: FacilityId.KYUDO_HALL,
    type: 'clubhouse',
    name: '弓道場',
    data: kyudoHall as FeatureCollection,
  },
  [FacilityId.GOLF]: {
    id: FacilityId.GOLF,
    type: 'clubhouse',
    name: 'ゴルフ練習場',
    data: golf as FeatureCollection,
  },
  [FacilityId.PLAYGROUND_MANAGEMENT]: {
    id: FacilityId.PLAYGROUND_MANAGEMENT,
    type: 'clubhouse',
    name: '総合運動場管理棟',
    data: playgroundManagement as FeatureCollection,
  },
  [FacilityId.DISASTER_CENTER]: {
    id: FacilityId.DISASTER_CENTER,
    type: 'other',
    name: '地域防災研究センター',
    data: disasterCenter as FeatureCollection,
  },
  [FacilityId.SEIREX_CENTER]: {
    id: FacilityId.SEIREX_CENTER,
    type: 'other',
    name: '耐震実験センター',
    data: seirexCenter as FeatureCollection,
  },
  [FacilityId.VIBRATION]: {
    id: FacilityId.VIBRATION,
    type: 'other',
    name: '振動実験棟',
    data: vibration as FeatureCollection,
  },
  [FacilityId.CEA]: {
    id: FacilityId.CEA,
    type: 'other',
    name: '土木・建築実験棟',
    candidate: ['2号館実験棟'],
    data: civilEngineeringArchitecture as FeatureCollection,
  },
  [FacilityId.HEADQUARTERS]: {
    id: FacilityId.HEADQUARTERS,
    type: 'other',
    name: '本部棟',
    data: headquarters as FeatureCollection,
  },
  [FacilityId.HEADQUARTERS1]: {
    id: FacilityId.HEADQUARTERS1,
    type: 'other',
    name: '第1本部棟',
    data: headquarters1 as FeatureCollection,
  },
  [FacilityId.HEADQUARTERS2]: {
    id: FacilityId.HEADQUARTERS2,
    type: 'other',
    name: '第2本部棟',
    data: headquarters2 as FeatureCollection,
  },
  [FacilityId.RESEARCH]: {
    id: FacilityId.RESEARCH,
    type: 'other',
    name: '総合技術研究所',
    data: research as FeatureCollection,
  },
  [FacilityId.ECO_POWER]: {
    id: FacilityId.ECO_POWER,
    type: 'other',
    name: 'エコ電力研究センター',
    data: ecoPower as FeatureCollection,
  },
  [FacilityId.COMPUTER]: {
    id: FacilityId.COMPUTER,
    type: 'other',
    name: '計算センター',
    data: computer as FeatureCollection,
  },
  [FacilityId.INFORMATION]: {
    id: FacilityId.INFORMATION,
    type: 'other',
    name: '情報教育センター',
    data: information as FeatureCollection,
  },
  [FacilityId.LIBRARY]: {
    id: FacilityId.LIBRARY,
    type: 'other',
    name: '図書館',
    data: library as FeatureCollection,
  },
  [FacilityId.CENTRAL_GARDEN]: {
    id: FacilityId.CENTRAL_GARDEN,
    type: 'ground',
    name: 'セントラルガーデン',
    data: centralGarden as FeatureCollection,
  },
  [FacilityId.CENTRAL_SQUARE]: {
    id: FacilityId.CENTRAL_SQUARE,
    type: 'ground',
    name: 'セントラル広場',
    data: centralSquare as FeatureCollection,
  },
  [FacilityId.TENNIS_COURT]: {
    id: FacilityId.TENNIS_COURT,
    type: 'ground',
    name: 'テニスコート',
    data: tennisCourt as FeatureCollection,
  },
  [FacilityId.SOCCER_FIELD]: {
    id: FacilityId.SOCCER_FIELD,
    type: 'ground',
    name: 'サッカー場',
    data: soccerField as FeatureCollection,
  },
  [FacilityId.BALL_GAME_FIELD]: {
    id: FacilityId.BALL_GAME_FIELD,
    type: 'ground',
    name: '球技場',
    data: ballGameField as FeatureCollection,
  },
  [FacilityId.BASEBALL_FIELD]: {
    id: FacilityId.BASEBALL_FIELD,
    type: 'ground',
    name: '野球場',
    data: baseballField as FeatureCollection,
  },
  [FacilityId.ATHLETICS_FIELD]: {
    id: FacilityId.ATHLETICS_FIELD,
    type: 'ground',
    name: '陸上競技場',
    data: athleticsField as FeatureCollection,
  },
  [FacilityId.ARCHERY_FIELD]: {
    id: FacilityId.ARCHERY_FIELD,
    type: 'ground',
    name: 'アーチェリー場',
    data: archeryField as FeatureCollection,
  },
  [FacilityId.GYM]: {
    id: FacilityId.GYM,
    type: 'gym',
    name: '鉀徳館',
    candidate: ['体育館'],
    data: gym as FeatureCollection,
  },
  [FacilityId.GYM_MIN]: {
    id: FacilityId.GYM_MIN,
    type: 'gym',
    name: '小体育館',
    data: gymMin as FeatureCollection,
  },
  [FacilityId.PARKING1]: {
    id: FacilityId.PARKING1,
    type: 'parking',
    name: '第1学生駐車場',
    data: parking1 as FeatureCollection,
  },
  [FacilityId.PARKING2]: {
    id: FacilityId.PARKING2,
    type: 'parking',
    name: '第2学生駐車場',
    data: parking2 as FeatureCollection,
  },
  [FacilityId.PARKING3]: {
    id: FacilityId.PARKING3,
    type: 'parking',
    name: '第3学生駐車場',
    data: parking3 as FeatureCollection,
  },
  [FacilityId.PARKING_BIKE]: {
    id: FacilityId.PARKING_BIKE,
    type: 'parking',
    name: 'バイク駐車場',
    data: parkingBike as FeatureCollection,
  },
  [FacilityId.BUS_STOP]: {
    id: FacilityId.BUS_STOP,
    type: 'parking',
    name: 'バス停',
    data: bus as FeatureCollection,
  },
  [FacilityId.BUS_STOP_GETOFF_ONLY]: {
    id: FacilityId.BUS_STOP_GETOFF_ONLY,
    type: 'parking',
    name: 'バス停(降車専用)',
    data: busGetoffOnly as FeatureCollection,
  },
  [FacilityId.MAIN_GATE]: {
    id: FacilityId.MAIN_GATE,
    type: 'other',
    name: '正門',
    data: mainGate as FeatureCollection,
  },
  [FacilityId.SECURITY_ROOM]: {
    id: FacilityId.SECURITY_ROOM,
    type: 'other',
    name: '警備室',
    candidate: ['守衛室'],
    data: securityRoom as FeatureCollection,
  },
  [FacilityId.TRAINING_DORMITORY]: {
    id: FacilityId.TRAINING_DORMITORY,
    type: 'other',
    name: '合宿寮',
    data: trainingDormitory as FeatureCollection,
  },
  [FacilityId.STUDENT_DORMITORY]: {
    id: FacilityId.STUDENT_DORMITORY,
    type: 'other',
    name: '学生寮',
    data: studentDormitory as FeatureCollection,
  },
  [FacilityId.INTERNATIONAL_EXCHANGE_HALL]: {
    id: FacilityId.INTERNATIONAL_EXCHANGE_HALL,
    type: 'other',
    name: '国際交流会館',
    data: internationalExchangeHall as FeatureCollection,
  },
  [FacilityId.DORMITORY_CAFETERIA]: {
    id: FacilityId.DORMITORY_CAFETERIA,
    type: 'cafeteria',
    name: '寮食堂',
    data: dormitoryCafeteria as FeatureCollection,
  },
};

export const GEO_JSON_FACILITIES = values(FACILITIES_MAP);
