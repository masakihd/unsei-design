export default function Page() {
  return (
    <main style={{ padding: "24px", maxWidth: 720, margin: "0 auto", lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>占いフォーム</h1>
      <form method="GET" action="/fortune" style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          ユーザーID
          <input name="user" type="text" defaultValue="guest" style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          日付
          <input name="date" type="date" style={{ width: "100%", padding: 8, border: "1px solid #e5e7eb", borderRadius: 6 }} />
        </label>
        <button type="submit" style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#111", color: "#fff" }}>
          結果を見る
        </button>
      </form>
      <p style={{ marginTop: 16, color: "#666" }}>
        ※ 入力後、「結果を見る」を押すと <code>/fortune?user=...&date=...</code> へ遷移します。
      </p>
    </main>
  );
}
