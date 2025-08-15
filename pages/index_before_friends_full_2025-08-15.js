import React, { useEffect, useMemo, useState } from "react";

/**
 * 運勢デザイン v0.7
 * - 日/月/年ページ：
 *   ・見出しの上に「ニックネームさんの」を追加
 *   ・基本情報（本命星・月命星・傾斜・年同会/被同会 ほか）を表示
 *   ・★→100点満点の評価バー
 *   ・日別：日盤+月盤+年盤、月別：月盤+年盤、年別：年盤
 *   ・期間表記を大きく太く
 *   ・カレンダーで日付移動（時刻入力付き）
 * - ユーザー情報モーダル：基本情報を併記、ニックネームを生年月日の上に
 */

const SHOW_ACCENT_PICKER = false;

// ---- 基本スタイル ----
const appClass = "min-h-screen bg-[#F2F4F6] text-neutral-800 antialiased selection:bg-neutral-900 selection:text-white";
const panelClass = "rounded-2xl bg-neutral-50 shadow-sm ring-1 ring-neutral-300";
const labelClass = "text-xs tracking-wide text-neutral-600 font-light";
const titleClass = "text-lg font-medium";
const h1Class = "text-2xl font-semibold tracking-tight";

// ---- 共通ユーティリティ ----
const WEEKDAYS = ["日","月","火","水","木","金","土"];
const fmtDate = (d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmtWithWeekday = (d)=>`${fmtDate(d)}（${WEEKDAYS[d.getDay()]}）`;
const addDays = (d,days)=>new Date(d.getFullYear(), d.getMonth(), d.getDate()+days);

const approxSetsu = (year)=>[
  { key:"小寒", date:new Date(year,0,5) }, { key:"立春", date:new Date(year,1,4) }, { key:"啓蟄", date:new Date(year,2,6) },
  { key:"清明", date:new Date(year,3,5) }, { key:"立夏", date:new Date(year,4,5) }, { key:"芒種", date:new Date(year,5,6) },
  { key:"小暑", date:new Date(year,6,7) }, { key:"立秋", date:new Date(year,7,7) }, { key:"白露", date:new Date(year,8,8) },
  { key:"寒露", date:new Date(year,9,8) }, { key:"立冬", date:new Date(year,10,7)}, { key:"大雪", date:new Date(year,11,7)}
];

const monthRangeSetsu=(base)=>{
  const y=base.getFullYear(), prev=approxSetsu(y-1).slice(-1), curr=approxSetsu(y), next=approxSetsu(y+1).slice(0,1);
  const all=[...prev,...curr,...next].map(x=>x.date).sort((a,b)=>a-b);
  let start=all[0], end=all[all.length-1];
  for(let i=0;i<all.length-1;i++){ if(all[i]<=base && base<all[i+1]){ start=all[i]; end=addDays(all[i+1],-1); break; } }
  return `${fmtDate(start)} 〜 ${fmtDate(end)}`;
};
const yearRangeSetsu=(base)=>{
  const y=base.getFullYear(), r=approxSetsu(y).find(s=>s.key==="立春").date, next=approxSetsu(y+1).find(s=>s.key==="立春").date;
  return `${fmtDate(r)} 〜 ${fmtDate(addDays(next,-1))}`;
};
const seasonRangesSetsu=(base)=>{
  const y=base.getFullYear(), rs=approxSetsu(y).find(s=>s.key==="立春").date, rk=approxSetsu(y).find(s=>s.key==="立夏").date;
  const ra=approxSetsu(y).find(s=>s.key==="立秋").date, rt=approxSetsu(y).find(s=>s.key==="立冬").date, nextRs=approxSetsu(y+1).find(s=>s.key==="立春").date;
  return [
    {name:"春", start:fmtDate(rs), end:fmtDate(addDays(rk,-1))},
    {name:"夏", start:fmtDate(rk), end:fmtDate(addDays(ra,-1))},
    {name:"秋", start:fmtDate(ra), end:fmtDate(addDays(rt,-1))},
    {name:"冬", start:fmtDate(rt), end:fmtDate(addDays(nextRs,-1))}
  ];
};

const DIRECTIONS=["北","北東","東","南東","南","南西","西","北西"];
const HOURS=["5:00-7:00","7:00-9:00","9:00-11:00","11:00-13:00","13:00-15:00","15:00-17:00","17:00-19:00","19:00-21:00"];
const PALETTE={ c1:"#566a76", c2:"#3C5768", c3:"#595757", c4:"#898989", c5:"#b5b5b6", c6:"#d3d3d3", c7:"#f3d12f" };
const COLORS=["ブラック","ホワイト","グレー","ネイビー","ティール","ボルドー","オリーブ","ラベンダー"];
const ITEMS=["細身のペン","レザー手帳","シルバーリング","スニーカー","名刺ケース","ブレスレット","スカーフ","時計"];
const PLACES=["静かなカフェ","図書館","神社仏閣","川沿い","美術館","公園","展望","自宅ワークスペース"];
const PERSONS=["年上の女性","年上の男性","同年代の友人","後輩","家族","恩師","初対面","オンラインの知人"];
const FOODS=["おにぎり","サンドイッチ","味噌汁","パスタ","サラダ","カレー","蕎麦","和菓子"];

// ---- ダミー算出（簡易ロジックで見た目確認用） ----
function seededIndex(seed,mod){ let h=0; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0; h^=h<<13; h^=h>>>17; h^=h<<5; return Math.abs(h)%mod; }
const HEAVENLY=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EARTHLY =["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const FIVE    =["木","火","土","金","水"];

function dummyMainStar(dateStr){ const n=dateStr.replace(/-/g,"").split("").reduce((a,b)=>a+Number(b),0); return n%9||9; }
function nineStarName(n){ return ["一白水星","二黒土星","三碧木星","四緑木星","五黄土星","六白金星","七赤金星","八白土星","九紫火星"][((n-1)%9+9)%9]; }
function dummyMonthStar(seed){ return seededIndex(seed+"month-star",9)+1; }
function dummyKeisha(seed){ return ["南傾斜","北傾斜","東傾斜","西傾斜","傾斜なし"][seededIndex(seed+"keisha",5)]; }
function dummyDoukai(seed){ return nineStarName(seededIndex(seed+"same",9)+1); }
function dummyHiDoukai(seed){ return nineStarName(seededIndex(seed+"anti",9)+1); }

function dummyPillars(seed){
  const ys=HEAVENLY[seededIndex(seed+"y",10)], yb=EARTHLY[seededIndex(seed+"Y",12)];
  const ms=HEAVENLY[seededIndex(seed+"m",10)], mb=EARTHLY[seededIndex(seed+"M",12)];
  const ds=HEAVENLY[seededIndex(seed+"d",10)], db=EARTHLY[seededIndex(seed+"D",12)];
  const hs=HEAVENLY[seededIndex(seed+"h",10)], hb=EARTHLY[seededIndex(seed+"H",12)];
  const pillars={ year:ys+yb, month:ms+mb, day:ds+db, hour:hs+hb };
  const fiveCount={木:0,火:0,土:0,金:0,水:0};
  [ys,ms,ds,hs].forEach(s=>{ fiveCount[FIVE[HEAVENLY.indexOf(s)%5]]++; });
  const dominant=Object.entries(fiveCount).sort((a,b)=>b[1]-a[1])[0][0];
  return {pillars,fiveCount,dominant};
}

function genParagraph(seed){
  const base=[
    "今日は基礎を丁寧に整えるほど成果が積み上がる運気です。",
    "人との関わり合いからヒントが生まれやすく、挨拶や短い会話にも価値があります。",
    "新しい挑戦は小さく始め、早めに方向修正できる余白を用意しておくと安心です。",
    "情報の選別と下調べが鍵。時間を決めて集中すると、迷いが減り判断が明瞭になります。",
    "感謝や労いの言葉を伝えると運が循環し、協力者が自然と集まってきます。",
    "過去のメモや写真を見返すとヒントが見つかる暗示。積み残しの案件にも光が差します。",
    "無理をせず休息を挟むことで発想が更新され、結果的に効率が上がります。"
  ];
  const i=seededIndex(seed,base.length);
  const t=base[i]+base[(i+1)%base.length]+base[(i+2)%base.length]+"小さな達成を言語化して自信に変えると、次の一歩が軽くなります。丁寧さと誠実さが評価される日。焦らず、目の前のことを一つずつ仕上げましょう。";
  return t.slice(0,320);
}

const CATEGORY_KEYS=["総合運","仕事運","対人運","金運","恋愛運"];
function buildResultBySeed(dob,seed){
  return CATEGORY_KEYS.map((k,idx)=>{
    const s=`${dob}-${seed}-${k}-${idx}-${dummyMainStar(dob)}`;
    const score100 = seededIndex(s,101); // 0..100
    return { key:k, score100, text:genParagraph(s),
      luck:{
        color:COLORS[seededIndex(s+"c",COLORS.length)],
        item: ITEMS[seededIndex(s+"i",ITEMS.length)],
        place:PLACES[seededIndex(s+"p",PLACES.length)],
        person:PERSONS[seededIndex(s+"r",PERSONS.length)],
        food:  FOODS[seededIndex(s+"f",FOODS.length)],
        time:  HOURS[seededIndex(s+"t",HOURS.length)],
        dir:   DIRECTIONS[seededIndex(s+"d",DIRECTIONS.length)]
      }
    };
  });
}

// ---- UI部品 ----
function Info({label,value}){ return(
  <div className="rounded-lg bg-neutral-100 border border-neutral-300 p-3">
    <div className={labelClass}>{label}</div>
    <div className="mt-1 text-sm leading-7">{value}</div>
  </div>
);}

function ScoreBar({score}){
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
        <div className="h-full" style={{width:`${score}%`, backgroundColor:"var(--accent)"}}/>
      </div>
      <div className="w-14 text-right text-sm tabular-nums font-medium">{score} / 100</div>
    </div>
  );
}

function CategoryCard({ c }){
  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-4 hover:shadow-sm transition-shadow">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-base font-medium">{c.key}</div>
      </div>
      <ScoreBar score={c.score100}/>
      <p className="mt-2 text-sm leading-7 text-neutral-700">{c.text}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Info label="ラッキーカラー" value={c.luck.color}/>
        <Info label="ラッキーアイテム" value={c.luck.item}/>
        <Info label="ラッキープレイス" value={c.luck.place}/>
        <Info label="ラッキーパーソン" value={c.luck.person}/>
        <Info label="ラッキーフード" value={c.luck.food}/>
        <Info label="良い時間帯／方角" value={`${c.luck.time} ／ ${c.luck.dir}`}/>
      </div>
    </div>
  );
}

function BasisTable({ seed }){
  const {pillars,fiveCount,dominant}=useMemo(()=>dummyPillars(seed),[seed]);
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-300">
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
            <td className="p-2">木:{fiveCount["木"]} 火:{fiveCount["火"]} 土:{fiveCount["土"]} 金:{fiveCount["金"]} 水:{fiveCount["水"]}（主：{dominant}）</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BasicInfoCard({ dob, base, place, gender }){
  const mainNum = useMemo(()=> dob? dummyMainStar(dob):9, [dob]);
  const main = nineStarName(mainNum);
  const monthNum = useMemo(()=> dob? dummyMonthStar(dob):1, [dob]);
  const month = nineStarName(monthNum);
  const keisha = useMemo(()=> dummyKeisha(dob+place+gender), [dob,place,gender]);
  const sameYear = useMemo(()=> dummyDoukai(dob+fmtDate(base)+"Y"), [dob,base]);
  const antiYear = useMemo(()=> dummyHiDoukai(dob+fmtDate(base)+"Y"), [dob,base]);
  const sameMonth = useMemo(()=> dummyDoukai(dob+fmtDate(base)+"M"), [dob,base]);
  const antiMonth = useMemo(()=> dummyHiDoukai(dob+fmtDate(base)+"M"), [dob,base]);
  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-4">
      <div className="mb-2 text-sm text-neutral-500">基本情報（簡易）</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Info label="本命星" value={`${main}（${mainNum}）`}/>
        <Info label="月命星" value={`${month}（${monthNum}）`}/>
        <Info label="傾斜" value={keisha}/>
        <Info label="年同会/被同会" value={`${sameYear}／${antiYear}`}/>
        <Info label="月同会/被同会" value={`${sameMonth}／${antiMonth}`}/>
      </div>
      <p className="mt-2 text-xs text-neutral-500">※ 算出は仮ロジックです（本実装で精密化します）。</p>
    </div>
  );
}

// 遁甲盤（八方位）
function DunjiaCompass({ luckyDirs=[], unluckyDirs=[], tendo, saiha }){
  const size=260, r=100, cx=size/2, cy=size/2;
  const toRad=(deg)=>(deg*Math.PI)/180, centerAngle=(i)=>-90+i*45;
  const wedgePath=(i)=>{ const start=toRad(centerAngle(i)-22.5), end=toRad(centerAngle(i)+22.5);
    const sx=cx+Math.cos(start)*r, sy=cy+Math.sin(start)*r, ex=cx+Math.cos(end)*r, ey=cy+Math.sin(end)*r;
    const laf=end-start>Math.PI?1:0; return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${laf} 1 ${ex} ${ey} Z`; };
  const markAt=(dir,color,radius=r+14,sizePx=6)=>{ const i=DIRECTIONS.indexOf(dir); if(i<0) return null;
    const a=toRad(centerAngle(i)), x=cx+Math.cos(a)*radius, y=cy+Math.sin(a)*radius;
    return <circle key={`m-${dir}-${color}`} cx={x} cy={y} r={sizePx} fill={color} stroke="#fff" strokeWidth={2}/>; };
  const isLucky=(d)=>luckyDirs.includes(d), isUnlucky=(d)=>unluckyDirs.includes(d);
  const luckyFill="rgba(60,87,104,0.22)", luckyStroke=PALETTE.c2, unluckyFill="rgba(137,137,137,0.22)", unluckyStrk=PALETTE.c4;
  const tendoColor=PALETTE.c7, saihaColor=PALETTE.c1;

  return (
    <svg width={size} height={size} className="mx-auto block">
      <circle cx={cx} cy={cy} r={r+12} fill="#fff" stroke={PALETTE.c6}/>
      {DIRECTIONS.map((d,i)=>{ const fill=isLucky(d)?luckyFill:isUnlucky(d)?unluckyFill:"#f8fafc"; const stroke=isUnlucky(d)?unluckyStrk:isLucky(d)?luckyStroke:PALETTE.c6;
        return <path key={`w-${d}`} d={wedgePath(i)} fill={fill} stroke={stroke} strokeWidth={1.5}/>; })}
      {DIRECTIONS.map((d,i)=>{ const a=toRad(centerAngle(i)), x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
        return (<g key={`g-${d}`}><line x1={cx} y1={cy} x2={x} y2={y} stroke={PALETTE.c6}/><text x={cx+Math.cos(a)*(r+26)} y={cy+Math.sin(a)*(r+26)} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill={PALETTE.c3}>{d}</text></g>); })}
      <circle cx={cx} cy={cy} r={3} fill={PALETTE.c5}/>
      {tendo && markAt(tendo, tendoColor, r+16, 7)}
      {saiha && markAt(saiha, saihaColor, r+16, 5)}
      {/* 凡例 */}
      <g transform={`translate(${cx-80}, ${cy+r+36})`}><rect x={0} y={-12} width={160} height={26} fill="#fff" stroke={PALETTE.c6} rx={6}/>
        <circle cx={12} cy={1} r={5} fill={luckyStroke}/><text x={22} y={5} fontSize={11} fill={PALETTE.c3}>吉方位</text>
        <circle cx={72} cy={1} r={5} fill={unluckyStrk}/><text x={82} y={5} fontSize={11} fill={PALETTE.c3}>凶方位</text></g>
      <g transform={`translate(${cx-80}, ${cy+r+64})`}><rect x={0} y={-12} width={160} height={26} fill="#fff" stroke={PALETTE.c6} rx={6}/>
        <circle cx={12} cy={1} r={5} fill={PALETTE.c7}/><text x={22} y={5} fontSize={11} fill={PALETTE.c3}>天道</text>
        <circle cx={72} cy={1} r={5} fill={PALETTE.c1}/><text x={82} y={5} fontSize={11} fill={PALETTE.c3}>歳破</text></g>
    </svg>
  );
}

// 簡易 天道/歳破
function dummyTendoDir(seed){ return DIRECTIONS[seededIndex(seed+"TEN",8)]; }
function dummySaihaDir(seed){ return DIRECTIONS[seededIndex(seed+"SAI",8)]; }
function prioritizedTendoSaiha(date){
  const ySeed=String(date.getFullYear()), mSeed=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`, dSeed=fmtDate(date);
  return { tendo: dummyTendoDir(ySeed)||dummyTendoDir(mSeed)||dummyTendoDir(dSeed), saiha: dummySaihaDir(ySeed)||dummySaihaDir(mSeed)||dummySaihaDir(dSeed) };
}

// ミニカレンダー
function MiniCalendar({ value, onChange }){
  const year=value.getFullYear(), month=value.getMonth();
  const first=new Date(year,month,1), startW=first.getDay(), days=new Date(year,month+1,0).getDate();
  const prev=()=>onChange(new Date(year,month-1,Math.min(value.getDate(), new Date(year,month,0).getDate())));
  const next=()=>onChange(new Date(year,month+1,Math.min(value.getDate(), new Date(year,month+2,0).getDate())));
  const cells=[];
  for(let i=0;i<startW;i++) cells.push(null);
  for(let d=1; d<=days; d++) cells.push(new Date(year,month,d));
  return (
    <div className="rounded-xl border border-neutral-300 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <button className="rounded border border-neutral-300 px-2 py-1 text-xs" onClick={prev}>←</button>
        <div className="text-sm font-medium">{year}年 {month+1}月</div>
        <button className="rounded border border-neutral-300 px-2 py-1 text-xs" onClick={next}>→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-500 mb-1">
        {["日","月","火","水","木","金","土"].map(w=><div key={w}>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d,i)=> d? (
          <button key={i} onClick={()=>onChange(d)}
            className={`rounded p-2 text-xs ${fmtDate(d)===fmtDate(value)? "text-white" : "text-neutral-700"}`}
            style={{ backgroundColor: fmtDate(d)===fmtDate(value)? "var(--accent)" : "#fff", border:"1px solid #d4d4d8" }}>
            {d.getDate()}
          </button>
        ) : <div key={i} />)}
      </div>
    </div>
  );
}

// ---- dev tests ----
function runDevTests(){
  const y=2025, t=new Date("2025-08-11T00:00:00+09:00");
  console.assert(approxSetsu(y).length===12,"setsu 12");
  console.assert(/\d{4}-\d{2}-\d{2} 〜 \d{4}-\d{2}-\d{2}/.test(monthRangeSetsu(t)),"month fmt");
  console.assert(seasonRangesSetsu(t).length===4,"4 seasons");
  console.assert(nineStarName(1)==="一白水星" && nineStarName(9)==="九紫火星","9star map");
  const s=buildResultBySeed("1990-01-01","seed");
  console.assert(s.length===5 && s.every(v=>v.score100>=0&&v.score100<=100),"100 score");
}
if(typeof window!=="undefined"){ try{ runDevTests(); }catch(e){ console.error(e);} }

// ---- ルート ----
export default function App(){
  // 登録
  const [dob,setDob]=useState(""); const [email,setEmail]=useState(""); const [nick,setNick]=useState("");
  const [time,setTime]=useState("12:00"); const [place,setPlace]=useState(""); const [gender,setGender]=useState("未選択");
  const [registered,setRegistered]=useState(false);

  // UI
  const [tab,setTab]=useState("home");
  const [menuOpen,setMenuOpen]=useState(false);
  const [editOpen,setEditOpen]=useState(false);
  const [friends, setFriends] = useState([]);
  // 選択中の友達ID
const [selectedFriendId, setSelectedFriendId] = useState(null);

// 友達追加フォーム
const [friendForm, setFriendForm] = useState({
  name: "",
  dob: "",
  time: "12:00",
  place: "",
  gender: "未選択",
});
// 友達を追加
function addFriend(e) {
  e.preventDefault();
  const id =
    (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now());

  const newFriend = {
    id,
    name: friendForm.name.trim(),
    dob: friendForm.dob,
    time: friendForm.time,
    place: friendForm.place,
    gender: friendForm.gender,
  };

  if (!newFriend.name || !newFriend.dob) {
    alert("名前と生年月日は必須です");
    return;
  }

  const next = [...friends, newFriend];
  setFriends(next);
  try {
    localStorage.setItem("unsei-design-friends", JSON.stringify(next));
  } catch {}

  setFriendForm({ ...friendForm, name: "", dob: "" });
  setSelectedFriendId(id);
}

// 一覧で選択
function selectFriend(id) {
  setSelectedFriendId(id);
}

// 友達を削除
function removeFriend(id) {
  const next = friends.filter(f => f.id !== id);
  setFriends(next);
  try {
    localStorage.setItem("unsei-design-friends", JSON.stringify(next));
  } catch {}
  if (selectedFriendId === id) setSelectedFriendId(null);
}


  const [viewDate,setViewDate]=useState(()=>new Date());
// friends が変わるたびに localStorage に保存
useEffect(() => {
  try {
    localStorage.setItem("unsei-design-friends", JSON.stringify(friends));
    
  } catch (e) {
    console.error("failed to save friends to localStorage", e);
  }
}, [friends]);

  useEffect(()=>{ try{
    const saved=localStorage.getItem("unsei-design-profile");
    if(saved){ const p=JSON.parse(saved);
      setDob(p.dob||""); setEmail(p.email||""); setNick(p.nick||"");
      setTime(p.time||"12:00"); setPlace(p.place||""); setGender(p.gender||"未選選");
      if(p.dob) setRegistered(true);
    }
  }catch{} },[]);
// 友達リストを起動時に読み込む
useEffect(() => {
  try {
    const savedFriends = localStorage.getItem("unsei-design-friends");
    if (savedFriends) {
      const arr = JSON.parse(savedFriends);
      if (Array.isArray(arr)) setFriends(arr);
    }
  } catch (e) {
    console.error("failed to load friends from localStorage", e);
  }
}, []);

  const today=useMemo(()=>new Date(),[]);
  const base=viewDate, baseStr=fmtDate(base), todayStr=fmtDate(today);
  const ts=useMemo(()=>prioritizedTendoSaiha(base),[baseStr]);

  // データ
  const daySeed=`${baseStr}`, monthSeed=`${base.getFullYear()}-${base.getMonth()+1}-setsu`, yearSeed=`${base.getFullYear()}`;
  const dayData=useMemo(()=>dob?buildResultBySeed(dob,daySeed):[],[dob,daySeed]);
  const monthData=useMemo(()=>dob?buildResultBySeed(dob,monthSeed):[],[dob,monthSeed]);
  const yearData=useMemo(()=>dob?buildResultBySeed(dob,yearSeed):[],[dob,yearSeed]);

  const monthRange=monthRangeSetsu(base), yearRange=yearRangeSetsu(base), seasons=seasonRangesSetsu(base);

  const luckyDay   =useMemo(()=>DIRECTIONS[seededIndex(dob+daySeed+"L",8)],  [dob,daySeed]);
  const unluckyDay =useMemo(()=>DIRECTIONS[seededIndex(dob+daySeed+"U",8)],  [dob,daySeed]);
  const luckyMon   =useMemo(()=>DIRECTIONS[seededIndex(dob+monthSeed+"L",8)],[dob,monthSeed]);
  const unluckyMon =useMemo(()=>DIRECTIONS[seededIndex(dob+monthSeed+"U",8)],[dob,monthSeed]);
  const luckyYear  =useMemo(()=>DIRECTIONS[seededIndex(dob+yearSeed+"L",8)], [dob,yearSeed]);
  const unluckyYear=useMemo(()=>DIRECTIONS[seededIndex(dob+yearSeed+"U",8)], [dob,yearSeed]);

  // 登録
  const handleRegister=(e)=>{ e.preventDefault();
    if(!dob) return alert("生年月日を入力してください");
    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("メール形式が不正です");
    localStorage.setItem("unsei-design-profile", JSON.stringify({dob,email,nick,time,place,gender}));
    setRegistered(true);
  };

  // ユーザー情報保存
  const handleSaveEdit=(e)=>{ e.preventDefault();
    if(!dob) return alert("生年月日は必須です");
    localStorage.setItem("unsei-design-profile", JSON.stringify({dob,email,nick,time,place,gender}));
    setEditOpen(false);
  };

  // HOMEの指定日時遷移（簡易）
  const [qTime,setQTime]=useState("12:00");
  const onPick=(d)=>setViewDate(d);
const selectedFriend = useMemo(
  () => friends.find(f => f.id === selectedFriendId) || null,
  [friends, selectedFriendId]
);

  return (
    <div className={appClass} style={{ fontFamily:"'Hiragino Kaku Gothic ProN','Hiragino Sans','ヒラギノ角ゴ ProN W3',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Noto Sans JP','Helvetica Neue',Arial,'Apple Color Emoji','Segoe UI Emoji',sans-serif", "--accent":"#3C5768" }}>
      <div className="mx-auto max-w-2xl p-4 sm:p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className={h1Class}>運勢デザイン</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-neutral-500">{fmtDate(today)}</div>
            {SHOW_ACCENT_PICKER && <input type="color" className="h-6 w-6 rounded border border-neutral-300" defaultValue="#3C5768"/>}
          </div>
        </header>

        {!registered ? (
          <section className={`${panelClass} p-5 sm:p-6`}>
            <div className="mb-4"><div className={titleClass}>はじめに</div>
              <p className="mt-1 text-sm text-neutral-600 leading-7">生年月日・出生時間・出生地・性別を登録すると、詳しい運勢が表示されます。</p>
            </div>
            <form className="grid gap-4" onSubmit={handleRegister}>
              <div><label className={labelClass}>生年月日</label><input type="date" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={dob} onChange={(e)=>setDob(e.target.value)} required/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>出生時間</label><input type="time" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={time} onChange={(e)=>setTime(e.target.value)}/></div>
                <div><label className={labelClass}>性別</label><select className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={gender} onChange={(e)=>setGender(e.target.value)}><option>未選択</option><option>女性</option><option>男性</option><option>その他</option></select></div>
              </div>
              <div><label className={labelClass}>出生地</label><input type="text" placeholder="例：岐阜県岐阜市" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={place} onChange={(e)=>setPlace(e.target.value)}/></div>
              <div><label className={labelClass}>メールアドレス</label><input type="email" placeholder="（任意）" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
              <div><label className={labelClass}>ニックネーム</label><input type="text" placeholder="（任意）" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={nick} onChange={(e)=>setNick(e.target.value)}/></div>
              <div className="pt-2"><button type="submit" className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white shadow-sm hover:shadow" style={{backgroundColor:"#3C5768"}}>登録してはじめる</button></div>
            </form>
          </section>
        ) : (
          <>
            {/* タブ */}
            <nav className="mb-3 grid grid-cols-7 gap-2">
              {[["home","ホーム"],["daily","日別"],["monthly","月別"],["yearly","年別"],["directions","方位"],["friends","友達"],["persona","性格/先天運"]].map(([key,label])=>{
                const active=tab===key;
                return <button key={key} onClick={()=>setTab(key)} className={`rounded-xl border px-3 py-2 text-sm transition-all ${active?"text-white":"border-neutral-300 bg-white text-neutral-700 hover:shadow-sm"}`} style={active?{backgroundColor:"#3C5768",borderColor:"#3C5768"}:{}}>{label}</button>;
              })}
            </nav>

            {/* HOME（今日） */}
           {/* 友達（最小の土台） */}
{tab==="friends" && (
  <section className={`${panelClass} p-6 sm:p-8`}>
    <div className="mb-2"><div className={titleClass}>友達</div></div>

    <div className="rounded-xl border border-neutral-300 bg-white p-4">
      <p className="text-sm text-neutral-600">
        ここに「友達の追加」「一覧」「選択した友達の詳細」を順番に実装していきます。
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        まずはタブの表示だけ確認します（この段階では登録や一覧はまだ未実装です）。
      </p>
    </div>
  </section>
)}

            {tab==="home" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="text-center">
                  <div className="text-3xl sm:text-5xl font-semibold tracking-tight">運勢デザイン</div>
                  <div className="mt-2 text-base text-neutral-500">Fortune Design</div>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">四柱推命と九星気学を組み合わせた運勢アプリです。<br/>今日・今月・今年の運勢を手軽にチェックしましょう。</p>
                  <hr className="my-6 border-neutral-300"/>
                </div>
                <div className="space-y-7">
                  {/* 根拠 */}
                  <div className="rounded-xl border border-neutral-300 bg-white p-4">
                    <div className="mb-2 text-sm text-neutral-500">今日の運勢概要（{fmtWithWeekday(today)}）</div>
                    <BasisTable seed={`${dob}-${time}-${place}`}/>
                  </div>
                  {/* 遁甲盤（本日） */}
                  <div className="rounded-xl border border-neutral-300 bg-white p-4">
                    <div className="mb-2 text-sm text-neutral-500">遁甲盤（本日）</div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <DunjiaCompass luckyDirs={[DIRECTIONS[seededIndex(dob+todayStr+"L",8)]]} unluckyDirs={[DIRECTIONS[seededIndex(dob+todayStr+"U",8)]]} tendo={prioritizedTendoSaiha(today).tendo} saiha={prioritizedTendoSaiha(today).saiha}/>
                      <div className="grid content-start gap-2">
                        <Info label="基準日" value={fmtWithWeekday(today)}/>
                        <Info label="推奨時間帯" value={HOURS[seededIndex(dob+todayStr+"t",HOURS.length)]}/>
                        <Info label="推奨プレイス" value={PLACES[seededIndex(dob+todayStr+"p",PLACES.length)]}/>
                      </div>
                    </div>
                  </div>
                  {/* 調べたい日付（→ viewDateを更新） */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MiniCalendar value={viewDate} onChange={onPick}/>
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">時刻</div>
                      <input type="time" className="rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={qTime} onChange={(e)=>{ setQTime(e.target.value); const [hh,mm]=(e.target.value||"12:00").split(":").map(Number); const d=new Date(viewDate); d.setHours(hh||12,mm||0,0,0); setViewDate(d); }}/>
                      <div className="mt-3"><button className="rounded-xl px-4 py-2 text-sm font-medium text-white hover:shadow" style={{backgroundColor:"#3C5768"}} onClick={()=>{ setTab("daily"); window.scrollTo({top:0,behavior:"smooth"}); }}>この日時で見る（→ 日別）</button></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 日別 */}
            {tab==="daily" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick? `${nick} さんの`:"あなたの"}</div>
                <div className="mb-2"><div className={titleClass}>日別の運勢</div></div>
                <div className="mb-4 text-base font-medium">期間：{fmtWithWeekday(base)}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender}/>
                    <BasisTable seed={`${dob}-${time}-${place}`}/>
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate}/>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {dayData.map(c=><CategoryCard key={c.key} c={c}/>)}
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">日盤・月盤・年盤</div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DunjiaCompass luckyDirs={[luckyDay]} unluckyDirs={[unluckyDay]} tendo={ts.tendo} saiha={ts.saiha}/>
                        <DunjiaCompass luckyDirs={[luckyMon]} unluckyDirs={[unluckyMon]} tendo={ts.tendo} saiha={ts.saiha}/>
                        <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha}/>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 月別 */}
            {tab==="monthly" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick? `${nick} さんの`:"あなたの"}</div>
                <div className="mb-2"><div className={titleClass}>月別の運勢</div></div>
                <div className="mb-4 text-base font-medium">期間：{monthRange}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender}/>
                    <BasisTable seed={`${dob}-month-${time}-${place}`}/>
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate}/>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {monthData.map(c=><CategoryCard key={c.key} c={c}/>)}
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">月盤・年盤</div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <DunjiaCompass luckyDirs={[luckyMon]} unluckyDirs={[unluckyMon]} tendo={ts.tendo} saiha={ts.saiha}/>
                        <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha}/>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 年別 */}
            {tab==="yearly" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-1 text-sm text-neutral-500">{nick? `${nick} さんの`:"あなたの"}</div>
                <div className="mb-2"><div className={titleClass}>年別の運勢</div></div>
                <div className="mb-4 text-base font-medium">期間：{yearRange}</div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-4">
                    <BasicInfoCard dob={dob} base={base} place={place} gender={gender}/>
                    <BasisTable seed={`${dob}-year-${time}-${place}`}/>
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">カレンダー</div>
                      <MiniCalendar value={base} onChange={setViewDate}/>
                    </div>
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">春夏秋冬（期間）</div>
                      <div className="grid gap-2 sm:grid-cols-2">{seasons.map(s=><Info key={s.name} label={s.name} value={`${s.start} 〜 ${s.end}`}/>)}</div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {yearData.map(c=><CategoryCard key={c.key} c={c}/>)}
                    <div className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-2 text-sm text-neutral-500">年盤</div>
                      <DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha}/>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 方位 / 性格ページは前版と同等（省略なし） */}
            {tab==="directions" && (
              <section className={`${panelClass} p-6 sm:p-8`}>
                <div className="mb-4">
                  <div className={titleClass}>吉方位・凶方位（基準日：{fmtWithWeekday(base)}）</div>
                  <div className="text-sm text-neutral-500">天道・歳破は 年盤 → 月盤 → 日盤 の順で参考（簡易ロジック）</div>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded-lg border border-neutral-300 bg白 px-3 py-2 text-xs hover:shadow" onClick={async()=>{ const share=`【方位メモ】基準日:${fmtWithWeekday(base)} / 吉:${luckyDay} / 凶:${unluckyDay} / 天道:${ts.tendo} / 歳破:${ts.saiha}`; try{ await navigator.clipboard.writeText(share); alert("共有テキストをコピーしました"); }catch{ alert("コピーに失敗しました"); } }}>共有テキストをコピー</button>
                    <button className="rounded-lg border border-neutral-300 bg白 px-3 py-2 text-xs hover:shadow" onClick={()=>window.print()}>印刷/保存（ブラウザ）</button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-neutral-300 bg-white p-4"><div className="mb-2 text-sm text-neutral-500">日盤</div><DunjiaCompass luckyDirs={[luckyDay]} unluckyDirs={[unluckyDay]} tendo={ts.tendo} saiha={ts.saiha}/></div>
                  <div className="rounded-xl border border-neutral-300 bg-white p-4"><div className="mb-2 text-sm text-neutral-500">月盤</div><DunjiaCompass luckyDirs={[luckyMon]} unluckyDirs={[unluckyMon]} tendo={ts.tendo} saiha={ts.saiha}/></div>
                  <div className="rounded-xl border border-neutral-300 bg-white p-4"><div className="mb-2 text-sm text-neutral-500">年盤</div><DunjiaCompass luckyDirs={[luckyYear]} unluckyDirs={[unluckyYear]} tendo={ts.tendo} saiha={ts.saiha}/></div>
                </div>
              </section>
            )}

            {tab==="persona" && (
              <section className={`${panelClass} p-5 sm:p-6`}>
                <div className="mb-2 text-sm text-neutral-500">あなたのタイプ（簡易）</div>
                <div className="rounded-xl border border-neutral-300 bg-white p-4">
                  <div className="text-base font-medium">メイン傾向：{nick? `${nick} さんは`:""}{["分析型","社交型","直感型","勤勉型","創造型"][seededIndex(dob+gender+place,5)]}</div>
                  <p className="mt-2 text-sm leading-7 text-neutral-700">{genParagraph(dob+gender+place+"persona")}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {CATEGORY_KEYS.map(k=>(
                    <div key={k} className="rounded-xl border border-neutral-300 bg-white p-4">
                      <div className="mb-1 text-base font-medium">{k}</div>
                      <ScoreBar score={seededIndex(dob+k+"born100",101)}/>
                      <p className="mt-1 text-sm text-neutral-500">生まれ持つ傾向（ダミー算出）。</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="mx-auto mt-6 flex items-center justify-between text-xs text-neutral-500">
          <div>© 運勢デザイン – Prototype v0.7</div>
          <button className="underline-offset-2 hover:underline" onClick={()=>{ localStorage.removeItem("unsei-design-profile"); location.reload(); }}>登録情報をリセット</button>
        </footer>
      </div>

      {/* MENU（右下固定） */}
      <button className="fixed bottom-4 right-4 rounded-full px-6 py-3 text-sm font-medium text白 shadow-lg hover:shadow-xl transition-shadow" style={{backgroundColor:"#3C5768", zIndex:40}} onClick={()=>setMenuOpen(true)}>MENU</button>

      {/* ボトムシート */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setMenuOpen(false)}/>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg白 shadow-xl ring-1 ring-neutral-300 p-4">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-neutral-300"/>
            <div className="grid gap-2">
              {[["home","ホーム"],["daily","今日の運勢"],["monthly","今月の運勢"],["yearly","今年の運勢"],["directions","方位"],["persona","性格/先天運"]].map(([key,label])=>
                <button key={key} className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-800 hover:shadow-sm" onClick={()=>{ setTab(key); setMenuOpen(false); }}>{label}</button>
              )}
              <button className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text白" onClick={()=>{ setEditOpen(true); setMenuOpen(false); }}>ユーザー情報（確認・編集）</button>
              <button className="w-full rounded-xl px-4 py-3 text-sm text-neutral-600 underline underline-offset-4" onClick={()=>setMenuOpen(false)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー情報モーダル（基本情報を併記、ニックネームを上に） */}
      {editOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setEditOpen(false)}/>
          <div className="absolute left-1/2 top-1/2 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg白 p-5 shadow-xl ring-1 ring-neutral-300">
            <div className="mb-3 text-base font-medium">ユーザー情報の確認・編集</div>
            <form className="grid gap-3" onSubmit={handleSaveEdit}>
              <div><label className={labelClass}>ニックネーム</label><input type="text" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={nick} onChange={(e)=>setNick(e.target.value)}/></div>
              <div><label className={labelClass}>生年月日</label><input type="date" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={dob} onChange={(e)=>setDob(e.target.value)} required/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>出生時間</label><input type="time" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={time} onChange={(e)=>setTime(e.target.value)}/></div>
                <div><label className={labelClass}>性別</label><select className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={gender} onChange={(e)=>setGender(e.target.value)}><option>未選択</option><option>女性</option><option>男性</option><option>その他</option></select></div>
              </div>
              <div><label className={labelClass}>出生地</label><input type="text" className="mt-1 w-full rounded-lg border border-neutral-300 bg-neutral-100 p-2 text-sm" value={place} onChange={(e)=>setPlace(e.target.value)}/></div>

              {/* 基本情報プレビュー */}
              <div className="mt-2 rounded-xl border border-neutral-300 bg-neutral-50 p-3">
                <div className="mb-2 text-sm text-neutral-500">基本情報（プレビュー）</div>
                <BasicInfoCard dob={dob} base={viewDate} place={place} gender={gender}/>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button type="button" className="rounded-lg border border-neutral-300 bg白 px-4 py-2 text-sm" onClick={()=>setEditOpen(false)}>キャンセル</button>
                <button type="submit" className="rounded-lg px-4 py-2 text-sm text白" style={{backgroundColor:"#3C5768"}}>保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
