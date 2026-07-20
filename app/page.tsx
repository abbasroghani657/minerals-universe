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
import Loader from '@/components/Loader';

export default function Home() {
  return (
    <>
      <Loader />
      <main>
        <HeroSlider />
        <TrustBar />
        <About />
        <Products />
        <SpecsStrip />
        <Categories />
        <Bundles />
        <CustomOrder />
        <SourcingMap />
        <InstagramGrid />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
