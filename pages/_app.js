import '../styles/global.css';
import Head from 'next/head';
import { SpeedInsights } from '@vercel/speed-insights/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="application-name" content="Movie Watcher" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Movie Watcher" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#e50914" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#e50914" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Movie Watcher" />
        <meta property="og:description" content="Stream your favorite movies anytime, anywhere" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://your-domain.com" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Movie Watcher" />
        <meta property="twitter:description" content="Stream your favorite movies anytime, anywhere" />
        <meta property="twitter:image" content="/og-image.jpg" />
      </Head>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}

export default MyApp;
