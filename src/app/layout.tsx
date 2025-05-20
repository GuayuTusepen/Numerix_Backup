import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Geist_Mono removed as not explicitly used
import './globals.css';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/AppProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Numerix - Aprendizaje Divertido de Matemáticas',
  description: 'Lecciones interactivas de matemáticas para niños por Numerix',
  manifest: '/manifest.json', // Added manifest link for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="application-name" content="Numerix" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Numerix" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" /> 
        <meta name="msapplication-TileColor" content="#FFC857" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#FFC857" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" data-ai-hint="app icon" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.png" data-ai-hint="app icon" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" data-ai-hint="app icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" data-ai-hint="app icon" />
        
        {/* Maskable icon is referenced in manifest.json */}
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
