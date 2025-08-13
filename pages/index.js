
 5 │ import React, { useEffect, useMemo, useState } from "react";
   ·        ──┬──
   ·          ╰── `React` redefined here
 6 │ 
 7 │ /**
 8 │  * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
   ╰────

  × the name `useEffect` is defined multiple times
   ╭─[C:\dev\unsei-design\pages\index.js:1:1]
 1 │ import React, { useEffect, useMemo, useState } from "react";
   ·                 ────┬────
   ·                     ╰── previous definition of `useEffect` here
 2 │ export default function Home() {
 3 │   return <div>ページ仮表示（Index）</div>;
 4 │ }
 5 │ import React, { useEffect, useMemo, useState } from "react";
   ·                 ────┬────
   ·                     ╰── `useEffect` redefined here
 6 │ 
 7 │ /**
 8 │  * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
   ╰────

  × the name `useMemo` is defined multiple times
   ╭─[C:\dev\unsei-design\pages\index.js:1:1]
 1 │ import React, { useEffect, useMemo, useState } from "react";
   ·                            ───┬───
   ·                               ╰── previous definition of `useMemo` here
 2 │ export default function Home() {
 3 │   return <div>ページ仮表示（Index）</div>;
 4 │ }
 5 │ import React, { useEffect, useMemo, useState } from "react";
   ·                            ───┬───
   ·                               ╰── `useMemo` redefined here
 6 │ 
 7 │ /**
 8 │  * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
   ╰────

  × the name `useState` is defined multiple times
   ╭─[C:\dev\unsei-design\pages\index.js:1:1]
 1 │ import React, { useEffect, useMemo, useState } from "react";
   ·                                     ────┬───
   ·                                         ╰── previous definition of `useState` here
 2 │ export default function Home() {
 3 │   return <div>ページ仮表示（Index）</div>;
 4 │ }
 5 │ import React, { useEffect, useMemo, useState } from "react";
   ·                                     ────┬───
   ·                                         ╰── `useState` redefined here
 6 │ 
 7 │ /**
 8 │  * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
   ╰────

  × the name `default` is exported multiple times
     ╭─[C:\dev\unsei-design\pages\index.js:1:1]
   1 │     import React, { useEffect, useMemo, useState } from "react";
   2 │ ╭─▶ export default function Home() {
   3 │ │     return <div>ページ仮表示（Index）</div>;
   4 │ ├─▶ }
     · ╰──── previous exported here
   5 │     import React, { useEffect, useMemo, useState } from "react";
   6 │     
   7 │     /**
   8 │      * 運勢デザイン｜四柱推命×九星気学（Web版プロトタイプ v0.4-fix3）
   9 │      * -----------------------------------------------------------
  10 │      * この版の目的：SyntaxError 修正とテスト強化
  11 │      * - JSX内の誤エスケープ（例: className=\"...）を除去
  12 │      * - 正規表現の不要なバックスラッシュ（\（, \））を削除
  13 │      * - 既存の簡易テストは維持しつつ、日付整形などのテストを追加
  14 │      * - 年盤→月盤→日盤の優先ロジック（ダミー）を関数化
  15 │      */
  16 │     
  17 │     // ---- 基本スタイル（Tailwind ユーティリティ想定） ----
  18 │     const appClass =
  19 │       "min-h-screen bg-neutral-50 text-neutral-800 antialiased selection:bg-neutral-900 selection:text-white";
  20 │     const panelClass = "rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200";
  21 │     const labelClass = "text-xs tracking-wide text-neutral-500"; // W1〜W2 相当
  22 │     const titleClass = "text-lg font-medium"; // W3 相当
  23 │     const h1Class = "text-2xl font-medium tracking-tight"; // W3〜W4 相当
  24 │     
  25 │     // ---- 共通ユーティリティ ----
  26 │     const fmtDate = (d) =>
  27 │       `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
  28 │         d.getDate()
  29 │       ).padStart(2, "0")}`;
  30 │     
  31 │     const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
  32 │     const fmtWithWeekday = (d) => `${fmtDate(d)}（${WEEKDAYS[d.getDay()]}）`;
  33 │     
  34 │     // 近似の節入り（定気法ではなく暫定固定日）。本実装で差替予定。
  35 │     const approxSetsu = (year) => [
  36 │       { key: "小寒", date: new Date(year, 0, 5) },
  37 │       { key: "立春", date: new Date(year, 1, 4) },
  38 │       { key: "啓蟄", date: new Date(year, 2, 6) },
  39 │       { key: "清明", date: new Date(year, 3, 5) },
  40 │       { key: "立夏", date: new Date(year, 4, 5) },
  41 │       { key: "芒種", date: new Date(year, 5, 6) },
  42 │       { key: "小暑", date: new Date(year, 6, 7) },
  43 │       { key: "立秋", date: new Date(year, 7, 7) },
  44 │       { key: "白露", date: new Date(year, 8, 8) },
  45 │       { key: "寒露", date: new Date(year, 9, 8) },
  46 │       { key: "立冬", date: new Date(year, 10, 7) },
  47 │       { key: "大雪", date: new Date(year, 11, 7) },
  48 │     ];
  49 │     
  50 │     const addDays = (d, days) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
  51 │     
  52 │     // 与えられた日付が属する「節入り月」の開始・終了（次の節入り前日）を返す
  53 │     const monthRangeSetsu = (base) => {
  54 │       const y = base.getFullYear();
  55 │       const prev = approxSetsu(y - 1).slice(-1); // 前年の大雪
  56 │       const curr = approxSetsu(y);
  57 │       const next = approxSetsu(y + 1).slice(0, 1); // 翌年の小寒だけ
  58 │       const all = [...prev, ...curr, ...next]
  59 │         .map((x) => x.date)
  60 │         .sort((a, b) => a.getTime() - b.getTime());
  61 │       let start = all[0],
  62 │         end = all[all.length - 1];
  63 │       for (let i = 0; i < all.length - 1; i++) {
  64 │         if (all[i] <= base && base < all[i + 1]) {
  65 │           start = all[i];
  66 │           end = addDays(all[i + 1], -1);
  67 │           break;
  68 │         }
  69 │       }
  70 │       return `${fmtDate(start)} 〜 ${fmtDate(end)}`;
  71 │     };
  72 │     
  73 │     // その年の立春〜翌年立春-1日を返す
  74 │     const yearRangeSetsu = (base) => {
  75 │       const y = base.getFullYear();
  76 │       const currRisshun = approxSetsu(y).find((s) => s.key === "立春").date;
  77 │       const nextRisshun = approxSetsu(y + 1).find((s) => s.key === "立春").date;
  78 │       return `${fmtDate(currRisshun)} 〜 ${fmtDate(addDays(nextRisshun, -1))}`;
  79 │     };
  80 │     
  81 │     // 年別：春夏秋冬を節入りで区切る（立春/立夏/立秋/立冬）
  82 │     const seasonRangesSetsu = (base) => {
  83 │       const y = base.getFullYear();
  84 │       const rs = approxSetsu(y).find((s) => s.key === "立春").date;
  85 │       const rk = approxSetsu(y).find((s) => s.key === "立夏").date;
  86 │       const ra = approxSetsu(y).find((s) => s.key === "立秋").date;
  87 │       const rt = approxSetsu(y).find((s) => s.key === "立冬").date;
  88 │       const nextRs = approxSetsu(y + 1).find((s) => s.key === "立春").date;
  89 │       return [
  90 │         { name: "春", start: fmtDate(rs), end: fmtDate(addDays(rk, -1)) },
  91 │         { name: "夏", start: fmtDate(rk), end: fmtDate(addDays(ra, -1)) },
  92 │         { name: "秋", start: fmtDate(ra), end: fmtDate(addDays(rt, -1)) },
  93 │         { name: "冬", start: fmtDate(rt), end: fmtDate(addDays(nextRs, -1)) },
  94 │       ];
  95 │     };
  96 │     
  97 │     const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
  98 │     const HOURS = [
  99 │       "5:00-7:00",
 100 │       "7:00-9:00",
 101 │       "9:00-11:00",
 102 │       "11:00-13:00",
 103 │       "13:00-15:00",
 104 │       "15:00-17:00",
 105 │       "17:00-19:00",
 106 │       "19:00-21:00",
 107 │     ];
 108 │     const COLORS = ["ブラック", "ホワイト", "グレー", "ネイビー", "ティール", "ボルドー", "オリーブ", "ラベンダー"];
 109 │     // 指定パレット（必要最小限で使用）
 110 │     const PALETTE = {
 111 │       c1: "#566a76", // 見出し/強調テキスト
 112 │       c2: "#182832", // プライマリ（ボタン/アクティブ）
 113 │       c3: "#595757", // 本文
 114 │       c4: "#898989", // サブテキスト/区切り
 115 │       c5: "#b5b5b6", // ライン淡
 116 │       c6: "#d3d3d3", // 罫線/プレースホルダ
 117 │       c7: "#f3d12f", // ゴールド（天道）
 118 │     };
 119 │     const ITEMS = ["細身のペン", "レザー手帳", "シルバーリング", "スニーカー", "名刺ケース", "ブレスレット", "スカーフ", "時計"];
 120 │     const PLACES = ["静かなカフェ", "図書館", "神社仏閣", "川沿い", "美術館", "公園", "高層ビルの展望", "自宅のワークスペース"];
 121 │     const PERSONS = ["年上の女性", "年上の男性", "同年代の友人", "後輩", "家族", "恩師", "初対面の人", "オンラインの知人"];
 122 │     const FOODS = ["おにぎり", "サンドイッチ", "味噌汁", "パスタ", "サラダ", "カレー", "蕎麦", "和菓子"];
 123 │     
 124 │     // ---- 乱数（シード安定） ----
 125 │     function seededIndex(seed, modulo) {
 126 │       let h = 0;
 127 │       for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
 128 │       h ^= h << 13;
 129 │       h ^= h >>> 17;
 130 │       h ^= h << 5;
 131 │       return Math.abs(h) % modulo;
 132 │     }
 133 │     
 134 │     // ---- ダミー占術ロジック（本実装TODO） ----
 135 │     const HEAVENLY = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
 136 │     const EARTHLY = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
 137 │     const FIVE = ["木", "火", "土", "金", "水"];
 138 │     
 139 │     function dummyMainStar(dateStr) {
 140 │       const n = dateStr.replace(/-/g, "").split("").reduce((a, b) => a + Number(b), 0);
 141 │       return n % 9 || 9; // 1〜9
 142 │     }
 143 │     
 144 │     function dummyPillars(seed) {
 145 │       const ys = HEAVENLY[seededIndex(seed + "y", HEAVENLY.length)];
 146 │       const yb = EARTHLY[seededIndex(seed + "Y", EARTHLY.length)];
 147 │       const ms = HEAVENLY[seededIndex(seed + "m", HEAVENLY.length)];
 148 │       const mb = EARTHLY[seededIndex(seed + "M", EARTHLY.length)];
 149 │       const ds = HEAVENLY[seededIndex(seed + "d", HEAVENLY.length)];
 150 │       const db = EARTHLY[seededIndex(seed + "D", EARTHLY.length)];
 151 │       const hs = HEAVENLY[seededIndex(seed + "h", HEAVENLY.length)];
 152 │       const hb = EARTHLY[seededIndex(seed + "H", EARTHLY.length)];
 153 │       const pillars = { year: ys + yb, month: ms + mb, day: ds + db, hour: hs + hb };
 154 │       const fiveCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
 155 │       [ys, ms, ds, hs].forEach((s) => {
 156 │         fiveCount[FIVE[HEAVENLY.indexOf(s) % 5]]++;
 157 │       });
 158 │       const dominant = Object.entries(fiveCount).sort((a, b) => b[1] - a[1])[0][0];
 159 │       return { pillars, fiveCount, dominant };
 160 │     }
 161 │     
 162 │     // 300字程度の説明文（ダミー）
 163 │     function genParagraph(seed) {
 164 │       const base = [
 165 │         "今日は基礎を丁寧に整えるほど成果が積み上がる運気です。",
 166 │         "人との関わり合いからヒントが生まれやすく、挨拶や短い会話にも価値があります。",
 167 │         "新しい挑戦は小さく始め、早めに方向修正できる余白を用意しておくと安心です。",
 168 │         "情報の選別と下調べが鍵。時間を決めて集中すると、迷いが減り判断が明瞭になります。",
 169 │         "感謝や労いの言葉を伝えると運が循環し、協力者が自然と集まってきます。",
 170 │         "過去のメモや写真を見返すとヒントが見つかる暗示。積み残しの案件にも光が差します。",
 171 │         "無理をせず休息を挟むことで発想が更新され、結果的に効率が上がります。",
 172 │       ];
 173 │       const i = seededIndex(seed, base.length);
 174 │       const text =
 175 │         base[i] +
 176 │         base[(i + 1) % base.length] +
 177 │         base[(i + 2) % base.length] +
 178 │         "小さな達成を言語化して自信に変えると、次の一歩が軽くなります。" +
 179 │         "丁寧さと誠実さが評価される日。焦らず、目の前のことを一つずつ仕上げましょう。";
 180 │       return text.slice(0, 320);
 181 │     }
 182 │     
 183 │     function luckPack(seed) {
 184 │       return {
 185 │         color: COLORS[seededIndex(seed + "c", COLORS.length)],
 186 │         item: ITEMS[seededIndex(seed + "i", ITEMS.length)],
 187 │         place: PLACES[seededIndex(seed + "p", PLACES.length)],
 188 │         person: PERSONS[seededIndex(seed + "r", PERSONS.length)],
 189 │         food: FOODS[seededIndex(seed + "f", FOODS.length)],
 190 │         time: HOURS[seededIndex(seed + "t", HOURS.length)],
 191 │         dir: DIRECTIONS[seededIndex(seed + "d", DIRECTIONS.length)],
 192 │       };
 193 │     }
 194 │     
 195 │     const CATEGORY_KEYS = ["総合運", "仕事運", "対人運", "金運", "恋愛運"];
 196 │     
 197 │     function buildResultBySeed(dob, seed) {
 198 │       return CATEGORY_KEYS.map((k, idx) => {
 199 │         const s = `${dob}-${seed}-${k}-${idx}-${dummyMainStar(dob)}`;
 200 │         return { key: k, score: seededIndex(s, 5) + 1, text: genParagraph(s), luck: luckPack(s) };
 201 │       });
 202 │     }
 203 │     
 204 │     // ---- UI部品 ----
 205 │     function Stars({ n }) {
 206 │       return (
 207 │         <div aria-label={`score-${n}`} className="tracking-tight">
 208 │           {Array.from({ length: 5 }).map((_, i) => (
 209 │             <span key={i} className={i < n ? "text-[var(--accent)]" : "text-neutral-300"}>
 210 │               ★
 211 │             </span>
 212 │           ))}
 213 │         </div>
 214 │       );
 215 │     }
 216 │     
 217 │     function Info({ label, value }) {
 218 │       return (
 219 │         <div className="rounded-lg bg-neutral-100 p-3">
 220 │           <div className={labelClass}>{label}</div>
 221 │           <div className="mt-1 text-sm">{value}</div>
 222 │         </div>
 223 │       );
 224 │     }
 225 │     
 226 │     function CategoryCard({ c }) {
 227 │       return (
 228 │         <div className="rounded-xl border border-neutral-200 bg-white p-4">
 229 │           <div className="mb-1 flex items-center justify-between">
 230 │             <div className="text-base font-medium">{c.key}</div>
 231 │             <Stars n={c.score} />
 232 │           </div>
 233 │           <p className="text-sm leading-7 text-neutral-700">{c.text}</p>
 234 │           <div className="mt-3 grid gap-2 sm:grid-cols-3">
 235 │             <Info label="ラッキーカラー" value={c.luck.color} />
 236 │             <Info label="ラッキーアイテム" value={c.luck.item} />
 237 │             <Info label="ラッキープレイス" value={c.luck.place} />
 238 │             <Info label="ラッキーパーソン" value={c.luck.person} />
 239 │             <Info label="ラッキーフード" value={c.luck.food} />
 240 │             <Info label="良い時間帯／方角" value={`${c.luck.time} ／ ${c.luck.dir}`} />
 241 │           </div>
 242 │         </div>
 243 │       );
 244 │     }
 245 │     
 246 │     function BasisTable({ seed }) {
 247 │       const { pillars, fiveCount, dominant } = useMemo(() => dummyPillars(seed), [seed]);
 248 │       return (
 249 │         <div className="overflow-hidden rounded-xl border border-neutral-200">
 250 │           <table className="w-full text-sm">
 251 │             <tbody>
 252 │               <tr className="bg-neutral-50">
 253 │                 <td className="p-2 w-32 text-neutral-500">命式（四柱）</td>
 254 │                 <td className="p-2">年：{pillars.year} ／ 月：{pillars.month} ／ 日：{pillars.day} ／ 時：{pillars.hour}</td>
 255 │               </tr>
 256 │               <tr>
 257 │                 <td className="p-2 text-neutral-500">十干</td>
 258 │                 <td className="p-2">年：{pillars.year[0]} ／ 月：{pillars.month[0]} ／ 日：{pillars.day[0]} ／ 時：{pillars.hour[0]}</td>
 259 │               </tr>
 260 │               <tr className="bg-neutral-50">
 261 │                 <td className="p-2 text-neutral-500">十二支</td>
 262 │                 <td className="p-2">年：{pillars.year[1]} ／ 月：{pillars.month[1]} ／ 日：{pillars.day[1]} ／ 時：{pillars.hour[1]}</td>
 263 │               </tr>
 264 │               <tr>
 265 │                 <td className="p-2 text-neutral-500">五行バランス</td>
 266 │                 <td className="p-2">
 267 │                   木:{fiveCount["木"]} 火:{fiveCount["火"]} 土:{fiveCount["土"]} 金:{fiveCount["金"]} 水:{fiveCount["水"]}
 268 │                   （主：{dominant}）
 269 │                 </td>
 270 │               </tr>
 271 │             </tbody>
 272 │           </table>
 273 │         </div>
 274 │       );
 275 │     }
 276 │     
 277 │     function DunjiaCompass({ luckyDirs = [], unluckyDirs = [], tendo, saiha }) {
 278 │       // 円形の八方位（北を上に、反時計回りに45°刻み）
 279 │       const size = 260;
 280 │       const r = 100;
 281 │       const cx = size / 2;
 282 │       const cy = size / 2;
 283 │       const toRad = (deg) => (deg * Math.PI) / 180;
 284 │       const centerAngle = (i) => -90 + i * 45; // 北=-90°
 285 │       const wedgePath = (i) => {
 286 │         const start = toRad(centerAngle(i) - 22.5);
 287 │         const end = toRad(centerAngle(i) + 22.5);
 288 │         const sx = cx + Math.cos(start) * r;
 289 │         const sy = cy + Math.sin(start) * r;
 290 │         const ex = cx + Math.cos(end) * r;
 291 │         const ey = cy + Math.sin(end) * r;
 292 │         const laf = end - start > Math.PI ? 1 : 0;
 293 │         return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${laf} 1 ${ex} ${ey} Z`;
 294 │       };
 295 │       const markAt = (dir, color, radius = r + 14, sizePx = 6) => {
 296 │         const i = DIRECTIONS.indexOf(dir);
 297 │         if (i < 0) return null;
 298 │         const a = toRad(centerAngle(i));
 299 │         const x = cx + Math.cos(a) * radius;
 300 │         const y = cy + Math.sin(a) * radius;
 301 │         return <circle key={`m-${dir}-${color}`} cx={x} cy={y} r={sizePx} fill={color} stroke="#fff" strokeWidth={2} />;
 302 │       };
 303 │       const isLucky = (d) => luckyDirs.includes(d);
 304 │       const isUnlucky = (d) => unluckyDirs.includes(d);
 305 │       // パレットに合わせた控えめな色分け
 306 │       const luckyFill = "rgba(24,40,50,0.22)"; // c2ベース
 307 │       const luckyStroke = PALETTE.c2;
 308 │       const unluckyFill = "rgba(137,137,137,0.22)"; // c4ベース
 309 │       const unluckyStroke = PALETTE.c4;
 310 │       const tendoColor = PALETTE.c7; // ゴールド
 311 │       const saihaColor = PALETTE.c1; // 濃グレー
 312 │     
 313 │       return (
 314 │         <svg width={size} height={size} className="mx-auto block">
 315 │           {/* 土台 */}
 316 │           <circle cx={cx} cy={cy} r={r + 12} fill="#fff" stroke={PALETTE.c6} />
 317 │           {/* 8つの扇形 */}
 318 │           {DIRECTIONS.map((d, i) => {
 319 │             const fill = isLucky(d) ? luckyFill : isUnlucky(d) ? unluckyFill : "#f8fafc";
 320 │             const stroke = isUnlucky(d) ? unluckyStroke : isLucky(d) ? luckyStroke : PALETTE.c6;
 321 │             return <path key={`w-${d}`} d={wedgePath(i)} fill={fill} stroke={stroke} strokeWidth={1.5} />;
 322 │           })}
 323 │           {/* 放射ガイド線と方位ラベル */}
 324 │           {DIRECTIONS.map((d, i) => {
 325 │             const a = toRad(centerAngle(i));
 326 │             const x = cx + Math.cos(a) * r;
 327 │             const y = cy + Math.sin(a) * r;
 328 │             return (
 329 │               <g key={`g-${d}`}>
 330 │                 <line x1={cx} y1={cy} x2={x} y2={y} stroke={PALETTE.c6} />
 331 │                 <text x={cx + Math.cos(a) * (r + 26)} y={cy + Math.sin(a) * (r + 26)} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={PALETTE.c3}>
 332 │                   {d}
 333 │                 </text>
 334 │               </g>
 335 │             );
 336 │           })}
 337 │           {/* 中心点 */}
 338 │           <circle cx={cx} cy={cy} r={3} fill={PALETTE.c5} />
 339 │           {/* 天道・歳破のマーカー */}
 340 │           {tendo && markAt(tendo, tendoColor, r + 16, 7)}
 341 │           {saiha && markAt(saiha, saihaColor, r + 16, 5)}
 342 │           {/* 凡例 */}
 343 │           <g transform={`translate(${cx - 70}, ${cy + r + 36})`}>
 344 │             <rect x={0} y={-10} width={140} height={26} fill="#ffffff" stroke={PALETTE.c6} rx={6} />
 345 │             <circle cx={10} cy={3} r={5} fill={luckyStroke} />
 346 │             <text x={20} y={6} fontSize={11} fill={PALETTE.c3}>吉方位</text>
 347 │             <circle cx={60} cy={3} r={5} fill={unluckyStroke} />
 348 │             <text x={70} y={6} fontSize={11} fill={PALETTE.c3}>凶方位</text>
 349 │           </g>
 350 │           <g transform={`translate(${cx - 70}, ${cy + r + 64})`}>
 351 │             <rect x={0} y={-10} width={140} height={26} fill="#ffffff" stroke={PALETTE.c6} rx={6} />
 352 │             <circle cx={10} cy={3} r={5} fill={tendoColor} />
 353 │             <text x={20} y={6} fontSize={11} fill={PALETTE.c3}>天道</text>
 354 │             <circle cx={60} cy={3} r={5} fill={saihaColor} />
 355 │             <text x={70} y={6} fontSize={11} fill={PALETTE.c3}>歳破</text>
 356 │           </g>
 357 │         </svg>
 358 │       );
 359 │     }
 360 │     
 361 │     // ダミー：天道・歳破の方位（※本実装で正確な計算に差し替え）
 362 │     function dummyTendoDir(seed) {
 363 │       return DIRECTIONS[seededIndex(seed + "TEN", 8)];
 364 │     }
 365 │     function dummySaihaDir(seed) {
 366 │       return DIRECTIONS[seededIndex(seed + "SAI", 8)];
 367 │     }
 368 │     
 369 │     // 年盤優先→月盤→日盤（ダミー導出）
 370 │     function prioritizedTendoSaiha(dob, date) {
 371 │       const ySeed = String(date.getFullYear());
 372 │       const mSeed = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
 373 │       const dSeed = fmtDate(date);
 374 │       const tendo = dummyTendoDir(ySeed) || dummyTendoDir(mSeed) || dummyTendoDir(dSeed);
 375 │       const saiha = dummySaihaDir(ySeed) || dummySaihaDir(mSeed) || dummySaihaDir(dSeed);
 376 │       return { tendo, saiha };
 377 │     }
 378 │     
 379 │     // ---- 開発用 簡易テスト ----
 380 │     function runDevTests() {
 381 │       const y = 2025;
 382 │       const today = new Date("2025-08-11T00:00:00+09:00");
 383 │       // approxSetsu: 12節が返る
 384 │       console.assert(approxSetsu(y).length === 12, "approxSetsu should return 12 items");
 385 │       // monthRangeSetsu: フォーマット確認
 386 │       const m = monthRangeSetsu(today);
 387 │       console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(m), "monthRangeSetsu format");
 388 │       // yearRangeSetsu: 立春〜翌立春-1日
 389 │       const yr = yearRangeSetsu(today);
 390 │       console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(yr), "yearRangeSetsu format");
 391 │       // seasonRangesSetsu: 4区分
 392 │       console.assert(seasonRangesSetsu(today).length === 4, "seasonRangesSetsu should have 4 seasons");
 393 │       // buildResultBySeed: 5カテゴリ
 394 │       const sample = buildResultBySeed("1990-01-01", "seed");
 395 │       console.assert(sample.length === 5, "5 categories expected");
 396 │       console.assert(sample.every((c) => c.score >= 1 && c.score <= 5), "scores within 1..5");
 397 │       console.assert(sample.every((c) => typeof c.text === "string" && c.text.length >= 50), "text length >= 50");
 398 │       // 追加テスト：曜日表記（全角括弧）
 399 │       const now = new Date();
 400 │       console.assert(/（[日月火水木金土]）$/.test(fmtWithWeekday(now)), "weekday label format");
 401 │       // 方位の妥当性＋優先ロジックの戻り
 402 │       console.assert(DIRECTIONS.includes(dummyTendoDir("seed")), "tendo dir valid");
 403 │       console.assert(DIRECTIONS.includes(dummySaihaDir("seed")), "saiha dir valid");
 404 │       const tsTest = prioritizedTendoSaiha("1990-01-01", new Date());
 405 │       console.assert(DIRECTIONS.includes(tsTest.tendo) && DIRECTIONS.includes(tsTest.saiha), "prioritized tendo/saiha valid");
 406 │       // fmtDate の境界
 407 │       console.assert(fmtDate(new Date(2025, 0, 1)) === "2025-01-01", "fmtDate pads 0");
 408 │     }
 409 │     
 410 │     if (typeof window !== "undefined") {
 411 │       try {
 412 │         runDevTests();
 413 │       } catch (e) {
 414 │         console.error("dev tests failed", e);
 415 │       }
 416 │     }
 417 │     
 418 │     // ---- ルート ----
 419 │ ╭─▶ export default function App() {
 420 │ │     // 入力
 421 │ │     const [dob, setDob] = useState("");
 422 │ │     const [email, setEmail] = useState("");
 423 │ │     const [nick, setNick] = useState("");
 424 │ │     const [time, setTime] = useState("12:00");
 425 │ │     const [place, setPlace] = useState("");
 426 │ │     const [gender, setGender] = useState("未選択");
 427 │ │     const [registered, setRegistered] = useState(false);
 428 │ │   
 429 │ │     // UI state
 430 │ │     const [accent, setAccent] = useState(PALETTE.c2); // 可変
 431 │ │     const [tab, setTab] = useState("home"); // home/daily/monthly/yearly/directions/persona
 432 │ │   
 433 │ │     useEffect(() => {
 434 │ │       try {
 435 │ │         const saved = localStorage.getItem("unsei-design-profile");
 436 │ │         if (saved) {
 437 │ │           const p = JSON.parse(saved);
 438 │ │           setDob(p.dob || "");
 439 │ │           setEmail(p.email || "");
 440 │ │           setNick(p.nick || "");
 441 │ │           setTime(p.time || "12:00");
 442 │ │           setPlace(p.place || "");
 443 │ │           setGender(p.gender || "未選択");
 444 │ │           if (p.dob) setRegistered(true);
 445 │ │         }
 446 │ │       } catch (_) {}
 447 │ │     }, []);
 448 │ │   
 449 │ │     const today = useMemo(() => new Date(), []);
 450 │ │     const todayStr = fmtDate(today);
 451 │ │     const ts = useMemo(() => prioritizedTendoSaiha(dob, today), [dob, todayStr]);
 452 │ │   
 453 │ │     // データ生成（検証用）
 454 │ │     const daySeed = `${todayStr}`;
 455 │ │     const monthSeed = `${today.getFullYear()}-${today.getMonth() + 1}-setsu`;
 456 │ │     const yearSeed = `${today.getFullYear()}`;
 457 │ │   
 458 │ │     const dayData = useMemo(() => (dob ? buildResultBySeed(dob, daySeed) : []), [dob, daySeed]);
 459 │ │     const monthData = useMemo(() => (dob ? buildResultBySeed(dob, monthSeed) : []), [dob, monthSeed]);
 460 │ │   
 461 │ │     const handleRegister = (e) => {
 462 │ │       e.preventDefault();
 463 │ │       if (!dob) return alert("生年月日を入力してください");
 464 │ │       if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("メール形式が不正です");
 465 │ │       localStorage.setItem(
 466 │ │         "unsei-design-profile",
 467 │ │         JSON.stringify({ dob, email, nick, time, place, gender })
 468 │ │       );
 469 │ │       setRegistered(true);
 470 │ │     };
 471 │ │   
 472 │ │     // 性格・先天運（ダミー）
 473 │ │     const persona = useMemo(() => {
 474 │ │       const seeds = ["分析型", "社交型", "直感型", "勤勉型", "創造型"];
 475 │ │       const main = seeds[seededIndex(dob + gender + place, seeds.length)] || seeds[0];
 476 │ │       const text = genParagraph(dob + gender + place + "persona");
 477 │ │       const born = CATEGORY_KEYS.map((k) => ({ key: k, score: seededIndex(dob + k + "born", 5) + 1 }));
 478 │ │       return { main, text, born };
 479 │ │     }, [dob, gender, place]);
 480 │ │   
 481 │ │     const lucky = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "L", DIRECTIONS.length)] || DIRECTIONS[0], [dob, daySeed]);
 482 │ │     const unlucky = useMemo(() => DIRECTIONS[seededIndex(dob + daySeed + "U", DIRECTIONS.length)] || DIRECTIONS[4], [dob, daySeed]);
 483 │ │   
 484 │ │     return (
 485 │ │       <div
 486 │ │         className={appClass}
 487 │ │         style={{
 488 │ │           fontFamily:
 489 │ │             "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'ヒラギノ角ゴ ProN W3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans JP', 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif",
 490 │ │           // @ts-ignore
 491 │ │           "--accent": accent,
 492 │ │         }}
 493 │ │       >
 494 │ │         <div className="mx-auto max-w-2xl p-4 sm:p-6">
 495 │ │           <header className="mb-4 flex items-center justify-between">
 496 │ │             <h1 className={h1Class}>運勢デザイン</h1>
 497 │ │             <div className="flex items-center gap-3">
 498 │ │               <div className="hidden sm:block text-xs text-neutral-500">{fmtDate(today)}</div>
 499 │ │               <label className="inline-flex items-center gap-2 text-xs text-neutral-500">
 500 │ │                 <span>Accent</span>
 501 │ │                 <input
 502 │ │                   type="color"
 503 │ │                   className="h-6 w-6 rounded border border-neutral-200"
 504 │ │                   value={accent}
 505 │ │                   onChange={(e) => setAccent(e.target.value)}
 506 │ │                 />
 507 │ │               </label>
 508 │ │             </div>
 509 │ │           </header>
 510 │ │   
 511 │ │           {!registered ? (
 512 │ │             <section className={`${panelClass} p-5 sm:p-6`}>
 513 │ │               <div className="mb-4">
 514 │ │                 <div className={titleClass}>はじめに</div>
 515 │ │                 <p className="mt-1 text-sm text-neutral-600">
 516 │ │                   生年月日・出生時間・出生地・性別を登録すると、詳しい運勢が表示されます。
 517 │ │                 </p>
 518 │ │               </div>
 519 │ │               <form className="grid gap-4" onSubmit={handleRegister}>
 520 │ │                 <div>
 521 │ │                   <label className={labelClass}>生年月日</label>
 522 │ │                   <input
 523 │ │                     type="date"
 524 │ │                     className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
 525 │ │                     value={dob}
 526 │ │                     onChange={(e) => setDob(e.target.value)}
 527 │ │                     required
 528 │ │                   />
 529 │ │                 </div>
 530 │ │                 <div className="grid grid-cols-2 gap-3">
 531 │ │                   <div>
 532 │ │                     <label className={labelClass}>出生時間</label>
 533 │ │                     <input
 534 │ │                       type="time"
 535 │ │                       className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
 536 │ │                       value={time}
 537 │ │                       onChange={(e) => setTime(e.target.value)}
 538 │ │                     />
 539 │ │                   </div>
 540 │ │                   <div>
 541 │ │                     <label className={labelClass}>性別</label>
 542 │ │                     <select
 543 │ │                       className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm"
 544 │ │                       value={gender}
 545 │ │                       onChange={(e) => setGender(e.target.value)}
 546 │ │                     >
 547 │ │                       <option>未選択</option>
 548 │ │                       <option>女性</option>
 549 │ │                       <option>男性</option>
 550 │ │                       <option>その他</option>
 551 │ │                     </select>
 552 │ │                   </div>
 553 │ │                 </div>
 554 │ │                 <div>
 555 │ │                   <label className={labelClass}>出生地</label>
 556 │ │                   <input
 557 │ │                     type="text"
 558 │ │                     placeholder="例：岐阜県岐阜市"
 559 │ │                     className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
 560 │ │                     value={place}
 561 │ │                     onChange={(e) => setPlace(e.target.value)}
 562 │ │                   />
 563 │ │                 </div>
 564 │ │                 <div>
 565 │ │                   <label className={labelClass}>メールアドレス</label>
 566 │ │                   <input
 567 │ │                     type="email"
 568 │ │                     placeholder="（任意）"
 569 │ │                     className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
 570 │ │                     value={email}
 571 │ │                     onChange={(e) => setEmail(e.target.value)}
 572 │ │                   />
 573 │ │                 </div>
 574 │ │                 <div>
 575 │ │                   <label className={labelClass}>ニックネーム</label>
 576 │ │                   <input
 577 │ │                     type="text"
 578 │ │                     placeholder="（任意）"
 579 │ │                     className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 p-2 text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
 580 │ │                     value={nick}
 581 │ │                     onChange={(e) => setNick(e.target.value)}
 582 │ │                   />
 583 │ │                 </div>
 584 │ │                 <div className="pt-2">
 585 │ │                   <button
 586 │ │                     type="submit"
 587 │ │                     className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm"
 588 │ │                   >
 589 │ │                     登録してはじめる
 590 │ │                   </button>
 591 │ │                 </div>
 592 │ │               </form>
 593 │ │             </section>
 594 │ │           ) : (
 595 │ │             <>
 596 │ │               <nav className="mb-3 grid grid-cols-6 gap-2">
 597 │ │                 {[
 598 │ │                   ["home", "ホーム"],
 599 │ │                   ["daily", "日別"],
 600 │ │                   ["monthly", "月別"],
 601 │ │                   ["yearly", "年別"],
 602 │ │                   ["directions", "方位"],
 603 │ │                   ["persona", "性格/先天運"],
 604 │ │                 ].map(([key, label]) => (
 605 │ │                   <button
 606 │ │                     key={key}
 607 │ │                     onClick={() => setTab(key)}
 608 │ │                     className={
 609 │ │                       "rounded-xl border px-3 py-2 text-sm " +
 610 │ │                       (tab === key
 611 │ │                         ? "border-neutral-900 bg-neutral-900 text-white"
 612 │ │                         : "border-neutral-200 bg-white text-neutral-700")
 613 │ │                     }
 614 │ │                   >
 615 │ │                     {label}
 616 │ │                   </button>
 617 │ │                 ))}
 618 │ │               </nav>
 619 │ │   
 620 │ │               {/* ホーム（TOP） */}
 621 │ │               {tab === "home" && (
 622 │ │                 <section className={`${panelClass} p-6 sm:p-8`}>
 623 │ │                   <div className="text-center">
 624 │ │                     <div className="text-3xl sm:text-5xl font-medium tracking-tight">運勢デザイン</div>
 625 │ │                     <div className="mt-2 text-base text-neutral-500">Fortune Design</div>
 626 │ │                     <p className="mt-3 text-sm leading-7 text-neutral-600">
 627 │ │                       四柱推命と九星気学を組み合わせた運勢アプリです。<br />
 628 │ │                       今日・今月・今年の運勢を手軽にチェックしましょう。
 629 │ │                     </p>
 630 │ │                     <hr className="my-6 border-neutral-200" />
 631 │ │                   </div>
 632 │ │                   <div className="space-y-6">
 633 │ │                     {/* ① 根拠＋日付・曜日 */}
 634 │ │                     <div className="rounded-xl border border-neutral-200 bg-white p-4">
 635 │ │                       <div className="mb-2 text-sm text-neutral-500">今日の運勢概要（{fmtWithWeekday(today)}）</div>
 636 │ │                       <BasisTable seed={`${dob}-${time}-${place}`} />
 637 │ │                     </div>
 638 │ │                     {/* ② 遁甲盤（円形・八方位） */}
 639 │ │                     <div className="rounded-xl border border-neutral-200 bg-white p-4">
 640 │ │                       <div className="mb-2 text-sm text-neutral-500">遁甲盤（簡易）</div>
 641 │ │                       <div className="grid gap-4 sm:grid-cols-2">
 642 │ │                         <div>
 643 │ │                           <DunjiaCompass
 644 │ │                             luckyDirs={[lucky]}
 645 │ │                             unluckyDirs={[unlucky]}
 646 │ │                             tendo={ts.tendo}
 647 │ │                             saiha={ts.saiha}
 648 │ │                           />
 649 │ │                         </div>
 650 │ │                         <div className="grid content-start gap-2">
 651 │ │                           <Info label="Lucky Direction" value={lucky} />
 652 │ │                           <Info label="Unlucky Direction" value={unlucky} />
 653 │ │                           <Info label="天道" value={ts.tendo} />
 654 │ │                           <Info label="歳破" value={ts.saiha} />
 655 │ │                           <Info label="推奨時間帯" value={HOURS[seededIndex(dob + todayStr + "t", HOURS.length)]} />
 656 │ │                           <Info label="推奨プレイス" value={PLACES[seededIndex(dob + todayStr + "p", PLACES.length)]} />
 657 │ │                         </div>
 658 │ │                       </div>
 659 │ │                       </div>
 660 │ │                     {/* ③ 本日の総合まとめ */}
 661 │ │                     <div className="rounded-xl border border-neutral-200 bg-white p-4">
 662 │ │                       <div className="mb-2 text-sm text-neutral-500">本日の総合まとめ</div>
 663 │ │                       {dayData.length > 0 ? (
 664 │ │                         <>
 665 │ │                           <div className="mb-2 flex items-center justify-between">
 666 │ │                             <div className="text-base font-medium">総合運</div>
 667 │ │                             <Stars n={dayData[0].score} />
 668 │ │                           </div>
 669 │ │                           <p className="text-sm leading-7 text-neutral-700">{dayData[0].text}</p>
 670 │ │                         </>
 671 │ │                       ) : (
 672 │ │                         <p className="text-sm text-neutral-500">登録情報を入力すると本日の概要が表示されます。</p>
 673 │ │                       )}
 674 │ │                     </div>
 675 │ │                   </div>
 676 │ │                   <p className="mt-3 text-xs text-neutral-500">
 677 │ │                     ※ 本番では「年盤・月盤・日盤」「天道・歳破・暗剣殺」等の算出を実装し、精緻に表示します。
 678 │ │                   </p>
 679 │ │                 </section>
 680 │ │               )}
 681 │ │   
 682 │ │               {/* 性格・先天運（簡易） */}
 683 │ │               {tab === "persona" && (
 684 │ │                 <section className={`${panelClass} p-5 sm:p-6`}>
 685 │ │                   <div className="mb-2 text-sm text-neutral-500">あなたのタイプ（簡易）</div>
 686 │ │                   <div className="rounded-xl border border-neutral-200 bg-white p-4">
 687 │ │                     <div className="text-base font-medium">メイン傾向：{persona.main}</div>
 688 │ │                     <p className="mt-2 text-sm leading-7 text-neutral-700">{persona.text}</p>
 689 │ │                   </div>
 690 │ │                   <div className="mt-4 grid gap-3 sm:grid-cols-2">
 691 │ │                     {persona.born.map((b) => (
 692 │ │                       <div key={b.key} className="rounded-xl border border-neutral-200 bg-white p-4">
 693 │ │                         <div className="mb-1 flex items-center justify-between">
 694 │ │                           <div className="text-base font-medium">{b.key}</div>
 695 │ │                           <Stars n={b.score} />
 696 │ │                         </div>
 697 │ │                         <p className="text-sm text-neutral-500">生まれ持つ傾向（ダミー算出）。</p>
 698 │ │                       </div>
 699 │ │                     ))}
 700 │ │                   </div>
 701 │ │                 </section>
 702 │ │               )}
 703 │ │             </>
 704 │ │           )}
 705 │ │   
 706 │ │           <footer className="mx-auto mt-6 flex items-center justify-between text-xs text-neutral-500">
 707 │ │             <div>© 運勢デザイン – Prototype v0.4-fix3</div>
 708 │ │             <button
 709 │ │               className="underline-offset-2 hover:underline"
 710 │ │               onClick={() => {
 711 │ │                 localStorage.removeItem("unsei-design-profile");
 712 │ │                 location.reload();
 713 │ │               }}
 714 │ │             >
 715 │ │               登録情報をリセット
 716 │ │             </button>
 717 │ │           </footer>
 718 │ │         </div>
 719 │ │   
 720 │ │         <style>{` :root { --accent: ${accent}; } `}</style>
 721 │ │       </div>
 722 │ │     );
 723 │ ├─▶ }
     · ╰──── exported more than once
     ╰────

Error: 
  ☞ Exported identifiers must be unique
This error occurred during the build process and can only be dismissed by fixing the error.