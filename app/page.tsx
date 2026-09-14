import ScrollReveal from '@/components/ScrollReveal';
import HeroSlider from '@/components/HeroSlider';
import TrustBar from '@/components/TrustBar';
import About from '@/components/About';
import Products from '@/components/Products';
import SpecsStrip from '@/components/SpecsStrip';
import Categories from '@/components/Categories';
import Bundles from '@/components/Bundles';
import CustomOrder from '@/components/CustomOrder';
import SourcingMap from '@/components/SourcingMap';
import InstagramGrid from '@/components/InstagramGrid';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

import { getHomepageSettings, getHomepageProducts } from '@/lib/homepageData';

export const revalidate = 60;

export default async function Home() {
  const [settings, products] = await Promise.all([
    getHomepageSettings(),
    getHomepageProducts(),
  ]);

  return (
    <>
      <ScrollReveal />
      <HeroSlider initialSettings={settings} />
      <TrustBar />
      <About />
      <Products initialProducts={products} />
      <SpecsStrip />
      <Categories />
      <Bundles />
      <CustomOrder />
      <SourcingMap />
      <InstagramGrid />
      <Reviews />
      <FAQ />
      <Contact />
    </>
  );
}
