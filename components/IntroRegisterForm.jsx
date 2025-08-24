import React, { useMemo, useState } from "react";

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県",
  "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県",
  "沖縄県"
];

function isValidDateISO(value) {
  if (!value) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && value === d.toISOString().slice(0,10);
}

function isValidTime(value) {
  if (!value) return true; // 任意
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export default function IntroRegisterForm() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthtime, setBirthtime] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [tz, setTz] = useState("Asia/Tokyo");

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!name.trim()) e.name = "名前は必須です。";
    if (!birthdate.trim()) e.birthdate = "生年月日は必須です。";
    else if (!isValidDateISO(birthdate)) e.birthdate = "日付の形式（YYYY-MM-DD）を確認してください。";
    if (birthtime && !isValidTime(birthtime)) e.birthtime = "時刻の形式（HH:MM）を確認してください。";
    if (!tz) e.tz = "タイムゾーンを選択してください。";
    return e;
  }, [name, birthdate, birthtime, tz]);

  const hasError = Object.keys(errors).length > 0;
  const showError = (key) => (submitted || touched[key]) && errors[key];

  function handleSubmit(ev) {
    ev.preventDefault();
    setSubmitted(true);
    if (hasError) return;

    const payload = {
      name: name.trim(),
      birthdate,
      birthtime: birthtime || null,
      birthplace: birthplace || null,
      tz,
      savedAt: new Date().toISOString()
    };

    if (typeof window !== "undefined") {
      try {
        const prev = window.localStorage.getItem("unsei.user");
        const prevObj = prev ? JSON.parse(prev) : {};
        window.localStorage.setItem(
          "unsei.user",
          JSON.stringify({ ...prevObj, basic: payload })
        );
        setSaved(true);
      } catch {}
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6"
      data-testid="form-intro-register"
      aria-describedby="intro-register-note"
    >
      <p id="intro-register-note" className="text-sm text-gray-500">
        必須項目を入力し「次へ（命星を算出）」を押してください。
      </p>

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          名前 <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          data-testid="input-name"
          type="text"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5768]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t)=>({ ...t, name:true }))}
          required
          aria-invalid={!!showError("name")}
          aria-describedby={showError("name") ? "err-name" : undefined}
        />
        {showError("name") && (
          <p id="err-name" data-testid="error-name" className="text-[13px] text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
          生年月日 <span className="text-red-600">*</span>
        </label>
        <input
          id="birthdate"
          data-testid="input-birthdate"
          type="date"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5768]"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          onBlur={() => setTouched((t)=>({ ...t, birthdate:true }))}
          required
          aria-invalid={!!showError("birthdate")}
          aria-describedby={showError("birthdate") ? "err-birthdate" : undefined}
        />
        {showError("birthdate") && (
          <p id="err-birthdate" data-testid="error-birthdate" className="text-[13px] text-red-600">{errors.birthdate}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="birthtime" className="block text-sm font-medium text-gray-700">
          出生時刻（任意）
        </label>
        <input
          id="birthtime"
          data-testid="input-birthtime"
          type="time"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5768]"
          value={birthtime}
          onChange={(e) => setBirthtime(e.target.value)}
          onBlur={() => setTouched((t)=>({ ...t, birthtime:true }))}
          aria-invalid={!!showError("birthtime")}
          aria-describedby={showError("birthtime") ? "err-birthtime" : undefined}
        />
        {showError("birthtime") && (
          <p id="err-birthtime" data-testid="error-birthtime" className="text-[13px] text-red-600">{errors.birthtime}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="birthplace" className="block text-sm font-medium text-gray-700">
          出生地（都道府県）
        </label>
        <input
          id="birthplace"
          data-testid="input-birthplace"
          list="prefecture-list"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5768]"
          value={birthplace}
          onChange={(e)=> setBirthplace(e.target.value)}
          placeholder="例）岐阜県"
        />
        <datalist id="prefecture-list">
          {PREFECTURES.map(p => <option key={p} value={p} />)}
        </datalist>
      </div>

      <div className="space-y-2">
        <label htmlFor="tz" className="block text-sm font-medium text-gray-700">
          タイムゾーン <span className="text-red-600">*</span>
        </label>
        <select
          id="tz"
          data-testid="input-tz"
          className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3c5768]"
          value={tz}
          onChange={(e)=> setTz(e.target.value)}
          required
          aria-invalid={!!showError("tz")}
          aria-describedby={showError("tz") ? "err-tz" : undefined}
        >
          <option value="Asia/Tokyo">Asia/Tokyo（日本標準時）</option>
          <option value="Asia/Seoul">Asia/Seoul</option>
          <option value="Asia/Taipei">Asia/Taipei</option>
          <option value="Asia/Shanghai">Asia/Shanghai</option>
          <option value="Asia/Bangkok">Asia/Bangkok</option>
          <option value="UTC">UTC</option>
        </select>
        {showError("tz") && (
          <p id="err-tz" data-testid="error-tz" className="text-[13px] text-red-600">{errors.tz}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          data-testid="btn-next-intro"
          className="w-full bg-[#3c5768] text-white rounded-xl px-4 py-3 hover:opacity-90 transition"
          aria-label="次へ（命星を算出）"
        >
          次へ（命星を算出）
        </button>
      </div>

      {saved && (
        <p
          data-testid="toast-saved"
          className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
          role="status"
        >
          入力内容を一時保存しました。続いて占術計算画面へ接続できます（次ステップで有効化）。
        </p>
      )}
    </form>
  );
}
