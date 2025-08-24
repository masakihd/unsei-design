import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

const ProfileViewer = dynamic(() => import("../../components/ProfileViewer"), { ssr: false });

export default function ProfilePage() {
  // 006-6N: populate stars from localStorage (unsei.calc)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("unsei.calc");
      if (!raw) return;
      const calc = JSON.parse(raw);
      const set = (id, val) => {
        const el = document.querySelector(`[data-testid="${id}"]`);
        if (el && typeof val === "string" && val.trim()) el.textContent = val;
      };
      set("star-honmei",  calc?.honmei  ?? "—");
      set("star-getsu",   calc?.getsu   ?? "");
      set("star-keisha",  calc?.keisha  ?? "");
    } catch {}
  }, []);
  return (
    <>
      <Head>
        <title>ユーザー情報 | 運勢デザイン</title>
        <meta name="description" content="保存済みの基本情報を表示します（閲覧のみ）" />
      </Head>

      <main className="min-h-screen bg-gray-50" data-testid="page-profile">
        <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <header className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">ユーザー情報</h1>
            <p className="mt-2 text-gray-600 text-sm md:text-base">
              「はじめに」で保存した基本情報を表示します（編集はまだ行いません）。
            </p>
          </header>

          <div data-testid="card-userinfo">
  <noscript>読み込み中...</noscript>
  <ProfileViewer />
</div>
          
          {/* 占術情報カード（次ステップで計算結果を表示） */}
          <div
            data-testid="card-unsei"
            className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-3"
          >
            <h2 className="text-base md:text-lg font-medium text-neutral-800">占術情報</h2>
            <p className="text-sm text-gray-600">
              次のステップで算出結果（本命星・月命星・傾斜星など）を表示します。
            </p>
          
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3" data-testid="list-stars">
              <div>
                <dt className="text-gray-500 text-sm">本命星</dt>
                <dd className="font-medium text-gray-900" data-testid="star-honmei">—</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-sm">月命星</dt>
                <dd className="font-medium text-gray-900" data-testid="star-getsu">—</dd>
              </div>
              <div>
                <dt className="text-gray-500 text-sm">傾斜星</dt>
                <dd className="font-medium text-gray-900" data-testid="star-keisha">—</dd>
              </div>
            </dl>
</div>

          <div className="mt-6 flex gap-2">
            <a href="/" data-testid="link-home"
               className="rounded-xl px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition">トップへ</a>
            <a href="/onboarding" data-testid="link-onboarding"
               className="rounded-xl px-3 py-2 bg-[#3c5768] text-white hover:opacity-90 transition">はじめにへ</a>
          </div>
        </section>
      </main>
    </>
  );
}





