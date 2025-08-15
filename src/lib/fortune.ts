import { rngFor, pick } from "./prng";

export type FortuneCategory = "overall" | "work" | "love" | "money";

export type FortuneDetail = {
  score: 1 | 2 | 3 | 4 | 5;   // ☆1〜5
  advice: string;             // アドバイス文
};

export type FortuneResult = {
  date: string;               // YYYY-MM-DD
  userId: string;
  overall: FortuneDetail;
  work: FortuneDetail;
  love: FortuneDetail;
  money: FortuneDetail;
  luckyColor: string;
  luckyItem: string;
};

// 各カテゴリの候補（スコアと短いアドバイス）
const POOL: Record<FortuneCategory, FortuneDetail[]> = {
  overall: [
    { score: 5, advice: "追い風。やるべきことを先に片付けて好機を掴もう。" },
    { score: 4, advice: "堅実に進めば成果が見える日。小さな改善を重ねて。" },
    { score: 3, advice: "平常運。焦らず基本を徹底すると安定。" },
    { score: 2, advice: "予定変更に備えて余白を。確認とバックアップを怠らず。" },
    { score: 1, advice: "無理は禁物。休息と見直しに充てると吉。" },
  ],
  work: [
    { score: 5, advice: "段取り勝ち。朝一で優先度の高い案件から着手。" },
    { score: 4, advice: "レビュー依頼が吉。第三者の目で品質が上がる。" },
    { score: 3, advice: "定例タスクの自動化に着手すると後がラク。" },
    { score: 2, advice: "要件の解釈違いに注意。メモを取り合意を文書化。" },
    { score: 1, advice: "トラブルの予兆。ログと監視を強化し慎重に。" },
  ],
  love: [
    { score: 5, advice: "素直な言葉が届く日。短く具体的に伝えると◎。" },
    { score: 4, advice: "共通の話題で距離が縮む。相手の興味を拾って。" },
    { score: 3, advice: "聞き役に回ると好印象。頷きと要約が鍵。" },
    { score: 2, advice: "早とちり注意。事実確認をしてから反応を。" },
    { score: 1, advice: "距離感を保つのが吉。返信はワンクッション置いて。" },
  ],
  money: [
    { score: 5, advice: "固定費の見直しが大収穫。年額換算で判断を。" },
    { score: 4, advice: "欲しい物は比較検討を。価格追跡で良い買い物に。" },
    { score: 3, advice: "現状維持。衝動買いだけ避ければOK。" },
    { score: 2, advice: "サブスクの重複に注意。解約リストを作成。" },
    { score: 1, advice: "貸し借りはトラブルの元。今日は見送って正解。" },
  ],
};

const COLORS = [
  "ネイビー", "バーガンディ", "ターコイズ", "フォレストグリーン", "マスタード",
  "コーラル", "ラベンダー", "チャコール", "ホワイト", "ブラック"
];

const ITEMS = [
  "万年筆", "手帳", "イヤホン", "ミントタブレット", "バンドエイド",
  "ハンカチ", "USBメモリ", "携帯充電器", "アロマオイル", "メガネ拭き"
];

function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** 日付とユーザーIDから、その日の占い結果を決定的に生成 */
export function generateFortune(date: Date, userId: string): FortuneResult {
  const rng = rngFor(date, userId);
  const dateStr = ymd(date);

  const overall = pick(rng, POOL.overall);
  const work    = pick(rng, POOL.work);
  const love    = pick(rng, POOL.love);
  const money   = pick(rng, POOL.money);

  const luckyColor = pick(rng, COLORS);
  const luckyItem  = pick(rng, ITEMS);

  return { date: dateStr, userId, overall, work, love, money, luckyColor, luckyItem };
}
