import Script from "next/script";
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="/onboarding-title.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
