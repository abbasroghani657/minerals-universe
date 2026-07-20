import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import GlobalUI from '@/components/GlobalUI';

import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Minerals Universe — Premium Gemstones & Minerals',
  description: 'Pakistan\'s premier online destination for authentic gemstones, minerals and crystals. Sapphires, Rubies, Tourmalines & more — directly sourced, certified, and delivered worldwide.',
  keywords: 'gemstones, minerals, crystals, sapphire, ruby, tourmaline, Pakistan, certified gems',
  openGraph: {
    title: 'Minerals Universe — Premium Gemstones & Minerals',
    description: 'Authentic gemstones, minerals, and crystals sourced directly from the world\'s finest geological regions.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <CartProvider>
            <GlobalUI />
            {children}
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
