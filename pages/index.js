import React, { useEffect, useMemo, useState } from "react";

/**
 * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
 * -----------------------------------------------------------
 * この版の目的：SyntaxError 修正とテスト強化
 * - JSX内の誤エスケープ（例: className=\"...）を除去
 * - 正規表現の不要なバックスラッシュ（\（, \））を削除
 * - 既存の簡易テストは維持しつつ、日付整形などのテストを追加
 * - 年盤→月盤→日盤の優先ロジック（ダミー）を関数化
 */

// ---- 基本スタイル（Tailwind ユーティリティ想定） ----
const appClass =
  "min-h-screen bg-neutral-50 text-neutral-800 antialiased selection:bg-neutral-900 selection:text-white";
const panelClass = "rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200";
const labelClass = "text-xs tracking-wide text-neutral-500"; // W1〜W2 相当
const titleClass = "text-lg font-medium"; // W3 相当
const h1Class = "text-2xl font-medium tracking-tight"; // W3〜W4 相当

// ---- 共通ユーティリティ ----
const fmtDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const fmtWithWeekday = (d) => `${fmtDate(d)}（${WEEKDAYS[d.getDay()]}）`;

// 近似の節入り（定気法ではなく暫定固定日）。本実装で差替予定。
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

const addDays = (d, days) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);

// 与えられた日付が属する「節入り月」の開始・終了（次の節入り前日）を返す
const monthRangeSetsu = (base) => {
  const y = base.getFullYear();
  const prev = approxSetsu(y - 1).slice(-1); // 前年の大雪
  const curr = approxSetsu(y);
  const next = approxSetsu(y + 1).slice(0, 1); // 翌年の小寒だけ
  const all = [...prev, ...curr, ...next]
    .map((x) => x.date)
    .sort((a, b) => a.getTime() - b.getTime());
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

// その年の立春〜翌年立春-1日を返す
const yearRangeSetsu = (base) => {
  const y = base.getFullYear();
  const currRisshun = approxSetsu(y).find((s) => s.key === "立春").date;
  const nextRisshun = approxSetsu(y + 1).find((s) => s.key === "立春").date;
  return `${fmtDate(currRisshun)} 〜 ${fmtDate(addDays(nextRisshun, -1))}`;
};

// 年別：春夏秋冬を節入りで区切る（立春/立夏/立秋/立冬）
const seasonRangesSetsu = (base) => {
  const y = base.getFullYear();
  const rs = approxSetsu(y).find((s) => s.key === "立春").date;
  const rk = approxSetsu(y).find((s) => s.key === "立夏").date;
  const ra = approxSetsu(y).find((s) => s.key === "立秋").date;
  const rt = approxSetsu(y).find((s) => s.key === "立冬").date;
  const nextRs = approxSetsu(y + 1).find((s) => s.key === "立春").date;
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
const COLORS = ["ブラック", "ホワイト", "グレー", "ネイビー", "ティール", "ボルドー", "オリーブ", "ラベンダー"];
// 指定パレット（必要最小限で使用）
const PALETTE = {
  c1: "#566a76", // 見出し/強調テキスト
  c2: "#182832", // プライマリ（ボタン/アクティブ）
  c3: "#595757", // 本文
  c4: "#898989", // サブテキスト/区切り
  c5: "#b5b5b6", // ライン淡
  c6: "#d3d3d3", // 罫線/プレースホルダ
  c7: "#f3d12f", // ゴールド（天道）
};
const ITEMS = ["細身のペン", "レザー手帳", "シルバーリング", "スニーカー", "名刺ケース", "ブレスレット", "スカーフ", "時計"];
const PLACES = ["静かなカフェ", "図書館", "神社仏閣", "川沿い", "美術館", "公園", "高層ビルの展望", "自宅のワークスペース"];
const PERSONS = ["年上の女性", "年上の男性", "同年代の友人", "後輩", "家族", "恩師", "初対面の人", "オンラインの知人"];
const FOODS = ["おにぎり", "サンドイッチ", "味噌汁", "パスタ", "サラダ", "カレー", "蕎麦", "和菓子"];

// ---- 乱数（シード安定） ----
function seededIndex(seed, modulo) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  h ^= h << 13;
  h ^= h >>> 17;
  h ^= h << 5;
  return Math.abs(h) % modulo;
}

// ---- ダミー占術ロジック（本実装TODO） ----
const HEAVENLY = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const FIVE = ["木", "火", "土", "金", "水"];

function dummyMainStar(dateStr) {
  const n = dateStr.replace(/-/g, "").split("").reduce((a, b) => a + Number(b), 0);
  return n % 9 || 9; // 1〜9
}

function dummyPillars(seed) {
  const ys = HEAVENLY[seededIndex(seed + "y", HEAVENLY.length)];
  const yb = EARTHLY[seededIndex(seed + "Y", EARTHLY.length)];
  const ms = HEAVENLY[seededIndex(seed + "m", HEAVENLY.length)];
  const mb = EARTHLY[seededIndex(seed + "M", EARTHLY.length)];
  const ds = HEAVENLY[seededIndex(seed + "d", HEAVENLY.length)];
  const db = EARTHLY[seededIndex(seed + "D", EARTHLY.length)];
  const hs = HEAVENLY[seededIndex(seed + "h", HEAVENLY.length)];
  const hb = EARTHLY[seededIndex(seed + "H", EARTHLY.length)];
  const pillars = { year: ys + yb, month: ms + mb, day: ds + db, hour: hs + hb };
  const fiveCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  [ys, ms, ds, hs].forEach((s) => {
    fiveCount[FIVE[HEAVENLY.indexOf(s) % 5]]++;
  });
  const dominant = Object.entries(fiveCount).sort((a, b) => b[1] - a[1])[0][0];
  return { pillars, fiveCount, dominant };
}

// 300字程度の説明文（ダミー）
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
  const text =
    base[i] +
    base[(i + 1) % base.length] +
    base[(i + 2) % base.length] +
    "小さな達成を言語化して自信に変えると、次の一歩が軽くなります。" +
    "丁寧さと誠実さが評価される日。焦らず、目の前のことを一つずつ仕上げましょう。";
  return text.slice(0, 320);
}

function luckPack(seed) {
  return {
    color: COLORS[seededIndex(seed + "c", COLORS.length)],
    item: ITEMS[seededIndex(seed + "i", ITEMS.length)],
    place: PLACES[seededIndex(seed + "p", PLACES.length)],
    person: PERSONS[seededIndex(seed + "r", PERSONS.length)],
    food: FOODS[seededIndex(seed + "f", FOODS.length)],
    time: HOURS[seededIndex(seed + "t", HOURS.length)],
    dir: DIRECTIONS[seededIndex(seed + "d", DIRECTIONS.length)],
  };
}

const CATEGORY_KEYS = ["総合運", "仕事運", "対人運", "金運", "恋愛運"];

function buildResultBySeed(dob, seed) {
  return CATEGORY_KEYS.map((k, idx) => {
    const s = `${dob}-${seed}-${k}-${idx}-${dummyMainStar(dob)}`;
    return { key: k, score: seededIndex(s, 5) + 1, text: genParagraph(s), luck: luckPack(s) };
  });
}

// ---- UI部品 ----
function Stars({ n }) {
  return (
    <div aria-label={`score-${n}`} className="tracking-tight">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-[var(--accent)]" : "text-neutral-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-neutral-100 p-3">
      <div className={labelClass}>{label}</div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function CategoryCard({ c }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <div className="text-base font-medium">{c.key}</div>
        <Stars n={c.score} />
      </div>
      <p className="text-sm leading-7 text-neutral-700">{c.text}</p>
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
    <div className="overflow-hidden rounded-xl border border-neutral-200">
      <table className="w-full text-sm">
        <tbody>
          <tr className="bg-neutral-50">
            <td className="p-2 w-32 text-neutral-500">命式（四柱）</td>
            <td className="p-2">年：{pillars.year} ／ 月：{pillars.month} ／ 日：{pillars.day} ／ 時：{pillars.hour}</td>
          </tr>
          <tr>
            <td className="p-2 text-neutral-500">十干</td>
            <td className="p-2">年：{pillars.year[0]} ／ 月：{pillars.month[0]} ／ 日：{pillars.day[0]} ／ 時：{pillars.hour[0]}</td>
          </tr>
          <tr className="bg-neutral-50">
            <td className="p-2 text-neutral-500">十二支</td>
            <td className="p-2">年：{pillars.year[1]} ／ 月：{pillars.month[1]} ／ 日：{pillars.day[1]} ／ 時：{pillars.hour[1]}</td>
          </tr>
          <tr>
            <td className="p-2 text-neutral-500">五行バランス</td>
            <td className="p-2">
              木:{fiveCount["木"]} 火:{fiveCount["火"]} 土:{fiveCount["土"]} 金:{fiveCount["金"]} 水:{fiveCount["水"]}
              （主：{dominant}）
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DunjiaCompass({ luckyDirs = [], unluckyDirs = [], tendo, saiha }) {
  // 円形の八方位（北を上に、反時計回りに45°刻み）
  const size = 260;
  const r = 100;
  const cx = size / 2;
  const cy = size / 2;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const centerAngle = (i) => -90 + i * 45; // 北=-90°
  const wedgePath = (i) => {
    const start = toRad(centerAngle(i) - 22.5);
    const end = toRad(centerAngle(i) + 22.5);
    const sx = cx + Math.cos(start) * r;
    const sy = cy + Math.sin(start) * r;
    const ex = cx + Math.cos(end) * r;
    const ey = cy + Math.sin(end) * r;
    const laf = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${laf} 1 ${ex} ${ey} Z`;
  };
  const markAt = (dir, color, radius = r + 14, sizePx = 6) => {
    const i = DIRECTIONS.indexOf(dir);
    if (i < 0) return null;
    const a = toRad(centerAngle(i));
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;
    return <circle key={`m-${dir}-${color}`} cx={x} cy={y} r={sizePx} fill={color} stroke="#fff" strokeWidth={2} />;
  };
  const isLucky = (d) => luckyDirs.includes(d);
  const isUnlucky = (d) => unluckyDirs.includes(d);
  // パレットに合わせた控えめな色分け
  const luckyFill = "rgba(24,40,50,0.22)"; // c2ベース
  const luckyStroke = PALETTE.c2;
  const unluckyFill = "rgba(137,137,137,0.22)"; // c4ベース
  const unluckyStroke = PALETTE.c4;
  const tendoColor = PALETTE.c7; // ゴールド
  const saihaColor = PALETTE.c1; // 濃グレー

  return (
    <svg width={size} height={size} className="mx-auto block">
      {/* 土台 */}
      <circle cx={cx} cy={cy} r={r + 12} fill="#fff" stroke={PALETTE.c6} />
      {/* 8つの扇形 */}
      {DIRECTIONS.map((d, i) => {
        const fill = isLucky(d) ? luckyFill : isUnlucky(d) ? unluckyFill : "#f8fafc";
        const stroke = isUnlucky(d) ? unluckyStroke : isLucky(d) ? luckyStroke : PALETTE.c6;
        return <path key={`w-${d}`} d={wedgePath(i)} fill={fill} stroke={stroke} strokeWidth={1.5} />;
      })}
      {/* 放射ガイド線と方位ラベル */}
      {DIRECTIONS.map((d, i) => {
        const a = toRad(centerAngle(i));
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        return (
          <g key={`g-${d}`}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={PALETTE.c6} />
            <text x={cx + Math.cos(a) * (r + 26)} y={cy + Math.sin(a) * (r + 26)} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={PALETTE.c3}>
              {d}
            </text>
          </g>
        );
      })}
      {/* 中心点 */}
      <circle cx={cx} cy={cy} r={3} fill={PALETTE.c5} />
      {/* 天道・歳破のマーカー */}
      {tendo && markAt(tendo, tendoColor, r + 16, 7)}
      {saiha && markAt(saiha, saihaColor, r + 16, 5)}
      {/* 凡例 */}
      <g transform={`translate(${cx - 70}, ${cy + r + 36})`}>
        <rect x={0} y={-10} width={140} height={26} fill="#ffffff" stroke={PALETTE.c6} rx={6} />
        <circle cx={10} cy={3} r={5} fill={luckyStroke} />
        <text x={20} y={6} fontSize={11} fill={PALETTE.c3}>吉方位</text>
        <circle cx={60} cy={3} r={5} fill={unluckyStroke} />
        <text x={70} y={6} fontSize={11} fill={PALETTE.c3}>凶方位</text>
      </g>
      <g transform={`translate(${cx - 70}, ${cy + r + 64})`}>
        <rect x={0} y={-10} width={140} height={26} fill="#ffffff" stroke={PALETTE.c6} rx={6} />
        <circle cx={10} cy={3} r={5} fill={tendoColor} />
        <text x={20} y={6} fontSize={11} fill={PALETTE.c3}>天道</text>
        <circle cx={60} cy={3} r={5} fill={saihaColor} />
        <text x={70} y={6} fontSize={11} fill={PALETTE.c3}>歳破</text>
      </g>
    </svg>
  );
}

// ダミー：天道・歳破の方位（※本実装で正確な計算に差し替え）
function dummyTendoDir(seed) {
  return DIRECTIONS[seededIndex(seed + "TEN", 8)];
}
function dummySaihaDir(seed) {
  return DIRECTIONS[seededIndex(seed + "SAI", 8)];
}

// 年盤優先→月盤→日盤（ダミー導出）
function prioritizedTendoSaiha(dob, date) {
  const ySeed = String(date.getFullYear());
  const mSeed = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const dSeed = fmtDate(date);
  const tendo = dummyTendoDir(ySeed) || dummyTendoDir(mSeed) || dummyTendoDir(dSeed);
  const saiha = dummySaihaDir(ySeed) || dummySaihaDir(mSeed) || dummySaihaDir(dSeed);
  return { tendo, saiha };
}

// ---- 開発用 簡易テスト ----
function runDevTests() {
  const y = 2025;
  const today = new Date("2025-08-11T00:00:00+09:00");
  // approxSetsu: 12節が返る
  console.assert(approxSetsu(y).length === 12, "approxSetsu should return 12 items");
  // monthRangeSetsu: フォーマット確認
  const m = monthRangeSetsu(today);
  console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(m), "monthRangeSetsu format");
  // yearRangeSetsu: 立春〜翌立春-1日
  const yr = yearRangeSetsu(today);
  console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(yr), "yearRangeSetsu format");
  // seasonRangesSetsu: 4区分
  console.assert(seasonRangesSetsu(today).length === 4, "seasonRangesSetsu should have 4 seasons");
  // buildResultBySeed: 5カテゴリ
  const sample = buildResultBySeed("1990-01-01", "seed");
  console.assert(sample.length === 5, "5 categories expected");
  console.assert(sample.every((c) => c.score >= 1 && c.score <= 5), "scores within 1..5");
  console.assert(sample.every((c) => typeof c.text === "string" && c.text.length >= 50), "text length >= 50");
  // 追加テスト：曜日表記（全角括弧）
  const now = new Date();
  console.assert(/（[日月火水木金土]）$/.test(fmtWithWeekday(now)), "weekday label format");
  // 方位の妥当性＋優先ロジックの戻り
  console.assert(DIRECTIONS.includes(dummyTendoDir("seed")), "tendo dir valid");
  console.assert(DIRECTIONS.includes(dummySaihaDir("seed")), "saiha dir valid");
  const tsTest = prioritizedTendoSaiha("1990-01-01", new Date());
  console.assert(DIRECTIONS.includes(tsTest.tendo) && DIRECTIONS.includes(tsTest.saiha), "prioritized tendo/saiha valid");
  // fmtDate の境界
  console.assert(fmtDate(new Date(2025, 0, 1)) === "2025-01-01", "fmtDate pads 0");
}

if (typeof window !== "undefined") {
  try {
    runDevTests();
  } catch (e) {
    console.error("dev tests failed", e);
  }
}

// ---- ルート ----
export default function App() {
  // 入力
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [nick, setNick] = useState("");
  const [time, setTime] = useState("12:00");
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState("未選択");
  const [registered, setRegistered] = useState(false);

  // UI state
  const [accent, setAccent] = useState(PALETTE.c2); // 可変
  const [tab, setTab] = useState("home"); // home/daily/monthly/yearly/directions/persona

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
    } catch (_) {}
  }, []);

  const today = useMemo(() => new Date(), []);
  const todayStr = fmtDate(today);
  const ts = useMemo(() => prioritizedTendoSaiha(dob, today), [dob, todayStr]);

  // データ生成（検証用）
  const daySeed = `${todayStr}`;
  const monthSeed = `${today.getFullYear()}-${today.getMonth() + 1}-setsu`;
  const yearSeed = `${today.getFullYear()}`;

  const dayData = useMemo(() => (dob ? buildResultBySeed(dob, daySeed) : []), [dob, daySeed]);
  const monthData = useMemo(() => (dob ? buildResultBySeed(dob, monthSeed) : []), [dob, monthSeed]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!dob) return alert("生年月日を入力してください");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("メール形式が不正です");
    localStorage.setItem(
      "unsei-design-profile",
      JSON.stringify({ dob, email, nick, time, place, gender })
    );
    setRegistered(true);
  };

  // 性格・先天運（ダミー）
  const persona = useMemo(() => {
    const seeds = ["分析型", "社交型", "直感型", "勤勉型", "創造型"];
    const main = seeds[seededIndex(dob + gender + place, seeds.length)] || seeds[0];
    const text = genParagraph(dob + gender + place + "persona");
    const born = CATEGORY_KEYS.map((k) => ({ key: k, score: seededIndex(dob + k + "born", 5) + 1 }));
    return { main, text, born };
  }, [dob, gender, place]);

  const lucky = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "L", DIRECTIONS.length)] || DIRECTIONS[0], [dob, daySeed]);
  const unlucky = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "U", DIRECTIONS.length)] || DIRECTIONS[4], [dob, daySeed]);

  return (
    <div
      className={appClass}
      style={{
        fontFamily:
          "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'ヒラギノ角ゴ ProN W3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans JP', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif",
        // @ts-ignore
        "--accent": accent,
      }}
    >
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className={h1Class}>運勢デザイン</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-neutral-500">{fmtDate(today)}</div>
            <label className="inline-flex items-center gap-2 text-xs text-neutral-500">
              <span>Accent</span>
              <input
                type="color"
                className="h-6 w-6 rounded border border-neutral-200"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
              />
            </label>
          </div>
        </header>

        {!registered ? (
          <section className={`${panelClass} p-5 sm:p-6`}>
            <div className="mb-4">
              <div className={titleClass}>はじめに</div>
              <p className="mt-1 text-sm text-neutral-600">
                生年月日・出生時間・出生地・性別を登録すると、詳しい運勢が表示されます。
              </p>
            </div>
            <form className="grid gap-4" onSubmit={handleRegister}>
              <div>
                <label className={labelClass}>生年月日</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>出生時間</label>
                  <input
                    type="time"
                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>性別</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm"
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
                  placeholder="例：岐阜県岐阜市"
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>メールアドレス</label>
                <input
                  type="email"
                  placeholder="（任意）"
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>ニックネーム</label>
                <input
                  type="text"
                  placeholder="（任意）"
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                  value={nick}
                  onChange={(e) => setNick(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm"
                >
                  登録してはじめる
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            <nav className="mb-3 grid grid-cols-6 gap-2">
              {[
                ["home", "ホーム"],
                ["daily", "日別"],
                ["monthly", "月別"],
                ["yearly", "年別"],
                ["directions", "方位"],
                ["persona", "性格/先天運"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={
                    "rounded-xl border px-3 py-2 text-sm " +
                    (tab === key
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700")
                  }
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* ホーム（TOP） */}
            {tab === "home" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-medium tracking-tight">運勢デザイン</div>
                  <div className="mt-2 text-base text-neutral-500">Fortune Design</div>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    四柱推命と九星気学を組み合わせた運勢アプリです。<br />
                    今日・今月・今年の運勢を手軽にチェックしましょう。
                  </p>
                  <hr className="my-6 border-neutral-200" />
                </div>
                <div className="space-y-6">
                  {/* ① 根拠＋日付・曜日 */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="mb-2 text-sm text-neutral-500">今日の運勢概要（{fmtWithWeekday(today)}）</div>
                    <BasisTable seed={`${dob}-${time}-${place}`} />
                  </div>
                  {/* ② 遁甲盤（円形・八方位） */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="mb-2 text-sm text-neutral-500">遁甲盤（簡易）</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <DunjiaCompass
                          luckyDirs={[lucky]}
                          unluckyDirs={[unlucky]}
                          tendo={ts.tendo}
                          saiha={ts.saiha}
                        />
                      </div>
                      <div className="grid content-start gap-2">
                        <Info label="Lucky Direction" value={lucky} />
                        <Info label="Unlucky Direction" value={unlucky} />
                        <Info label="天道" value={ts.tendo} />
                        <Info label="歳破" value={ts.saiha} />
                        <Info label="推奨時間帯" value={HOURS[seededIndex(dob + todayStr + "t", HOURS.length)]} />
                        <Info label="推奨プレイス" value={PLACES[seededIndex(dob + todayStr + "p", PLACES.length)]} />
                      </div>
                    </div>
                    </div>
                  {/* ③ 本日の総合まとめ */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="mb-2 text-sm text-neutral-500">本日の総合まとめ</div>
                    {dayData.length > 0 ? (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-base font-medium">総合運</div>
                          <Stars n={dayData[0].score} />
                        </div>
                        <p className="text-sm leading-7 text-neutral-700">{dayData[0].text}</p>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-500">登録情報を入力すると本日の概要が表示されます。</p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  ※ 本番では「年盤・月盤・日盤」「天道・歳破・暗剣殺」等の算出を実装し、精緻に表示します。
                </p>
              </section>
            )}

            {/* 性格・先天運（簡易） */}
            {tab === "persona" && (
              <section className={`${panelClass} p-5 sm:p-6`}>
                <div className="mb-2 text-sm text-neutral-500">あなたのタイプ（簡易）</div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="text-base font-medium">メイン傾向：{persona.main}</div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">{persona.text}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {persona.born.map((b) => (
                    <div key={b.key} className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-base font-medium">{b.key}</div>
                        <Stars n={b.score} />
                      </div>
                      <p className="text-sm text-neutral-500">生まれ持つ傾向（ダミー算出）。</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mx-auto mt-6 flex items-center justify-between text-xs text-neutral-500">
          <div>© 運勢デザイン – Prototype v0.4-fix3</div>
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

      <style>{` :root { --accent: ${accent}; } `}</style>
    </div>
  );
}
