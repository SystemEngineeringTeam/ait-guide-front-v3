import { ID } from '@/utils/id';
import { ROOM, ROOMS } from './room';
import { FacilityId } from './facilityId';

export interface CLUB {
  id: number;
  name: string;
  candidate?: string[];
  room?: ROOM;
}

const id = new ID();

export const CLUBS: CLUB[] = [
  {
    id: id.get(),
    name: 'システム工学研究会',
    candidate: ['シス研', 'シスケン', 'sysken'],
    room: ROOMS[FacilityId.B4]['102'],
  },
  {
    id: id.get(),
    name: '管弦楽団',
    room: ROOMS[FacilityId.CLUBHOUSE5]['101'],
  },
  {
    id: id.get(),
    name: 'ギター部',
    room: ROOMS[FacilityId.B9]['G3101'],
  },
  {
    id: id.get(),
    name: '軽音楽部',
  },
  {
    id: id.get(),
    name: 'フリーサウンドサークル',
  },
  {
    id: id.get(),
    name: 'DTM部',
  },
  {
    id: id.get(),
    name: 'なんくるないさ～くる',
  },
  {
    id: id.get(),
    name: '競技バンド部',
  },
  {
    id: id.get(),
    name: '漫画動画研究会',
  },
  {
    id: id.get(),
    name: '現代視覚文化研究会',
  },
  {
    id: id.get(),
    name: 'サブカルチャー研究会',
  },
  {
    id: id.get(),
    name: 'システム工学研究会',
  },
  {
    id: id.get(),
    name: '土木研究会',
  },
  {
    id: id.get(),
    name: 'レスキューロボット研究会',
  },
  {
    id: id.get(),
    name: 'AIT学生フォーミュラ研究会',
  },
  {
    id: id.get(),
    name: 'AITEP',
  },
  {
    id: id.get(),
    name: 'Robot-Art',
  },
  {
    id: id.get(),
    name: 'ASTRON',
  },
  {
    id: id.get(),
    name: 'AIT株式研究会 ～Beckoning Cat～',
  },
  {
    id: id.get(),
    name: '飛行ロボット研究会',
  },
  {
    id: id.get(),
    name: '建築研究会',
  },
  {
    id: id.get(),
    name: 'リノベサークル',
  },
  {
    id: id.get(),
    name: 'コンテンツクリエーションサークル',
  },
  {
    id: id.get(),
    name: 'CG制作部',
  },
  {
    id: id.get(),
    name: 'SL 同好会',
  },
  {
    id: id.get(),
    name: 'マルチクリエイティブサークル',
  },
  {
    id: id.get(),
    name: 'フィッシング部',
  },
  {
    id: id.get(),
    name: '写真研究部',
  },
  {
    id: id.get(),
    name: '囲碁・将棋部',
  },
  {
    id: id.get(),
    name: '鉄道研究部',
  },
  {
    id: id.get(),
    name: '創作サークル',
  },
  {
    id: id.get(),
    name: 'みらい工房物創りクラブ',
  },
  {
    id: id.get(),
    name: "Cooking Community Circle「Hill's」",
  },
  {
    id: id.get(),
    name: '麻雀サークル',
  },
  {
    id: id.get(),
    name: '自由ヶ丘ボードゲームサークル',
  },
  {
    id: id.get(),
    name: 'e-Sports Community Circle',
  },
  {
    id: id.get(),
    name: 'ドローンサークル',
  },
  {
    id: id.get(),
    name: '自由ヶ丘サウナサークル',
  },
] as const;
