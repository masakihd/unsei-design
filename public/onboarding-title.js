(function(){
  if (typeof window === "undefined") return;
  if (location.pathname !== "/onboarding") return;
  var f = document.querySelector('[data-testid="form-intro-register"]');
  if (!f) return;
  // 既に見出しがあるなら二重挿入しない
  var prev = f.previousElementSibling;
  if (prev && prev.querySelector('[data-testid="heading-onboarding"]')) return;

  var wrap = document.createElement("div");
  wrap.className = "mb-4";
  var h1 = document.createElement("h1");
  h1.setAttribute("data-testid","heading-onboarding");
  h1.className = "text-2xl font-semibold tracking-tight";
  h1.textContent = "初期登録";
  var p = document.createElement("p");
  p.className = "mt-1 text-sm text-neutral-600 leading-7";
  p.textContent = "必須項目を入力し「次へ（命星を算出）」を押してください。";
  wrap.appendChild(h1);
  wrap.appendChild(p);
  f.parentNode.insertBefore(wrap, f);
})();
