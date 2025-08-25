import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("../components/LeafletMap"), { ssr: false });

// 星ごとの象意リスト（固定）
const STAR_KEYWORDS = {
  本命星: {
    label: "本命星（基本的な性格、才能、適性、運勢）",
    keywords: [
      "《色》 赤 青 黄",
      "《味》 甘い 苦い 塩辛い 酸っぱい 渋い",
      "《体》 頭 胸 腹 手 足",
      "《方位》 東 西 南 北",
      "《時間》 朝 昼 夕 夜 深夜",
      "《自然》 山 川 海",
      "《人物》 父 母 子供 友人 師匠",
      "《その他》 家 本 車 音 音楽 言葉 技術 芸術 仕事 学問 運動 食べ物 飲み物 感情 喜び 悲しみ 怒り 驚き 健康 病気 成功 失敗 愛 恋 家族 友情 金銭 幸運 不運 未来 過去"
    ]
  },
  月命星: {
    label: "月命星（内面的な性格、才能、適性、運勢）",
    keywords: [
      "《色》 白 黒 紫",
      "《味》 甘い 苦い 辛い 酸っぱい 渋い",
      "《体》 頭 心臓 背中 手 足",
      "《方位》 東北 東南 西北 西南",
      "《時間》 朝 昼 夕 夜 深夜",
      "《自然》 空 雲 森",
      "《人物》 父 母 兄弟 姉妹 友人",
      "《その他》 家 机 椅子 本 パソコン スマホ 技術 芸術 仕事 学問 運動 食べ物 飲み物 感情 喜び 悲しみ 怒り 驚き 健康 病気 成功 失敗 愛 恋 家族 友情 金銭 幸運 不運 未来 過去"
    ]
  },
  傾斜星: {
    label: "傾斜星（思考傾向、潜在能力、潜在願望）",
    keywords: [
      "《色》 緑 茶 灰",
      "《味》 甘い 苦い 塩辛い 酸っぱい 渋い",
      "《体》 頭 目 耳 鼻 口",
      "《方位》 東 西 南 北",
      "《時間》 朝 昼 夕 夜 深夜",
      "《自然》 花 草 風",
      "《人物》 父 母 子供 恋人 師匠",
      "《その他》 家 音 言葉 音楽 技術 芸術 仕事 学問 運動 食べ物 飲み物 感情 喜び 悲しみ 怒り 驚き 健康 病気 成功 失敗 愛 恋 家族 友情 金銭 幸運 不運 未来 過去"
    ]
  },
  同会星: {
    label: "同会星（縁のある場所、環境、人、事象）",
    keywords: [
      "《色》 金 銀 桃",
      "《味》 甘い 苦い 辛い 酸っぱい 渋い",
      "《体》 頭 肩 腰 手 足",
      "《方位》 東南 西南 東北 西北",
      "《時間》 朝 昼 夕 夜 深夜",
      "《自然》 海 砂漠 雪",
      "《人物》 父 母 子供 上司 部下",
      "《その他》 家 机 椅子 本 車 パソコン スマホ 技術 芸術 仕事 学問 運動 食べ物 飲み物 感情 喜び 悲しみ 怒り 驚き 健康 病気 成功 失敗 愛 恋 家族 友情 金銭 幸運 不運 未来 過去"
    ]
  }
};
// 九星別 象意リスト（固定／《色》《味》《体》《方位》《時間》《自然》《人物》《その他》）
// 各行は《カテゴリ》 + 全角スペース区切り（見やすさ重視）
// 例：合計で50語程度になるよう「その他」を多めにしています（色は3語／自然は3語）
const STAR_SEMANTICS = {
  "一白水星": [
    "《色》 白 黒 青",
    "《味》 塩味 さっぱり 清涼",
    "《体》 腎臓 耳 血液",
    "《方位》 北",
    "《時間》 深夜 子の刻",
    "《自然》 水 雨 霧",
    "《人物》 研究者 調停役 情報通",
    "《その他》 洞察 直感 隠れた才能 柔軟性 秘密 データ 企画 調査 交渉 浄化 再生 流れ 移動 適応 感性 静寂 内省 受容 連絡 橋渡し 調和 変化 思索 余裕 慎重 統合 柔和 透明 感受性"
  ],
  "二黒土星": [
    "《色》 茶 黒 黄",
    "《味》 甘味 優しい 滋味",
    "《体》 脾 胃 肌",
    "《方位》 南西",
    "《時間》 夕刻 未申の刻",
    "《自然》 田畑 大地 盆地",
    "《人物》 裏方 育て役 経理",
    "《その他》 母性 献身 実直 忍耐 謙虚 収納 維持 土台 生活 家庭 支援 同調 調理 手仕事 農業 保守 反復 蓄積 穏当 誠実 信頼 介護 均衡 現実 主婦 堅実 管理 根気 継続 受容 安定 協働"
  ],
  "三碧木星": [
    "《色》 緑 青 黄緑",
    "《味》 酸味 フレッシュ さわやか",
    "《体》 肝 神経 筋",
    "《方位》 東",
    "《時間》 早朝 卯の刻",
    "《自然》 春 雷 芽吹き",
    "《人物》 起業家 発信者 広報",
    "《その他》 スタート 拡張 企画 発明 音 声 明るさ 俊敏 学習 情報 拡散 コミュ力 成長 新規 挑戦 ひらめき PR 発表 交友 旅行 行動力 先駆け 宣伝 変革 前進 ユーモア 好奇心 連絡 促進"
  ],
  "四緑木星": [
    "《色》 緑 黄緑 白",
    "《味》 酸味 軽やか さっぱり",
    "《体》 肺 呼吸 皮膚",
    "《方位》 南東",
    "《時間》 午前 辰巳の刻",
    "《自然》 風 田園 樹海",
    "《人物》 調整役 セールス 仲介",
    "《その他》 信用 人脈 交渉 和合 拡大 旅 移動 柔軟 協調 口コミ 取引 流通 貿易 ネットワーク 融合 配慮 和らぎ 風通し 会談 合意 穏便 伝達 紹介 調律 伸長 交流 婚姻 仲裁"
  ],
  "五黄土星": [
    "《色》 黄 茶 金",
    "《味》 甘味 濃厚 大地の味",
    "《体》 脾胃 中央 生命力",
    "《方位》 中央",
    "《時間》 正午 中陽",
    "《自然》 大地 中央 荒野",
    "《人物》 中心者 統率者 監督",
    "《その他》 中核 牽引 力量 カリスマ 変革 破壊と再生 吸引力 主導 決断 規律 影響力 職権 転換 粘り 居座り 集中 司令塔 包容 まとめ役 覇気 重厚 規模 威厳 土俵 根幹 権威 要"
  ],
  "六白金星": [
    "《色》 白 銀 クリーム",
    "《味》 辛味 キレ すっきり",
    "《体》 肺 骨 皮膚",
    "《方位》 北西",
    "《時間》 夕夜 戌亥の刻",
    "《自然》 高原 金属 乾燥",
    "《人物》 リーダー 役職者 指揮官",
    "《その他》 標準 規範 品位 高潔 採用 組織 役職 運営 統制 企画力 計画 公的 名誉 表彰 指導 目標 志 顧客 上位 洗練 均衡 研鑽 役目 評価 契約 公正 公務 仕上げ 品質"
  ],
  "七赤金星": [
    "《色》 桃 金 白",
    "《味》 甘味 コク 芳醇",
    "《体》 口 舌 咽喉",
    "《方位》 西",
    "《時間》 夕方 酉の刻",
    "《自然》 夕陽 収穫 華やぎ",
    "《人物》 アーティスト 接客 楽しませ役",
    "《その他》 喜び 収入 飲食 娯楽 交際 美容 装飾 華やか ユーモア 余暇 祝宴 催事 嗜好 媒体 口コミ パフォーマンス 魅力 愛嬌 軽妙 甘受 社交 感謝 商売 接待 会食 笑顔 余裕"
  ],
  "八白土星": [
    "《色》 ベージュ 茶 白",
    "《味》 甘味 発酵 深み",
    "《体》 背中 関節 骨格",
    "《方位》 北東",
    "《時間》 早朝 丑寅の刻",
    "《自然》 山 岩 土塀",
    "《人物》 継承者 守成 家主",
    "《その他》 変化 止動 節目 相続 継承 改築 蓄財 不動産 受け継ぐ 断捨離 固める 規約 改訂 節度 住居 玄関 門 引越し 結束 終了 開始 境目 仕切り 収納 要所 切替 慎重"
  ],
  "九紫火星": [
    "《色》 赤 紫 朱",
    "《味》 苦味 スパイス 香り",
    "《体》 目 心 神経",
    "《方位》 南",
    "《時間》 正午 午の刻",
    "《自然》 太陽 光 熱",
    "《人物》 クリエイター 先生 評論家",
    "《その他》 明晰 発見 評判 名声 表舞台 研究 表現 直観 美 文章 映像 学問 発表 広報 知名度 速断 才覚 企画 展示 照明 熱意 先見 ひらめき 才能 輝き 情熱"
  ],
};

// 九星ごとの象意（カテゴリ別・表示用）— まずは一白水星のみ実装。残りは順次追加します。
const NINE_STAR_KEYWORDS = {
  "一白水星": {
    色: "白 透明 藍",
    味: "塩味 さっぱり みずみずしい ひんやり さわやか うす味 つるん 清涼 淡麗 軽快",
    体: "腎臓 泌尿器 耳 冷え 代謝 水分循環 休息 デトックス うるおい 静養",
    方位: "北",
    時間: "夜半 深夜 冬の夜 閑静 静寂 休止",
    自然: "水 湖 霧",
    人物: "研究者 セラピスト 相談役 聴き上手 調停役 裏方 職人 学者 司書 思索家",
    その他:
      "流動 柔軟 潜在 直感 秘密 慎重 企画 温存 内省 水回り 清潔 透明感 涼感 静けさ 奥ゆかしさ 受容 吸収 洗浄 純化 クール ネイビー ガラス ミネラル 標本 アーカイブ データ分析 リスニング ヒーリング リカバリー 省エネ 安静 静観 水槽 アクア 霜 夜光 しっとり 穏和 気配 余白 氷結 波紋 連携 柔和 滑らか 流線 すべすべ"
  },

  // 以下は枠だけ用意（順次中身を埋めます）
  "二黒土星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "三碧木星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "四緑木星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "五黄土星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "六白金星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "七赤金星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "八白土星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
  "九紫火星":   { 色:"", 味:"", 体:"", 方位:"", 時間:"", 自然:"", 人物:"", その他:"" },
};

/**
 * 運勢デザイン v0.7（最新版・統合版）
 * 変更点：
 * - 友達タブ（追加/一覧/詳細/削除）を実装
 * - 方位タブは Leaflet 地図で表示（中心ピンあり）
 * - 既存の UI/各タブ（ホーム/日・月・年/性格）を維持
 * - LocalStorage：
 *   - プロフィール: "unsei-design-profile"
 *   - 友達一覧:     "unsei-design-friends"
 */

const SHOW_ACCENT_PICKER = false;

// --- Theme presets (sample looks) --------------------------------------
// THEME を 'stylish' | 'clean' | 'minimal' | 'trend' に切り替えるだけで
// 見た目サンプルを即確認できます（再読み込みで反映）。
const THEME = 'clean';

const THEMES = {
  stylish: {
    '--bg': '#f6f7f9',
    '--surface': '#ffffff',
    '--border': '#dfe3e8',
    '--accent': '#2F6CF0',
    '--text': '#1f2937',
    '--text-muted': '#6b7280',
    '--radius': '14px',
    '--shadow': '0 4px 16px rgba(17,24,39,.06)',
    '--focus': 'rgba(60,87,104,.35)',
  },
  clean: {
    '--bg': '#f9fafb',
    '--surface': '#ffffff',
    '--border': '#e5e7eb',
    '--accent': '#3C5768',
    '--text': '#111827',
    '--text-muted': '#6b7280',
    '--radius': '12px',
    '--shadow': '0 2px 10px rgba(0,0,0,.04)',
    '--focus': 'rgba(54,82,117,.28)',
  },
  minimal: {
    '--bg': '#ffffff',
    '--surface': '#ffffff',
    '--border': '#eeeeee',
    '--accent': '#2f2f2f',
    '--text': '#1a1a1a',
    '--text-muted': '#7a7a7a',
    '--radius': '10px',
    '--shadow': '0 1px 6px rgba(0,0,0,.05)',
    '--focus': 'rgba(0,0,0,.25)',
  },
  trend: {
    '--bg': '#f7f7ff',
    '--surface': '#ffffff',
    '--border': '#e6e7ff',
    '--accent': '#6C5CE7', // 少し彩度高め
    '--text': '#120f33',
    '--text-muted': '#6c6b8a',
    '--radius': '16px',
    '--shadow': '0 6px 22px rgba(108,92,231,.12)',
    '--focus': 'rgba(108,92,231,.28)',
  },
};

// 起動時に CSS 変数を :root に適用（既存UIを壊さない安全版）
if (typeof window !== 'undefined') {
  const vars = THEMES[THEME] || THEMES.clean;
  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }
}


// ---- 基本スタイル ----
const appClass =
  "min-h-screen bg-[#F2F4F6] text-neutral-800 antialiased selection:bg-neutral-900 selection:text-white";
const panelClass = "rounded-2xl border border-neutral-200 bg-white";
const labelClass = "text-xs tracking-wide text-neutral-600 font-light";
const titleClass = "text-lg font-medium";
const h1Class = "text-2xl font-semibold tracking-tight";

// ---- 共通ユーティリティ ----
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const fmtDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const fmtWithWeekday = (d) => `${fmtDate(d)}（${WEEKDAYS[d.getDay()]}）`;
const addDays = (d, days) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

const approxSetsu = (year) => [
  { key: "小寒", date: new Date(year, 0, 5) },
  { key: "立春", date: new Date(year, 1, 4) },
  { key: "啓蟄", date: new Date(year, 2, 6) },
  { key: "清明", date: new Date(year, 3, 5) },
  { key: "立夏", date: new Date(year, 4, 5) },
  { key: "芒種", date: new Date(year, 5, 6) },
  { key: "小暑", date: new Date(year, 6, 7) },
  { key: "立秋", date: new Date(year, 7, 7) },
  { key: "白露", date: new Date(year, 8, 8) },
  { key: "寒露", date: new Date(year, 9, 8) },
  { key: "立冬", date: new Date(year, 10, 7) },
  { key: "大雪", date: new Date(year, 11, 7) },
];

const monthRangeSetsu = (base) => {
  const y = base.getFullYear(),
    prev = approxSetsu(y - 1).slice(-1),
    curr = approxSetsu(y),
    next = approxSetsu(y + 1).slice(0, 1);
  const all = [...prev, ...curr, ...next].map((x) => x.date).sort((a, b) => a - b);
  let start = all[0],
    end = all[all.length - 1];
  for (let i = 0; i < all.length - 1; i++) {
    if (all[i] <= base && base < all[i + 1]) {
      start = all[i];
      end = addDays(all[i + 1], -1);
      break;
    }
  }
  return `${fmtDate(start)} 〜 ${fmtDate(end)}`;
};
const yearRangeSetsu = (base) => {
  const y = base.getFullYear(),
    r = approxSetsu(y).find((s) => s.key === "立春").date,
    next = approxSetsu(y + 1).find((s) => s.key === "立春").date;
  return `${fmtDate(r)} 〜 ${fmtDate(addDays(next, -1))}`;
};
const seasonRangesSetsu = (base) => {
  const y = base.getFullYear(),
    rs = approxSetsu(y).find((s) => s.key === "立春").date,
    rk = approxSetsu(y).find((s) => s.key === "立夏").date;
  const ra = approxSetsu(y).find((s) => s.key === "立秋").date,
    rt = approxSetsu(y).find((s) => s.key === "立冬").date,
    nextRs = approxSetsu(y + 1).find((s) => s.key === "立春").date;
  return [
    { name: "春", start: fmtDate(rs), end: fmtDate(addDays(rk, -1)) },
    { name: "夏", start: fmtDate(rk), end: fmtDate(addDays(ra, -1)) },
    { name: "秋", start: fmtDate(ra), end: fmtDate(addDays(rt, -1)) },
    { name: "冬", start: fmtDate(rt), end: fmtDate(addDays(nextRs, -1)) },
  ];
};

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const HOURS = [
  "5:00-7:00",
  "7:00-9:00",
  "9:00-11:00",
  "11:00-13:00",
  "13:00-15:00",
  "15:00-17:00",
  "17:00-19:00",
  "19:00-21:00",
];
const PALETTE = {
  c1: "#566a76",
  c2: "#3C5768",
  c3: "#595757",
  c4: "#898989",
  c5: "#b5b5b6",
  c6: "#d3d3d3",
  c7: "#f3d12f",
};
const COLORS = ["ブラック", "ホワイト", "グレー", "ネイビー", "ティール", "ボルドー", "オリーブ", "ラベンダー"];
const ITEMS = ["細身のペン", "レザー手帳", "シルバーリング", "スニーカー", "名刺ケース", "ブレスレット", "スカーフ", "時計"];
const PLACES = ["静かなカフェ", "図書館", "神社仏閣", "川沿い", "美術館", "公園", "展望", "自宅ワークスペース"];
const PERSONS = ["年上の女性", "年上の男性", "同年代の友人", "後輩", "家族", "恩師", "初対面", "オンラインの知人"];
const FOODS = ["おにぎり", "サンドイッチ", "味噌汁", "パスタ", "サラダ", "カレー", "蕎麦", "和菓子"];

// ---- ダミー算出（簡易ロジックで見た目確認用） ----
function seededIndex(seed, mod) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return Math.abs(h) % mod;
}
const HEAVENLY = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const FIVE = ["木", "火", "土", "金", "水"];

function dummyMainStar(dateStr) {
  const n = dateStr.replace(/-/g, "").split("").reduce((a, b) => a + Number(b), 0);
  return n % 9 || 9;
}
function nineStarName(n) {
  return ["一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星", "六白金星", "七赤金星", "八白土星", "九紫火星"][((n - 1) % 9 + 9) % 9];
}
function dummyMonthStar(seed) {
  return seededIndex(seed + "month-star", 9) + 1;
}
function dummyKeisha(seed) {
  return ["南傾斜", "北傾斜", "東傾斜", "西傾斜", "傾斜なし"][seededIndex(seed + "keisha", 5)];
}
function dummyDoukai(seed) {
  return nineStarName(seededIndex(seed + "same", 9) + 1);
}
function dummyHiDoukai(seed) {
  return nineStarName(seededIndex(seed + "anti", 9) + 1);
}

function dummyPillars(seed) {
  const ys = HEAVENLY[seededIndex(seed + "y", 10)],
    yb = EARTHLY[seededIndex(seed + "Y", 12)];
  const ms = HEAVENLY[seededIndex(seed + "m", 10)],
    mb = EARTHLY[seededIndex(seed + "M", 12)];
  const ds = HEAVENLY[seededIndex(seed + "d", 10)],
    db = EARTHLY[seededIndex(seed + "D", 12)];
  const hs = HEAVENLY[seededIndex(seed + "h", 10)],
    hb = EARTHLY[seededIndex(seed + "H", 12)];
  const pillars = { year: ys + yb, month: ms + mb, day: ds + db, hour: hs + hb };
  const fiveCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  [ys, ms, ds, hs].forEach((s) => {
    fiveCount[FIVE[HEAVENLY.indexOf(s) % 5]]++;
  });
  const dominant = Object.entries(fiveCount).sort((a, b) => b[1] - a[1])[0][0];
  return { pillars, fiveCount, dominant };
}

function genParagraph(seed) {
  const base = [
    "今日は基礎を丁寧に整えるほど成果が積み上がる運気です。",
    "人との関わり合いからヒントが生まれやすく、挨拶や短い会話にも価値があります。",
    "新しい挑戦は小さく始め、早めに方向修正できる余白を用意しておくと安心です。",
    "情報の選別と下調べが鍵。時間を決めて集中すると、迷いが減り判断が明瞭になります。",
    "感謝や労いの言葉を伝えると運が循環し、協力者が自然と集まってきます。",
    "過去のメモや写真を見返すとヒントが見つかる暗示。積み残しの案件にも光が差します。",
    "無理をせず休息を挟むことで発想が更新され、結果的に効率が上がります。",
  ];
  const i = seededIndex(seed, base.length);
  const t =
    base[i] +
    base[(i + 1) % base.length] +
    base[(i + 2) % base.length] +
    "小さな達成を言語化して自信に変えると、次の一歩が軽くなります。丁寧さと誠実さが評価される日。焦らず、目の前のことを一つずつ仕上げましょう。";
  return t.slice(0, 320);
}

const CATEGORY_KEYS = ["総合運", "仕事運", "対人運", "金運", "恋愛運"];
function buildResultBySeed(dob, seed) {
  return CATEGORY_KEYS.map((k, idx) => {
    const s = `${dob}-${seed}-${k}-${idx}-${dummyMainStar(dob)}`;
    const score100 = seededIndex(s, 101); // 0..100
    return {
      key: k,
      score100,
      text: genParagraph(s),
      luck: {
        color: COLORS[seededIndex(s + "c", COLORS.length)],
        item: ITEMS[seededIndex(s + "i", ITEMS.length)],
        place: PLACES[seededIndex(s + "p", PLACES.length)],
        person: PERSONS[seededIndex(s + "r", PERSONS.length)],
        food: FOODS[seededIndex(s + "f", FOODS.length)],
        time: HOURS[seededIndex(s + "t", HOURS.length)],
        dir: DIRECTIONS[seededIndex(s + "d", DIRECTIONS.length)],
      },
    };
  });
}

// ---- UI部品 ----
function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-neutral-100 border border-neutral-300 p-3">
      <div className={labelClass}>{label}</div>
      <div className="mt-1 text-sm leading-7">{value}</div>
    </div>
  );
}

function ScoreBar({ score }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full" style={{ width: `${score}%`, backgroundColor: "var(--accent)" }} />
      </div>
      <div className="w-14 text-right text-sm tabular-nums font-medium">{score} / 100</div>
    </div>
  );
}

function CategoryCard({ c }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-medium">{c.key}</div>
      </div>
      <ScoreBar score={c.score100} />
      <p className="mt-2 text-sm leading-7 text-neutral-700">{c.text}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Info label="ラッキーカラー" value={c.luck.color} />
        <Info label="ラッキーアイテム" value={c.luck.item} />
        <Info label="ラッキープレイス" value={c.luck.place} />
        <Info label="ラッキーパーソン" value={c.luck.person} />
        <Info label="ラッキーフード" value={c.luck.food} />
        <Info label="良い時間帯／方角" value={`${c.luck.time} ／ ${c.luck.dir}`} />
      </div>
    </div>
  );
}

function BasisTable({ seed }) {
  const { pillars, fiveCount, dominant } = useMemo(() => dummyPillars(seed), [seed]);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300">
      <table className="w-full text-sm">
        <tbody>
          <tr className="bg-neutral-50">
            <td className="p-2 w-32 text-neutral-500">命式（四柱）</td>
            <td className="p-2">
              年：{pillars.year} ／ 月：{pillars.month} ／ 日：{pillars.day} ／ 時：
              {pillars.hour}
            </td>
          </tr>
          <tr>
            <td className="p-2 text-neutral-500">十干</td>
            <td className="p-2">
              年：{pillars.year[0]} ／ 月：{pillars.month[0]} ／ 日：{pillars.day[0]} ／ 時：
              {pillars.hour[0]}
            </td>
          </tr>
          <tr className="bg-neutral-50">
            <td className="p-2 text-neutral-500">十二支</td>
            <td className="p-2">
              年：{pillars.year[1]} ／ 月：{pillars.month[1]} ／ 日：{pillars.day[1]} ／ 時：
              {pillars.hour[1]}
            </td>
          </tr>
          <tr>
            <td className="p-2 text-neutral-500">五行バランス</td>
            <td className="p-2">
              木:{fiveCount["木"]} 火:{fiveCount["火"]} 土:{fiveCount["土"]} 金:{fiveCount["金"]} 水:
              {fiveCount["水"]}（主：{dominant}）
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BasicInfoCard({ dob, base, place, gender }) {
  const mainNum = useMemo(() => (dob ? dummyMainStar(dob) : 9), [dob]);
  const main = nineStarName(mainNum);
  const monthNum = useMemo(() => (dob ? dummyMonthStar(dob) : 1), [dob]);
  const month = nineStarName(monthNum);
  const keisha = useMemo(() => dummyKeisha(dob + place + gender), [dob, place, gender]);
  const sameYear = useMemo(() => dummyDoukai(dob + fmtDate(base) + "Y"), [dob, base]);
  const antiYear = useMemo(() => dummyHiDoukai(dob + fmtDate(base) + "Y"), [dob, base]);
  const sameMonth = useMemo(() => dummyDoukai(dob + fmtDate(base) + "M"), [dob, base]);
  const antiMonth = useMemo(() => dummyHiDoukai(dob + fmtDate(base) + "M"), [dob, base]);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
      <div className="mb-2 text-base font-medium text-neutral-700 sm:text-sm" data-testid="basic-info-title">基本情報（簡易）</div>
          
      <div className="grid gap-2 sm:grid-cols-2">
        <Info label="本命星" value={`${main}（${mainNum}）`} />
        <Info label="月命星" value={`${month}（${monthNum}）`} />
        <Info label="傾斜" value={keisha} />
        <Info label="年同会/被同会" value={`${sameYear}／${antiYear}`} />
        <Info label="月同会/被同会" value={`${sameMonth}／${antiMonth}`} />
      </div>
      <p className="mt-2 text-xs text-neutral-500">※ 算出は仮ロジックです（本実装で精密化します）。</p>
    </div>
  );
}

// 遁甲盤（八方位）
function DunjiaCompass({ luckyDirs = [], unluckyDirs = [], tendo, saiha }) {
  const size = 260,
    r = 100,
    cx = size / 2,
    cy = size / 2;
  const toRad = (deg) => (deg * Math.PI) / 180,
    centerAngle = (i) => -90 + i * 45;
  const wedgePath = (i) => {
    const start = toRad(centerAngle(i) - 22.5),
      end = toRad(centerAngle(i) + 22.5);
    const sx = cx + Math.cos(start) * r,
      sy = cy + Math.sin(start) * r,
      ex = cx + Math.cos(end) * r,
      ey = cy + Math.sin(end) * r;
    const laf = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${laf} 1 ${ex} ${ey} Z`;
  };
  const markAt = (dir, color, radius = r + 14, sizePx = 6) => {
    const i = DIRECTIONS.indexOf(dir);
    if (i < 0) return null;
    const a = toRad(centerAngle(i)),
      x = cx + Math.cos(a) * radius,
      y = cy + Math.sin(a) * radius;
    return <circle key={`m-${dir}-${color}`} cx={x} cy={y} r={sizePx} fill={color} stroke="#fff" strokeWidth={2} />;
  };
  const isLucky = (d) => luckyDirs.includes(d),
    isUnlucky = (d) => unluckyDirs.includes(d);
  const luckyFill = "rgba(60,87,104,0.22)",
    luckyStroke = PALETTE.c2,
    unluckyFill = "rgba(137,137,137,0.22)",
    unluckyStrk = PALETTE.c4;
  const tendoColor = PALETTE.c7,
    saihaColor = PALETTE.c1;

  return (
    <svg width={size} height={size} className="mx-auto block">
      <circle cx={cx} cy={cy} r={r + 12} fill="#fff" stroke={PALETTE.c6} />
      {DIRECTIONS.map((d, i) => {
        const fill = isLucky(d) ? luckyFill : isUnlucky(d) ? unluckyFill : "#f8fafc";
        const stroke = isUnlucky(d) ? unluckyStrk : isLucky(d) ? luckyStroke : PALETTE.c6;
        return <path key={`w-${d}`} d={wedgePath(i)} fill={fill} stroke={stroke} strokeWidth={1.5} />;
      })}
      {DIRECTIONS.map((d, i) => {
        const a = (Math.PI / 180) * centerAngle(i),
          x = cx + Math.cos(a) * r,
          y = cy + Math.sin(a) * r;
        return (
          <g key={`g-${d}`}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={PALETTE.c6} />
            <text
              x={cx + Math.cos(a) * (r + 26)}
              y={cy + Math.sin(a) * (r + 26)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill={PALETTE.c3}
            >
              {d}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={3} fill={PALETTE.c5} />
      {tendo && markAt(tendo, tendoColor, r + 16, 7)}
      {saiha && markAt(saiha, saihaColor, r + 16, 5)}
      {/* 凡例 */}
      <g transform={`translate(${cx - 80}, ${cy + r + 36})`}>
        <rect x={0} y={-12} width={160} height={26} fill="#fff" stroke={PALETTE.c6} rx={6} />
        <circle cx={12} cy={1} r={5} fill={luckyStroke} />
        <text x={22} y={5} fontSize={11} fill={PALETTE.c3}>
          吉方位
        </text>
        <circle cx={72} cy={1} r={5} fill={unluckyStrk} />
        <text x={82} y={5} fontSize={11} fill={PALETTE.c3}>
          凶方位
        </text>
      </g>
      <g transform={`translate(${cx - 80}, ${cy + r + 64})`}>
        <rect x={0} y={-12} width={160} height={26} fill="#fff" stroke={PALETTE.c6} rx={6} />
        <circle cx={12} cy={1} r={5} fill={PALETTE.c7} />
        <text x={22} y={5} fontSize={11} fill={PALETTE.c3}>
          天道
        </text>
        <circle cx={72} cy={1} r={5} fill={PALETTE.c1} />
        <text x={82} y={5} fontSize={11} fill={PALETTE.c3}>
          歳破
        </text>
      </g>
    </svg>
  );
}

// 簡易 天道/歳破
function dummyTendoDir(seed) {
  return DIRECTIONS[seededIndex(seed + "TEN", 8)];
}
function dummySaihaDir(seed) {
  return DIRECTIONS[seededIndex(seed + "SAI", 8)];
}
function prioritizedTendoSaiha(date) {
  const ySeed = String(date.getFullYear()),
    mSeed = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    dSeed = fmtDate(date);
  return {
    tendo: dummyTendoDir(ySeed) || dummyTendoDir(mSeed) || dummyTendoDir(dSeed),
    saiha: dummySaihaDir(ySeed) || dummySaihaDir(mSeed) || dummySaihaDir(dSeed),
  };
}

// ミニカレンダー
function MiniCalendar({ value, onChange }) {
  const year = value.getFullYear(),
    month = value.getMonth();
  const first = new Date(year, month, 1),
    startW = first.getDay(),
    days = new Date(year, month + 1, 0).getDate();
  const prev = () =>
    onChange(new Date(year, month - 1, Math.min(value.getDate(), new Date(year, month, 0).getDate())));
  const next = () =>
    onChange(new Date(year, month + 1, Math.min(value.getDate(), new Date(year, month + 2, 0).getDate())));
  const cells = [];
  for (let i = 0; i < startW; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-3">
      <div className="mb-2 flex items-center justify-between">
        <button className="rounded border border-neutral-300 px-2 py-1 text-xs" onClick={prev}>
          ←
        </button>
        <div className="text-sm font-medium">
          {year}年 {month + 1}月
        </div>
        <button className="rounded border border-neutral-300 px-2 py-1 text-xs" onClick={next}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-500 mb-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d ? (
            <button
              key={i}
              onClick={() => onChange(d)}
              className={`rounded p-2 text-xs ${
                fmtDate(d) === fmtDate(value) ? "text-white" : "text-neutral-700"
              }`}
              style={{
                backgroundColor: fmtDate(d) === fmtDate(value) ? "var(--accent)" : "#fff",
                border: "1px solid #d4d4d8",
              }}
            >
              {d.getDate()}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>
    </div>
  );
}

// ---- dev tests ----
function runDevTests() {
  const y = 2025,
    t = new Date("2025-08-11T00:00:00+09:00");
  console.assert(approxSetsu(y).length === 12, "setsu 12");
  console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(monthRangeSetsu(t)), "month fmt");
  console.assert(seasonRangesSetsu(t).length === 4, "4 seasons");
  console.assert(nineStarName(1) === "一白水星" && nineStarName(9) === "九紫火星", "9star map");
  const s = buildResultBySeed("1990-01-01", "seed");
  console.assert(s.length === 5 && s.every((v) => v.score100 >= 0 && v.score100 <= 100), "100 score");
}
if (typeof window !== "undefined") {
  try {
    runDevTests();
  } catch (e) {
    console.error(e);
  }
}

// =====================
//  ルートコンポーネント
// =====================
export default function App() {
  // 登録
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState("未選択");
  const [registered, setRegistered] = useState(false);
  // 未登録のときは初期表示を友達タブへ寄せる（ホームに「はじめに」が混ざらないように）
  useEffect(() => { if (!registered) setTab("friends"); }, [registered]);// UI
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());

  // 友達
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [friendForm, setFriendForm] = useState({
    name: "",
    dob: "",
    time: "12:00",
    place: "",
    gender: "未選択",
  });

  
  // 友達一覧：検索＋並び順
  const [friendSearch, setFriendSearch] = useState("");
  const [friendSort, setFriendSort] = useState("登録順");
// 保存済みプロフィール読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem("unsei-design-profile");
      if (saved) {
        const p = JSON.parse(saved);
        setDob(p.dob || "");
        setEmail(p.email || "");
        setNick(p.nick || "");
        setTime(p.time || "12:00");
        setPlace(p.place || "");
        setGender(p.gender || "未選択");
        if (p.dob) setRegistered(true);
      }
    } catch {}
  }, []);
  // 友達の検索並び順の保存/復元
  useEffect(() => {
    try {
      const s = localStorage.getItem("unsei-design-friendSort");
      const q = localStorage.getItem("unsei-design-friendSearch");
      if (s) setFriendSort(s);
      if (typeof q === "string") setFriendSearch(q);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("unsei-design-friendSort", friendSort);
      localStorage.setItem("unsei-design-friendSearch", friendSearch);
    } catch {}
  }, [friendSort, friendSearch]);

  // 友達リスト読み込み
  useEffect(() => {
    try {
      const savedFriends = localStorage.getItem("unsei-design-friends");
      if (savedFriends) {
        const arr = JSON.parse(savedFriends);
        if (Array.isArray(arr)) setFriends(arr);
      }
    } catch (e) {
      console.error("failed to load friends", e);
    }
  }, []);

  // 今日と基準日
  const today = useMemo(() => new Date(), []);
  const base = viewDate;
  const baseStr = fmtDate(base);
  const todayStr = fmtDate(today);
  const ts = useMemo(() => prioritizedTendoSaiha(base), [baseStr]);

  // データ
  const daySeed = `${baseStr}`,
    monthSeed = `${base.getFullYear()}-${base.getMonth() + 1}-setsu`,
    yearSeed = `${base.getFullYear()}`;
  const dayData = useMemo(() => (dob ? buildResultBySeed(dob, daySeed) : []), [dob, daySeed]);
  const monthData = useMemo(() => (dob ? buildResultBySeed(dob, monthSeed) : []), [dob, monthSeed]);
  const yearData = useMemo(() => (dob ? buildResultBySeed(dob, yearSeed) : []), [dob, yearSeed]);

  const monthRange = monthRangeSetsu(base),
    yearRange = yearRangeSetsu(base),
    seasons = seasonRangesSetsu(base);

  const luckyDay = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "L", 8)], [dob, daySeed]);
  const unluckyDay = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "U", 8)], [dob, daySeed]);
  const luckyMon = useMemo(() => DIRECTIONS[seededIndex(dob + monthSeed + "L", 8)], [dob, monthSeed]);
  const unluckyMon = useMemo(() => DIRECTIONS[seededIndex(dob + monthSeed + "U", 8)], [dob, monthSeed]);
  const luckyYear = useMemo(() => DIRECTIONS[seededIndex(dob + yearSeed + "L", 8)], [dob, yearSeed]);
  const unluckyYear = useMemo(() => DIRECTIONS[seededIndex(dob + yearSeed + "U", 8)], [dob, yearSeed]);

  // 登録（新規）
  const handleRegister = (e) => {
    e.preventDefault();
    if (!dob) {
      alert("生年月日を入力してください");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("メール形式が不正です");
      return;
    }
    try {
      localStorage.setItem(
        "unsei-design-profile",
        JSON.stringify({ dob, email, nick, time, place, gender })
      );
    } catch {}
    setRegistered(true);
  };

  // ユーザー情報の保存（編集モーダル）
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!dob) {
      alert("生年月日は必須です");
      return;
    }
    try {
      localStorage.setItem(
        "unsei-design-profile",
        JSON.stringify({ dob, email, nick, time, place, gender })
      );
    } catch {}
    setEditOpen(false);
  };

  // 友達ユーティリティ
  const saveFriends = (arr) => {
    setFriends(arr);
    try {
      localStorage.setItem("unsei-design-friends", JSON.stringify(arr));
    } catch {}
  };

  // 友達：追加
  function addFriend(e) {
    e.preventDefault();
    if (!friendForm.name || !friendForm.dob) {
      alert("名前と生年月日は必須です");
      return;
    }
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now());
    const f = { id, ...friendForm };
    const arr = [...friends, f];
    saveFriends(arr);
    setFriendForm({ name: "", dob: "", time: "12:00", place: "", gender: "未選択" });
  }

  // 友達：選択
  function selectFriend(id) {
    setSelectedFriendId(id);
  }

  // 友達：削除
  function removeFriend(id) {
    if (!confirm("この友達を削除しますか？")) return;
    const arr = friends.filter((f) => f.id !== id);
    saveFriends(arr);
    if (selectedFriendId === id) setSelectedFriendId(null);
  }

  const selectedFriend = useMemo(
    () => friends.find((f) => f.id === selectedFriendId) || null,
    [friends, selectedFriendId]
  );

  
  // 表示用：検索・並び順を反映
  const displayFriends = useMemo(() => {
    let arr = [...friends];
    if (friendSort === "あいうえお順") {
      arr.sort((a,b)=>(a.name||"").localeCompare(b.name||"","ja"));
    } else if (friendSort === "性別") {
      arr.sort((a,b)=>(a.gender||"").localeCompare(b.gender||"","ja"));
    }
    else if (friendSort === "生年月日順") {
      arr.sort((a, b) => {
        const ad = (a?.dob || "").toString();
        const bd = (b?.dob || "").toString();
        if (ad && bd) return ad.localeCompare(bd); // "YYYY-MM-DD" 文字比較で昇順
        if (ad) return -1;
        if (bd) return 1;
        return 0;
      });
    }
    const hira = (s) => (s || "").replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
const norm = (s) => hira(String(s || "")).toLowerCase().replace(/\s+/g,"");
const q = norm(friendSearch);if (q) { arr = arr.filter(f => norm(f.name).includes(q) || norm(f.yomi).includes(q)); }
    return arr;
  }, [friends, friendSearch, friendSort]);
// HOMEの指定日時遷移（簡易）
  const [qTime, setQTime] = useState("12:00");
  const onPick = (d) => setViewDate(d);

  return (
    <div
      className={appClass}
      style={{
        fontFamily:
          "'Hiragino Kaku Gothic ProN','Hiragino Sans','ヒラギノ角ゴ ProN W3',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans JP','Helvetica Neue',Arial,'Apple Color Emoji','Segoe UI Emoji',sans-serif",
      }}
    >
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className={h1Class}>運勢デザイン</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-neutral-500">{fmtDate(today)}</div>
            {SHOW_ACCENT_PICKER && (
              <input
                type="color"
                className="h-6 w-6 rounded border border-neutral-300"
                defaultValue="#3C5768"
              />
            )}

          </div>
        
          <a href="/onboarding" data-testid="btn-open-onboarding" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-[#3c5768] text-white hover:opacity-90 transition">はじめに</a>
          <a href="/profile" data-testid="link-profile" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition">プロフィール</a>
</header>

        {!registered ? (
  <section className={`${panelClass} p-6 sm:p-8`}>
    <div className="mb-4">
      <div className={titleClass}>はじめに</div>
      <p className="mt-1 text-sm text-neutral-600 leading-7">
        初回登録は「はじめに」ページで行います。
      </p>
    </div>
    <a
      href="/onboarding"
      data-testid="btn-open-onboarding"
      className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg"
      style={{ backgroundColor: 'var(--accent)' }}
    >
      はじめにへ（登録に進む）
    </a>
  </section>
) : (
          <>
            {/* タブ */}
<nav
  className="mb-3 grid gap-2"
  // 1行内で自動均等。最小幅を 0 にして折り返しを防止
  style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(0, 1fr))' }}
>
  {/* ホーム */}
  <button
  onClick={() => setTab('home')}
  className={`w-full rounded-xl border px-3 py-2 text-sm transition-all ${
    tab === 'home'
      ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg'
      : 'border-neutral-300 bg-white text-neutral-700 hover:shadow-md'
  }`}
>
    ホーム
  </button>

  {/* ▼ 統合タブ：運勢（プルダウン） */}
  <details className="w-full relative">
    <summary
       className={`w-full rounded-xl border px-3 py-2 text-sm transition-all ${
    ['daily','monthly','yearly'].includes(tab)
      ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg'
      : 'border-neutral-300 bg-white text-neutral-700 hover:shadow-md'
  }`}
  style={{ textAlign: 'center', listStylePosition: 'inside' }}
>
      運勢
    </summary>
    <ul className="absolute z-20 mt-1 w-28 rounded-xl border border-neutral-300 bg-white shadow-lg">
      <li>
        <button
          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
          onClick={(e) => {
            setTab('daily');
            e.currentTarget.closest('details')?.removeAttribute('open');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          日別
        </button>
      </li>
      <li>
        <button
          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
          onClick={(e) => {
            setTab('monthly');
            e.currentTarget.closest('details')?.removeAttribute('open');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          月別
        </button>
      </li>
      <li>
        <button
          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
          onClick={(e) => {
            setTab('yearly');
            e.currentTarget.closest('details')?.removeAttribute('open');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          年別
        </button>
      </li>
    </ul>
  </details>

    {/* ▼ 説明（プルダウン） */}
  <details className="w-full relative">
    <summary
      className={`w-full rounded-xl border px-3 py-2 text-sm transition-all ${
        ["explain-signs","explain-directions"].includes(tab)
          ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg'
          : 'border-neutral-300 bg-white text-neutral-700 hover:shadow-md'
      }`}
      style={{ textAlign: 'center', listStylePosition: 'inside' }}
    >
      説明
    </summary>
    <ul className="absolute z-20 mt-1 w-36 rounded-xl border border-neutral-300 bg-white shadow-lg">
      <li>
        <button
          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
          onClick={(e) => {
            setTab("explain-signs");
            e.currentTarget.closest("details")?.removeAttribute("open");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          九星象意
        </button>
      </li>
      <li>
        <button
          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-100"
          onClick={(e) => {
            setTab("explain-directions");
            e.currentTarget.closest("details")?.removeAttribute("open");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          九星方位
        </button>
      </li>
    </ul>
  </details>
  {/* 友達 */}
  <button
 onClick={() => setTab('friends')}
  className={`w-full rounded-xl border px-3 py-2 text-sm transition-all ${
    tab === 'friends'
      ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg'
      : 'border-neutral-300 bg-white text-neutral-700 hover:shadow-md'
  }`}
>
    友達
  </button>
</nav>




            {/* HOME（今日） */}
            {tab === "home" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-4">
  <div className={titleClass}>吉方位・凶方位（基準日：{fmtWithWeekday(base)}）</div>
  <div className="text-sm text-neutral-500">
    天道・歳破は 年盤 → 月盤 → 日盤 の順で参考（簡易ロジック）
  </div>
  <div className="mt-2 flex gap-2">
    <button
      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs hover:shadow"
      onClick={async () => {
        const share = `【方位メモ】基準日:${fmtWithWeekday(base)} / 吉:${luckyDay} / 凶:${unluckyDay} / 天道:${ts.tendo} / 歳破:${ts.saiha}`;
        try {
          await navigator.clipboard.writeText(share);
          alert("共有テキストをコピーしました");
        } catch {
          alert("コピーに失敗しました");
        }
      }}
    >
      共有テキストをコピー
    </button>
    <button
      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs hover:shadow"
      onClick={() => window.print()}
    >
      印刷/保存（ブラウザ）
    </button>
  </div>
</div>

<div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="mb-2 text-sm text-neutral-500">
    地図（中心ピンは現在の基準地点。座標未設定時は東京駅）
  </div>
  <div className="h-[420px] rounded-xl overflow-hidden border border-neutral-200">
    <LeafletMap />
  </div>
</div>

<hr className="my-6 border-neutral-300" />
                <div className="space-y-7">
                  {/* 根拠 */}
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="mb-2 text-sm text-neutral-500">
                      今日の運勢概要（{fmtWithWeekday(today)}）
                    </div>
                    <BasisTable seed={`${dob}-${time}-${place}`} />
                  </div>
                  {/* 遁甲盤（本日） */}
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="mb-2 text-sm text-neutral-500">遁甲盤（本日）</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DunjiaCompass
                        luckyDirs={[DIRECTIONS[seededIndex(dob + todayStr + "L", 8)]]}
                        unluckyDirs={[DIRECTIONS[seededIndex(dob + todayStr + "U", 8)]]}
                        tendo={prioritizedTendoSaiha(today).tendo}
                        saiha={prioritizedTendoSaiha(today).saiha}
                      />
                      <div className="grid content-start gap-2">
                        <Info label="基準日" value={fmtWithWeekday(today)} />
                        <Info
                          label="推奨時間帯"
                          value={HOURS[seededIndex(dob + todayStr + "t", HOURS.length)]}
                        />
                        <Info
                          label="推奨プレイス"
                          value={PLACES[seededIndex(dob + todayStr + "p", PLACES.length)]}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 調べたい日付（→ viewDateを更新） */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MiniCalendar value={viewDate} onChange={onPick} />
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">時刻</div>
                      <input
                        type="time"
                        className="rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                        value={qTime}
                        onChange={(e) => {
                          setQTime(e.target.value);
                          const [hh, mm] = (e.target.value || "12:00").split(":").map(Number);
                          const d = new Date(viewDate);
                          d.setHours(hh || 12, mm || 0, 0, 0);
                          setViewDate(d);
                        }}
                      />
                      <div className="mt-3">
                        <button
                          className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg"
                          style={{ backgroundColor: 'var(--accent)' }}
                          onClick={() => {
                            setTab("daily");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          この日時で見る（→ 日別）
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 日別 */}
            {tab === "daily" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick ? `${nick} さんの` : "あなたの"}</div>
                <div className="mb-2">
                  <div className={titleClass}>日別の運勢</div>
                </div>
                <div className="mb-4 text-base font-medium">期間：{fmtWithWeekday(base)}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender} />
                    <BasisTable seed={`${dob}-${time}-${place}`} />
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate} />
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {dayData.map((c) => (
                      <CategoryCard key={c.key} c={c} />
                    ))}
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">日盤・月盤・年盤</div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DunjiaCompass luckyDirs={[luckyDay]} unluckyDirs={[unluckyDay]} tendo={ts.tendo} saiha={ts.saiha} />
                        <DunjiaCompass luckyDirs={[luckyMon]} unluckyDirs={[unluckyMon]} tendo={ts.tendo} saiha={ts.saiha} />
                        <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 月別 */}
            {tab === "monthly" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick ? `${nick} さんの` : "あなたの"}</div>
                <div className="mb-2">
                  <div className={titleClass}>月別の運勢</div>
                </div>
                <div className="mb-4 text-base font-medium">期間：{monthRange}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender} />
                    <BasisTable seed={`${dob}-month-${time}-${place}`} />
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate} />
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {monthData.map((c) => (
                      <CategoryCard key={c.key} c={c} />
                    ))}
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">月盤・年盤</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DunjiaCompass luckyDirs={[luckyMon]} unluckyDirs={[unluckyMon]} tendo={ts.tendo} saiha={ts.saiha} />
                        <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha} />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 年別 */}
            {tab === "yearly" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick ? `${nick} さんの` : "あなたの"}</div>
                <div className="mb-2">
                  <div className={titleClass}>年別の運勢</div>
                </div>
                <div className="mb-4 text-base font-medium">期間：{yearRange}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender} />
                    <BasisTable seed={`${dob}-year-${time}-${place}`} />
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate} />
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">春夏秋冬（期間）</div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {seasons.map((s) => (
                          <Info key={s.name} label={s.name} value={`${s.start} 〜 ${s.end}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {yearData.map((c) => (
                      <CategoryCard key={c.key} c={c} />
                    ))}
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="mb-2 text-sm text-neutral-500">年盤</div>
                      <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha} />
                    </div>
                  </div>
                </div>
              </section>
            )}

                        {/* 説明：九星象意 */}
            {tab === "explain-signs" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-2">
                  <div className={titleClass}>九星の象意（説明）</div>
                  <p className="text-sm text-neutral-600">各九星の象意を一覧表示します（詳細は今後拡充）。</p>
                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                  {[1,2,3,4,5,6,7,8,9].map((n) => (
                    <div key={n} className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                      <div className="font-medium">{nineStarName(n)}</div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
                        {["色","味","体","方位","時間","自然","人物","その他"].map((k) => (
                          <li key={k}>
                            <span className="text-neutral-500 mr-1">《{k}》</span>（未設定）
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 説明：九星方位 */}
            {tab === "explain-directions" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-2">
                  <div className={titleClass}>九星方位（説明）</div>
                  <p className="text-sm text-neutral-600">五黄殺・天道・歳破などの意味を解説します（後続で詳細化）。</p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="font-medium">天道（てんどう）</div>
                    <p className="mt-1 text-sm leading-7 text-neutral-700">吉を呼ぶ巡りの概念。年→月→日の順に参考とする簡易方針を採用。</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="font-medium">歳破（さいは）</div>
                    <p className="mt-1 text-sm leading-7 text-neutral-700">年や月に応じて注意すべき方位。基準日の盤で確認します。</p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="font-medium">五黄殺（ごおうさつ）</div>
                    <p className="mt-1 text-sm leading-7 text-neutral-700">九星盤の五黄が示す凶意。移動や契約時の注意点として参照します。</p>
                  </div>
                </div>
              </section>
            )}
            {/* 方位（Leaflet） */}
            {tab === "directions" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-4">
                  <div className={titleClass}>吉方位・凶方位（基準日：{fmtWithWeekday(base)}）</div>
                  <div className="text-sm text-neutral-500">
                    天道・歳破は 年盤 → 月盤 → 日盤 の順で参考（簡易ロジック）
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs hover:shadow"
                      onClick={async () => {
                        const share = `【方位メモ】基準日:${fmtWithWeekday(base)} / 吉:${luckyDay} / 凶:${unluckyDay} / 天道:${ts.tendo} / 歳破:${ts.saiha}`;
                        try {
                          await navigator.clipboard.writeText(share);
                          alert("共有テキストをコピーしました");
                        } catch {
                          alert("コピーに失敗しました");
                        }
                      }}
                    >
                      共有テキストをコピー
                    </button>
                    <button
                      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs hover:shadow"
                      onClick={() => window.print()}
                    >
                      印刷/保存（ブラウザ）
                    </button>
                  </div>
                </div>

                {/* 地図エリア */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                  <div className="mb-2 text-sm text-neutral-500">
                    地図（中心ピンは現在の基準地点。座標未設定時は東京駅）
                  </div>
                  <div className="h-[420px] rounded-xl overflow-hidden border border-neutral-200">
                    {/* LeafletMap 側デフォルト中心あり。任意で緯度経度を渡すなら以下のように： */}
                    {/* <LeafletMap lat={35.681236} lng={139.767125} zoom={12} /> */}
                    <LeafletMap />
                  </div>
                </div>
              </section>
            )}

            {/* 友達 */}
            {tab === "friends" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-2">
                  <div className={titleClass}>友達</div>
                </div>

                {/* 追加フォーム */}
                <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                  <div className="mb-2 text-sm text-neutral-500">友達の追加</div>
                  <form
                    className="grid gap-3 sm:grid-cols-2"
                    onSubmit={addFriend}
                  >
                    <div className="sm:col-span-1">
                      <label className={labelClass}>名前</label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                        value={friendForm.name}
                        onChange={(e) => setFriendForm((v) => ({ ...v, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className={labelClass}>生年月日</label>
                      <input
                        type="date"
                        className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                        value={friendForm.dob}
                        onChange={(e) => setFriendForm((v) => ({ ...v, dob: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>性別</label>
                      <select
                        className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                        value={friendForm.gender}
                        onChange={(e) => setFriendForm((v) => ({ ...v, gender: e.target.value }))}
                      >
                        <option>未選択</option>
                        <option>女性</option>
                        <option>男性</option>
                        <option>その他</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                      <button
                        type="submit"
                        className="w-full rounded-xl px-4 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        友達を追加
                      </button>
                    </div>
                  </form>
                </div>

                {/* 一覧 & 詳細 */}
                <div className="mt-4 grid gap-4 grid-cols-1">
                  {/* 一覧 */}
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="mb-2 text-sm text-neutral-500">友達一覧（{displayFriends.length} / {friends.length}件）</div>
<div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
  <div className="flex flex-wrap items-center gap-2">
  <input data-testid="friends-search" type="text" placeholder="検索" className="w-full sm:w-48 rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={friendSearch} onChange={(e)=>setFriendSearch(e.target.value)} />
  <select data-testid="friends-sort" className="rounded-lg border border-neutral-300 bg-white p-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#3c5768]" value={friendSort} onChange={(e)=>setFriendSort(e.target.value)}>
    <option>登録順</option>
    <option>生年月日順</option>
  </select>
</div>
</div>
                    {friends.length === 0 ? (
                      <div className="text-sm text-neutral-500">まだ登録がありません。</div>
                    ) : (
                      <div data-testid="friends-list" className="grid gap-2" style={{ maxHeight: 440, overflowY: "auto" }}>
                        {displayFriends.map((f) => (
                          <div data-testid="friend-card" key={f.id} className="flex items-center justify-between rounded-lg border border-neutral-300 bg-neutral-50 p-2">
                            <button
                              className="text-sm underline underline-offset-4"
                              onClick={() => selectFriend(f.id)}
                            >
                              {f.name}
                            </button>
                            <span className="text-xs text-neutral-600">本命星：{nineStarName((seededIndex(f.dob + "honmei", 9) % 9) + 1)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 詳細 */}
                  <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
                    <div className="mb-2 text-sm text-neutral-500">詳細</div>
                    {!selectedFriend ? (
                      <div className="text-sm text-neutral-500">友達一覧から選択してください。</div>
                    ) : (
                      <>
                        <div className="text-base font-medium mb-2">
                          {selectedFriend.name} さんの基本情報（簡易）
                        </div>
                        {/* 既存の BasicInfoCard を流用 */}
                        <BasicInfoCard
                          dob={selectedFriend.dob || dob}
                          base={base}
                          place={selectedFriend.place || ""}
                          gender={selectedFriend.gender || "未選択"}
                        />
                        {/* 相性コメント（簡易） */}
                        <div className="mt-3 rounded-xl border border-neutral-300 bg-neutral-50 p-3">
                          <div className="mb-1 text-sm text-neutral-500">関係性コメント（簡易）</div>
                          <p className="text-sm leading-7 text-neutral-700">
                            お二人が良い関係を築く鍵は「{["丁寧な対話","スピード感の共有","役割の明確化","小さな共同行動","互いの強みの尊重"][seededIndex((dob || "") + (selectedFriend.dob || ""), 5)]}
                            」です。こまめな感謝と進捗の共有が運気を循環させ、協力関係が深まります。
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mx-auto mt-6 flex items-center justify-between text-xs text-neutral-500">
          <div>© 運勢デザイン – Prototype v0.7</div>
          <button
            className="underline-offset-2 hover:underline"
            onClick={() => {
              localStorage.removeItem("unsei-design-profile");
              location.reload();
            }}
          >
            登録情報をリセット
          </button>
        </footer>
      </div>

      {/* MENU（右下固定） */}
      <button
        className="fixed bottom-4 right-4 rounded-full px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-shadow"
        style={{ backgroundColor: 'var(--accent)', zIndex: 40 }}
        onClick={() => setMenuOpen(true)}
      >
        MENU
      </button>

      {/* ボトムシート */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-xl ring-1 ring-neutral-300 p-4">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-neutral-300" />
            <div data-testid="friends-list" className="grid gap-2" style={{ maxHeight: 440, overflowY: "auto" }}>
              {[
                ["home", "ホーム"],
                ["daily", "今日の運勢"],
                ["monthly", "今月の運勢"],
                ["yearly", "今年の運勢"],
                ["directions", "方位"],
                ["friends", "友達"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-800 hover:shadow-sm"
                  onClick={() => {
                    setTab(key);
                    setMenuOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
              <button
                className="w-full rounded-xl bg-[#3c5768] px-4 py-3 text-sm font-medium text-white"
                onClick={() => {
                  setEditOpen(true);
                  setMenuOpen(false);
                }}
              >
                ユーザー情報（確認・編集）
              </button>
              <button
                className="w-full rounded-xl px-4 py-3 text-sm text-neutral-600 underline underline-offset-4"
                onClick={() => setMenuOpen(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー情報モーダル */}
      {editOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditOpen(false)} />
          <div className="absolute left-1/2 top-1/2 w-[min(92vw,560px)] max-h-[92vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white p-5 shadow-xl ring-1 ring-neutral-300">
            <div className="mb-3 text-base font-medium">ユーザー情報の確認・編集</div>
            <form className="grid gap-3" onSubmit={handleSaveEdit}>
              <div>
                <label className={labelClass}>名前またはニックネーム</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>生年月日</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>性別</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>未選択</option>
                    <option>女性</option>
                    <option>男性</option>
                    <option>その他</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>出生地</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>

              {/* 基本情報プレビュー */}
              <div className="mt-2 rounded-xl border border-neutral-300 bg-neutral-50 p-3">
                <div className="mb-2 text-sm text-neutral-500">基本情報（プレビュー）</div>
                <BasicInfoCard dob={dob} base={viewDate} place={place} gender={gender} />
<div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="text-base font-medium">
    メイン傾向：
    {nick ? `${nick} さんは：` : ""}
    {["分析型","社交型","直感型","勤勉型","創造型"][seededIndex(dob + gender + place, 5)]}
  </div>
  <p className="mt-2 text-sm leading-7 text-neutral-700">
   {genParagraph(dob + gender + place)}
  </p>
</div>


              </div>

{/* === 星ごとのカード（本命星／月命星／傾斜星／同会星） === */}

{/* 1. 本命星（基本的な性格、才能、適性、運勢） */}
<div className="mt-3 rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="mb-1 text-base font-medium">
    1. {STAR_KEYWORDS["本命星"].label}
    <span className="ml-2 text-neutral-500">
      （{nineStarName((seededIndex(dob + "honmei", 9) % 9) + 1)}）
    </span>
  </div>
  <p className="mt-1 text-sm leading-7 text-neutral-700">
    {genParagraph(dob + gender + place + "honmei_overview")}
  </p>
  <div className="mt-2 space-y-1 text-sm leading-7">
    {STAR_KEYWORDS["本命星"].keywords.map((line) => (
      <p key={`honmei-${line}`}>{line}</p>
    ))}
  </div>
</div>

{/* 2. 月命星（内面的な性格、才能、適性、運勢） */}
<div className="mt-3 rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="mb-1 text-base font-medium">
    2. {STAR_KEYWORDS["月命星"].label}
    <span className="ml-2 text-neutral-500">
      （{nineStarName((seededIndex(dob + "getsu", 9) % 9) + 1)}）
    </span>
  </div>
  <p className="mt-1 text-sm leading-7 text-neutral-700">
    {genParagraph(dob + gender + place + "getsu_overview")}
  </p>
  <div className="mt-2 space-y-1 text-sm leading-7">
    {STAR_KEYWORDS["月命星"].keywords.map((line) => (
      <p key={`getsu-${line}`}>{line}</p>
    ))}
  </div>
</div>

{/* 3. 傾斜星（思考傾向、潜在能力、潜在願望） */}
<div className="mt-3 rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="mb-1 text-base font-medium">
    3. {STAR_KEYWORDS["傾斜星"].label}
    <span className="ml-2 text-neutral-500">
      （{nineStarName((seededIndex(dob + "keisha", 9) % 9) + 1)}）
    </span>
  </div>
  <p className="mt-1 text-sm leading-7 text-neutral-700">
    {genParagraph(dob + gender + place + "keisha_overview")}
  </p>
  <div className="mt-2 space-y-1 text-sm leading-7">
    {STAR_KEYWORDS["傾斜星"].keywords.map((line) => (
      <p key={`keisha-${line}`}>{line}</p>
    ))}
  </div>
</div>

{/* 4. 同会星（縁のある場所、環境、人、事象） */}
<div className="mt-3 rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
  <div className="mb-1 text-base font-medium">
    4. {STAR_KEYWORDS["同会星"].label}
    <span className="ml-2 text-neutral-500">
      （{nineStarName((seededIndex(dob + "doukai", 9) % 9) + 1)}）
    </span>
  </div>
  <p className="mt-1 text-sm leading-7 text-neutral-700">
    {genParagraph(dob + gender + place + "doukai_overview")}
  </p>
  <div className="mt-2 space-y-1 text-sm leading-7">
    {STAR_KEYWORDS["同会星"].keywords.map((line) => (
      <p key={`doukai-${line}`}>{line}</p>
    ))}
  </div>
</div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm"
                  onClick={() => setEditOpen(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-lg px-4 py-2 text-sm text-white shadow-md hover:shadow-lg"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}






































