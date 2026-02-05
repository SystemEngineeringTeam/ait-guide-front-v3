import { FeatureCollection } from 'geojson';
import { GeoJSONFacilities } from '@/types/facilities';
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

export const GEO_JSON_FACILITIES: GeoJSONFacilities[] = [
  {
    id: '1',
    type: 'academic',
    name: '1号館',
    data: b1 as FeatureCollection,
  },
  {
    id: '4',
    type: 'academic',
    name: '2号館',
    data: b2 as FeatureCollection,
  },
  {
    id: '5',
    type: 'academic',
    name: '3号館',
    data: b3 as FeatureCollection,
  },
  {
    id: '6',
    type: 'academic',
    name: '3号館別館',
    data: b3annex as FeatureCollection,
  },
  {
    id: '8',
    type: 'academic',
    name: '4号館',
    data: b4 as FeatureCollection,
  },
  {
    id: '9',
    type: 'academic',
    name: '4号館別館',
    data: b4annex as FeatureCollection,
  },
  {
    id: '10',
    type: 'academic',
    name: '5号館講義実験棟',
    data: b5 as FeatureCollection,
  },
  {
    id: '11',
    type: 'academic',
    name: '6号館',
    data: b6 as FeatureCollection,
  },
  {
    id: '12',
    type: 'academic',
    name: '7号館',
    data: b7 as FeatureCollection,
  },
  {
    id: '13',
    type: 'academic',
    name: '8号館',
    data: b8 as FeatureCollection,
  },
  {
    id: '14',
    type: 'academic',
    name: '9号館',
    data: b9 as FeatureCollection,
  },
  {
    id: '15',
    type: 'academic',
    name: '10号館',
    data: b10 as FeatureCollection,
  },
  {
    id: '16',
    type: 'academic',
    name: '10号館・旧1号館',
    data: b10old1 as FeatureCollection,
  },
  {
    id: '17',
    type: 'academic',
    name: '11号館',
    data: b11 as FeatureCollection,
  },
  {
    id: '18',
    type: 'academic',
    name: '12号館',
    data: b12 as FeatureCollection,
  },
  {
    id: '19',
    type: 'academic',
    name: '13号館',
    data: b13 as FeatureCollection,
  },
  {
    id: '20',
    type: 'academic',
    name: '14号館',
    data: b14 as FeatureCollection,
  },
  {
    id: '7',
    type: 'academic',
    name: 'バイオ環境化学実験棟',
    data: bio as FeatureCollection,
  },
  {
    id: '33',
    type: 'cafeteria',
    name: 'AITプラザ',
    data: plaza as FeatureCollection,
  },
  {
    id: '32',
    type: 'cafeteria',
    name: '愛和会館',
    data: aiwa as FeatureCollection,
  },
  {
    id: '34',
    type: 'cafeteria',
    name: 'セントラルテラス',
    data: centralTerrace as FeatureCollection,
  },
  {
    id: '38',
    type: 'clubhouse',
    name: '第3クラブハウス',
    data: clubhouse3 as FeatureCollection,
  },
  {
    id: '39',
    type: 'clubhouse',
    name: '第4クラブハウス',
    data: clubhouse4 as FeatureCollection,
  },
  {
    id: '40',
    type: 'clubhouse',
    name: '第5クラブハウス',
    data: clubhouse5 as FeatureCollection,
  },
  {
    id: '41',
    type: 'clubhouse',
    name: '庭球場管理ハウス',
    data: tennisFieldManagementHouse as FeatureCollection,
  },
  {
    id: '36',
    type: 'clubhouse',
    name: '総合運動場管理棟',
    data: playgroundManagement as FeatureCollection,
  },
  {
    id: '27',
    type: 'other',
    name: '地域防災研究センター',
    data: disasterCenter as FeatureCollection,
  },
  {
    id: '25',
    name: '耐震実験センター',
    type: 'other',
    data: seirexCenter as FeatureCollection,
  },
  {
    id: '26',
    name: '振動実験棟',
    type: 'other',
    data: vibration as FeatureCollection,
  },
  {
    id: '3',
    type: 'other',
    name: '土木・建築実験棟',
    data: civilEngineeringArchitecture as FeatureCollection,
  },
  {
    id: '29',
    type: 'other',
    name: '本部棟',
    data: headquarters as FeatureCollection,
  },
  {
    id: '30',
    type: 'other',
    name: '第1本部棟',
    data: headquarters1 as FeatureCollection,
  },
  {
    id: '31',
    type: 'other',
    name: '第2本部棟',
    data: headquarters2 as FeatureCollection,
  },
  {
    id: '24',
    type: 'other',
    name: '総合技術研究所',
    data: research as FeatureCollection,
  },
  {
    id: '28',
    type: 'other',
    name: 'エコ電力研究センター',
    data: ecoPower as FeatureCollection,
  },
  {
    id: '22',
    type: 'other',
    name: '計算センター',
    data: computer as FeatureCollection,
  },
  {
    id: '23',
    type: 'other',
    name: '情報教育センター',
    data: information as FeatureCollection,
  },
  {
    id: '21',
    type: 'other',
    name: '図書館',
    data: library as FeatureCollection,
  },
  {
    id: 'todo:central-garden',
    type: 'ground',
    name: 'セントラルガーデン',
    data: centralGarden as FeatureCollection,
  },
  {
    id: '42',
    type: 'ground',
    name: 'セントラル広場',
    data: centralSquare as FeatureCollection,
  },
  {
    id: '44',
    type: 'ground',
    name: 'テニスコート',
    data: tennisCourt as FeatureCollection,
  },
  {
    id: '45',
    type: 'ground',
    name: 'サッカー場',
    data: soccerField as FeatureCollection,
  },
  {
    id: '53',
    type: 'ground',
    name: '球技場',
    data: ballGameField as FeatureCollection,
  },
  {
    id: '54',
    type: 'ground',
    name: '野球場',
    data: baseballField as FeatureCollection,
  },
  {
    id: '52',
    type: 'ground',
    name: '陸上競技場',
    data: athleticsField as FeatureCollection,
  },
  {
    id: '51',
    type: 'ground',
    name: 'アーチェリー場',
    data: archeryField as FeatureCollection,
  },
  {
    id: '35',
    type: 'gym',
    name: '鉀徳館',
    data: gym as FeatureCollection,
  },
  {
    id: '37',
    type: 'gym',
    name: '小体育館',
    data: gymMin as FeatureCollection,
  },
  {
    id: '46',
    type: 'parking',
    name: '第1学生駐車場',
    data: parking1 as FeatureCollection,
  },
  {
    id: '47',
    type: 'parking',
    name: '第2学生駐車場',
    data: parking2 as FeatureCollection,
  },
  {
    id: '48',
    type: 'parking',
    name: '第3学生駐車場',
    data: parking3 as FeatureCollection,
  },
  {
    id: '43',
    type: 'parking',
    name: 'バイク駐車場',
    data: parkingBike as FeatureCollection,
  },
];
