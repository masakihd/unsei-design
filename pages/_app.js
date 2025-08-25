import Script from 'next/script';
import "../styles/globals.css";
import 'leaflet/dist/leaflet.css';
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}


import Script from 'next/script'; export default function _AppWrapper(props){return (<><Script src="/onboarding-title.js" strategy="afterInteractive" />{require('./_app').default(props)}</>)}
