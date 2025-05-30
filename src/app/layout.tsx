"use client";

import { Geist } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registrado con éxito:', registration))
        .catch((error) => console.error('Error al registrar Service Worker:', error));
    }
  }, []);

  return (
    <html lang="es">
      <head>
        <title>Numerix - Aprendizaje Divertido de Matemáticas</title>
        <meta name="description" content="Lecciones interactivas de matemáticas para niños por Numerix" />
        <link rel="manifest" href="/manifest.json" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-app-url.com" /> {/* TODO: Replace with actual URL when deployed */}
        <meta property="og:title" content="Numerix - Aprendizaje Divertido de Matemáticas" />
        <meta property="og:description" content="Lecciones interactivas de matemáticas para niños." />
        <meta property="og:image" content="/icons/temporal_icon.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:alt" content="Logo de Numerix" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Numerix - Aprendizaje Divertido de Matemáticas" />
        <meta name="twitter:description" content="Lecciones interactivas de matemáticas para niños." />
        <meta name="twitter:image" content="/icons/temporal_icon.png" />
        {/* PWA specific meta tags */}
        <meta name="application-name" content="Numerix" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Numerix" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#FFC857" />
        <meta name="msapplication-TileImage" content="/icons/temporal_icon.png" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FFC857" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0A0A0A" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icons/temporal_icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.png" data-ai-hint="app icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" data-ai-hint="app icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" data-ai-hint="app icon" />
      </head>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
