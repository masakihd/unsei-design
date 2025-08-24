import React, { useEffect, useState } from "react";

export default function ProfileViewer() {
  const [basic, setBasic] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("unsei.user");
      const obj = raw ? JSON.parse(raw) : {};
      setBasic(obj.basic || null);
    } catch {}
  }, []);

  return (
    <div
      data-testid="card-userinfo"
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4"
    >
      <h2 className="text-base md:text-lg font-medium text-neutral-800">
        基本情報（閲覧のみ）
      </h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        <div>
          <dt className="text-gray-500 text-sm">名前</dt>
          <dd className="font-medium text-gray-900">{basic?.name ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">生年月日</dt>
          <dd className="font-medium text-gray-900">{basic?.birthdate ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">出生時刻</dt>
          <dd className="font-medium text-gray-900">{basic?.birthtime ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">出生地</dt>
          <dd className="font-medium text-gray-900">{basic?.birthplace ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-gray-500 text-sm">タイムゾーン</dt>
          <dd className="font-medium text-gray-900">{basic?.tz ?? "Asia/Tokyo"}</dd>
        </div>
      </dl>
    </div>
  );
}
