import { ID } from '@/utils/id';
import { Room, ROOMS } from './room';
import { FacilityId } from './facilityId';

export interface Clug {
  id: number;
  name: string;
  candidate?: string[];
  room?: Room;
}

const id = new ID();

export const CLUTUAL_CLUBS: Clug[] = [
  {
    id: id.get(),
    name: 'システム工学研究会',
    candidate: ['シス研', 'シスケン', 'sysken'],
    room: ROOMS[FacilityId.B4]['102'],
  },
  {
    id: id.get(),
    name: '管弦楽団',
    candidate: ['オーケストラ', 'AIT管弦楽団', 'オケ部', 'オケブ'],
    room: ROOMS[FacilityId.B9]['G3101'],
  },
  {
    id: id.get(),
    name: 'ギター部',
    room: ROOMS[FacilityId.B9]['G3101'],
  },
  {
    id: id.get(),
    name: '軽音楽部',
    room: ROOMS[FacilityId.CLUBHOUSE5]['201'],
  },
  {
    id: id.get(),
    name: 'フリーサウンドサークル',
    room: ROOMS[FacilityId.CLUBHOUSE5]['204'],
  },
  {
    id: id.get(),
    name: 'DTM部',
    room: ROOMS[FacilityId.CLUBHOUSE3]['105'],
  },
  {
    id: id.get(),
    name: 'なんくるないさ～くる',
    // 自由ヶ丘
  },
  {
    id: id.get(),
    name: '競技バンド部',
    room: ROOMS[FacilityId.B9]['G3101'],
  },
  {
    id: id.get(),
    name: '漫画動画研究会',
    room: ROOMS[FacilityId.CLUBHOUSE4]['204'],
  },
  {
    id: id.get(),
    name: '現代視覚文化研究会',
    room: ROOMS[FacilityId.CLUBHOUSE4]['200'],
  },
  {
    id: id.get(),
    name: 'サブカルチャー研究会',
    room: ROOMS[FacilityId.CLUBHOUSE3]['202'],
  },
  {
    id: id.get(),
    name: '土木研究会',
    room: ROOMS[FacilityId.CLUBHOUSE3]['107'],
  },
  {
    id: id.get(),
    name: 'レスキューロボット研究会',
    room: ROOMS[FacilityId.B2]['107'],
  },
  {
    id: id.get(),
    name: 'AIT学生フォーミュラ研究会',
    room: ROOMS[FacilityId.FORMULA_PREFAB]['学生フォーミュラ研究会'],
  },
  {
    id: id.get(),
    name: 'AITEP',
    room: ROOMS[FacilityId.ECO_POWER]['101'], // TODO: 要確認
  },
  {
    id: id.get(),
    name: 'Robot-Art',
    room: ROOMS[FacilityId.B2]['107'],
  },
  {
    id: id.get(),
    name: 'ASTRON',
    room: ROOMS[FacilityId.B6]['1032'],
  },
  {
    id: id.get(),
    name: 'AIT株式研究会 ～Beckoning Cat～',
    // 自由ヶ丘
  },
  {
    id: id.get(),
    name: '飛行ロボット研究会',
    room: ROOMS[FacilityId.B6]['1009'],
  },
  {
    id: id.get(),
    name: '建築研究会',
    // 随時指定
  },
  {
    id: id.get(),
    name: 'リノベサークル',
    // 現地
  },
  {
    id: id.get(),
    name: 'コンテンツクリエーションサークル',
    candidate: ['CCC'],
    room: ROOMS[FacilityId.CLUBHOUSE3]['207'],
  },
  {
    id: id.get(),
    name: 'CG制作部',
    room: ROOMS[FacilityId.CLUBHOUSE3]['101'],
  },
  {
    id: id.get(),
    name: 'SL 同好会',
    room: ROOMS[FacilityId.B12]['B101'],
  },
  {
    id: id.get(),
    name: 'マルチクリエイティブサークル',
    room: ROOMS[FacilityId.B1]['701'],
  },
  {
    id: id.get(),
    name: 'フィッシング部',
    room: ROOMS[FacilityId.B4]['105'],
  },
  {
    id: id.get(),
    name: '写真研究部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['108'],
  },
  {
    id: id.get(),
    name: '囲碁・将棋部',
    room: ROOMS[FacilityId.CLUBHOUSE3]['208'],
  },
  {
    id: id.get(),
    name: '鉄道研究部',
    room: ROOMS[FacilityId.CLUBHOUSE3]['103'],
  },
  {
    id: id.get(),
    name: '創作サークル',
    room: ROOMS[FacilityId.CLUBHOUSE4]['110'],
  },
  {
    id: id.get(),
    name: 'みらい工房物創りクラブ',
    room: ROOMS[FacilityId.CLUBHOUSE4]['103'],
  },
  {
    id: id.get(),
    name: "Cooking Community Circle「Hill's」",
    // 自由ヶ丘
  },
  {
    id: id.get(),
    name: '麻雀サークル',
    room: ROOMS[FacilityId.AIWA_KAIKAN]['101'],
  },
  {
    id: id.get(),
    name: '自由ヶ丘ボードゲームサークル',
    // 自由ヶ丘
  },
  {
    id: id.get(),
    name: 'e-Sports Community Circle',
    // 自由ヶ丘
  },
  {
    id: id.get(),
    name: 'ドローンサークル',
    room: ROOMS[FacilityId.CLUBHOUSE3]['104'],
  },
  {
    id: id.get(),
    name: '自由ヶ丘サウナサークル',
    // 自由ヶ丘
  },
] as const;

export const SPORTS_CLUBS: Clug[] = [
  {
    id: id.get(),
    name: '卓球部',
    room: ROOMS[FacilityId.GYM_MIN]['201'],
  },
  {
    id: id.get(),
    name: '硬式野球部',
    room: ROOMS[FacilityId.BASEBALL_FIELD]['野球場'],
  },
  {
    id: id.get(),
    name: 'フェンシング部',
    room: ROOMS[FacilityId.GYM_MIN]['101'],
  },
  {
    id: id.get(),
    name: '陸上競技部',
    room: ROOMS[FacilityId.PLAYGROUND_MANAGEMENT]['201'],
  },
  {
    id: id.get(),
    name: '競技スキー部',
    room: ROOMS[FacilityId.PLAYGROUND_MANAGEMENT]['202'],
  },
  {
    id: id.get(),
    name: 'ラグビー部',
    room: ROOMS[FacilityId.PLAYGROUND_MANAGEMENT]['205'],
  },
  {
    id: id.get(),
    name: '硬式テニス部',
    room: ROOMS[FacilityId.TENNIS_HOUSE]['105'],
  },
  {
    id: id.get(),
    name: 'ゴルフ部',
    room: ROOMS[FacilityId.GOLF]['ゴルフ練習場'],
  },
  {
    id: id.get(),
    name: 'バスケットボール部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['104'],
  },
  {
    id: id.get(),
    name: '洋弓部',
    room: ROOMS[FacilityId.GYM_MIN]['105'],
  },
  {
    id: id.get(),
    name: 'サッカー部',
    room: ROOMS[FacilityId.PLAYGROUND_MANAGEMENT]['204'],
  },
  {
    id: id.get(),
    name: 'バドミントン部',
    room: ROOMS[FacilityId.GYM]['211'],
  },
  {
    id: id.get(),
    name: 'ソフトテニス部',
    room: ROOMS[FacilityId.TENNIS_HOUSE]['104'],
  },
  {
    id: id.get(),
    name: 'バレーボール部',
    room: ROOMS[FacilityId.GYM]['211'],
  },
  {
    id: id.get(),
    name: '準硬式野球部',
    room: ROOMS[FacilityId.PLAYGROUND_MANAGEMENT]['203'],
  },
  {
    id: id.get(),
    name: 'ボウリング部',
    // 東名ボール
  },
  {
    id: id.get(),
    name: '基礎スキー部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['101'],
  },
  {
    id: id.get(),
    name: 'ヨット部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['111'],
  },
  {
    id: id.get(),
    name: '柔道部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['203'],
  },
  {
    id: id.get(),
    name: '剣道部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['205'],
  },
  {
    id: id.get(),
    name: '弓道部',
    room: ROOMS[FacilityId.KYUDO_HALL]['弓道場'],
  },
  {
    id: id.get(),
    name: '卓球同好会',
    room: ROOMS[FacilityId.CLUBHOUSE4]['100'],
  },
  {
    id: id.get(),
    name: '水泳部',
    // 愛知口論義運動公園
  },
  {
    id: id.get(),
    name: '社交ダンス部',
    // 愛知学院大学 日進キャンパス
  },
  {
    id: id.get(),
    name: '航空部',
    room: ROOMS[FacilityId.HANGAR]['格納庫'],
  },
  {
    id: id.get(),
    name: 'サバイバルゲーム部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['202'],
  },
  {
    id: id.get(),
    name: '自転車部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['107'],
  },
  {
    id: id.get(),
    name: 'スノーボード同好会',
    room: ROOMS[FacilityId.CLUBHOUSE4]['201'],
  },
  {
    id: id.get(),
    name: 'フットサル同好会',
    room: ROOMS[FacilityId.BALL_GAME_FIELD]['球技場'],
  },
  {
    id: id.get(),
    name: 'ソフトボール同好会',
    room: ROOMS[FacilityId.BALL_GAME_FIELD]['球技場'],
  },
  {
    id: id.get(),
    name: 'ボルダリングサークル',
    // プライマウンテン 名古屋IC店
  },
  {
    id: id.get(),
    name: 'ダンスサークル Pluse',
    room: ROOMS[FacilityId.CLUBHOUSE3]['108'],
  },
  {
    id: id.get(),
    name: 'ハンドボールサークル',
    room: ROOMS[FacilityId.CENTRAL_SQUARE]['広場'],
  },
  {
    id: id.get(),
    name: 'レーシングカート部',
    room: ROOMS[FacilityId.CLUBHOUSE4]['112'],
  },
  {
    id: id.get(),
    name: '自動車部',
    // 1号館別館裏のバス車庫
  },
  {
    id: id.get(),
    name: '二輪同好会',
    room: ROOMS[FacilityId.CLUBHOUSE4]['113'],
  },
];

export const CLUBS: Clug[] = [...CLUTUAL_CLUBS, ...SPORTS_CLUBS];
