import { generateFortune } from "../../lib/fortune";

function Stars({ score }: { score: 1 | 2 | 3 | 4 | 5 }) {
  const filled = "★".repeat(score);
  const empty = "☆".repeat(5 - score);
  return <span aria-label={`score ${score} of 5`}>{filled}{empty}</span>;
}

export default function Page({ searchParams }: { searchParams?: { user?: string; date?: string } }) {
  const userId = (searchParams?.user ?? "guest").toString();
  const date = searchParams?.date ? new Date(searchParams.date) : new Date();

  const fortune = generateFortune(date, userId);

  return (
    <main style={{ padding: "24px", maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>今日の運勢</h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        {fortune.date} ／ User: <code>{fortune.userId}</code>
      </p>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>総合</h2>
        <p><Stars score={fortune.overall.score} />　{fortune.overall.advice}</p>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>仕事運</h2>
        <p><Stars score={fortune.work.score} />　{fortune.work.advice}</p>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>恋愛運</h2>
        <p><Stars score={fortune.love.score} />　{fortune.love.advice}</p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>金運</h2>
        <p><Stars score={fortune.money.score} />　{fortune.money.advice}</p>
      </section>

      <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
        <p style={{ margin: 0 }}>ラッキーカラー：<strong>{fortune.luckyColor}</strong></p>
        <p style={{ margin: 0 }}>ラッキーアイテム：<strong>{fortune.luckyItem}</strong></p>
      </div>

      <p style={{ marginTop: 24, color: "#666" }}>
        ※ クエリで <code>?user=your-id</code> や <code>?date=2025-08-15</code> を指定すると、結果が決定的に変わります。
      </p>
    </main>
  );
}
