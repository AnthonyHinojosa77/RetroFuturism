import type { Metadata } from 'next';
import '@/styles/globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Retro Universe',
  description: 'Retro-futuristic point-and-click worlds: Diner, Voyages, and Expo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Permanent+Marker&family=Space+Grotesk:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
