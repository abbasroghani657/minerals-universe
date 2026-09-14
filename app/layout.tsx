import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import GlobalUI from '@/components/GlobalUI';
import { ClerkProvider } from '@clerk/nextjs';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Minerals Universe | Premium Gemstones & Minerals',
  description: 'Pakistan\'s premier online destination for authentic gemstones, minerals and crystals. Sapphires, Rubies, Tourmalines and more, directly sourced, certified, and delivered worldwide.',
  keywords: 'gemstones, minerals, crystals, sapphire, ruby, tourmaline, Pakistan, certified gems',
  openGraph: {
    title: 'Minerals Universe | Premium Gemstones & Minerals',
    description: 'Authentic gemstones, minerals, and crystals sourced directly from the world\'s finest geological regions.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${poppins.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning>
          <CartProvider>
            <GlobalUI>{children}</GlobalUI>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
