"use client";

export default function HonmeiseiCard({ dob, base, place, gender, children }) {
  return (
    <section data-testid="card-honmeisei" aria-label="本命星カード">
      {children /* 後で index.js の中身を安全に移植 */}
    </section>
  );
}
