export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <a href="/fortune/form" style={{ textDecoration: "underline" }}>占いフォーム</a>
        <a href="/" style={{ textDecoration: "underline" }}>トップへ</a>
      </nav>
      {children}
    </div>
  );
}
