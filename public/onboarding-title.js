(function () {
  if (typeof window === "undefined") return;

  function enhance() {
    try {
      if (!location.pathname.startsWith("/onboarding")) return;
      const root = document.getElementById("__next");
      const form = document.querySelector('[data-testid="form-intro-register"]');
      if (!root || !form) return;

      document.title = "初期登録 | 運勢デザイン";
      if (document.querySelector('[data-testid="onboarding-heading"]')) return;

      // ===== 外枠 =====
      const main = document.createElement("main");
      main.style.minHeight = "100vh";
      main.style.backgroundColor = "#F9FAFB";

      const section = document.createElement("section");
      section.style.maxWidth = "720px";
      section.style.margin = "0 auto";
      section.style.padding = "48px 20px 56px";

      // ===== ヘッダー =====
      const header = document.createElement("header");
      header.style.textAlign = "center";

      const h1 = document.createElement("h1");
      h1.dataset.testid = "onboarding-heading";
      h1.textContent = "初期登録";
      h1.style.fontSize = "28px";
      h1.style.fontWeight = "600";
      h1.style.color = "#1f2937";

      // スペーサー
      const spacer = document.createElement("div");
      spacer.style.height = "48px";

      // ===== フォーム枠 =====
      form.style.background = "#fff";
      form.style.borderRadius = "16px";
      form.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
      form.style.border = "1px solid #e5e7eb";
      form.style.padding = "24px";

      const groups = Array.from(form.querySelectorAll("div"))
        .filter(el => el.querySelector("label") && el.querySelector("input, select"));
      groups.forEach((g, idx) => {
        g.style.marginTop = idx === 0 ? "0px" : "16px";
        const label = g.querySelector("label");
        const control = g.querySelector("input, select");
        if (label) {
          label.style.display = "block";
          label.style.marginBottom = "6px";
          label.style.fontSize = "14px";
          label.style.color = "#374151";
        }
        if (control) {
          control.style.fontSize = "15px";
          control.style.padding = "10px 12px";
        }
      });

      const btnWrap = form.querySelector("div:last-child");
      if (btnWrap) {
        btnWrap.style.marginTop = "24px";
      }

      // DOM 組み立て
      header.appendChild(h1);
      header.appendChild(spacer);
      section.appendChild(header);
      section.appendChild(form);

      root.insertBefore(main, root.firstChild);
      main.appendChild(section);

      // === 新規: intro-register-note の下にスペーサーを追加 ===
      const note = document.getElementById("intro-register-note");
      if (note) {
        const noteSpacer = document.createElement("div");
        noteSpacer.style.height = "24px";
        note.insertAdjacentElement("afterend", noteSpacer);
      }
    } catch (e) {
      console.warn("onboarding enhance failed:", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance, { once: true });
  } else {
    enhance();
  }
})();