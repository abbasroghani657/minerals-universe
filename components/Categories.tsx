'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

const gemstonesData = [
  { name: 'Tourmaline', count: '48 Products', img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80' },
  { name: 'Topaz', count: '35 Products', img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=300&q=80' },
  { name: 'Kunzite', count: '22 Products', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80' },
  { name: 'Garnet', count: '67 Products', img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=300&q=80' },
  { name: 'Emerald', count: '31 Products', img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&q=80' },
  { name: 'Aquamarine', count: '44 Products', img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&q=80' },
];

const mineralsData = [
  { name: 'Tourmaline', count: '28 Products', img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80' },
  { name: 'Topaz', count: '19 Products', img: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?w=300&q=80' },
  { name: 'Quartz', count: '55 Products', img: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300&q=80' },
  { name: 'Garnet', count: '38 Products', img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=300&q=80' },
  { name: 'Emerald', count: '24 Products', img: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&q=80' },
  { name: 'Aquamarine', count: '33 Products', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80' },
];

const polishedData = [
  { name: 'Tremolite', count: '12 Products', img: 'https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=300&q=80' },
  { name: 'Rhodonite', count: '18 Products', img: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=300&q=80' },
  { name: 'Lapis Lazuli', count: '26 Products', img: 'https://images.unsplash.com/photo-1551868041-3bfcabc0a86c?w=300&q=80' },
  { name: 'Hackmanite', count: '8 Products', img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=300&q=80' },
  { name: 'Calcite', count: '21 Products', img: 'https://images.unsplash.com/photo-1602442578765-a3b374baf4d2?w=300&q=80' },
  { name: 'Afghanite', count: '7 Products', img: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80' },
];

function CatGrid({ items }: { items: typeof gemstonesData }) {
  const router = useRouter();
  return (
    <div className="cat-grid">
      {items.map((item, i) => (
        <div key={i} className="cat-tile" onClick={() => router.push(`/category/${encodeURIComponent(item.name.toLowerCase().replace(/ /g, '-'))}`)} style={{ cursor: 'pointer' }}>
          <Image src={item.img} alt={item.name} width={300} height={300} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} unoptimized />
          <div className="cat-tile-info">
            <h4>{item.name}</h4>
            <p className="cat-count">{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Categories() {
  return (
    <>
      <div className="teal-divider"></div>
      <div id="categories" className="cat-section" style={{ background: 'var(--bg)' }}>
        <div className="cat-section-inner">
          <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✦ Browse By Category</p>
          <h2 className="cat-heading">Loose <span>Gemstones</span></h2>
          <div className="teal-line left" style={{ marginBottom: 0 }}></div>
          <CatGrid items={gemstonesData} />
        </div>
      </div>
      <div className="teal-divider"></div>
      <div className="cat-section" style={{ background: '#fff' }}>
        <div className="cat-section-inner">
          <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✦ Earth&apos;s Treasures</p>
          <h2 className="cat-heading">Minerals <span>&amp; Crystals</span></h2>
          <div className="teal-line left" style={{ marginBottom: 0 }}></div>
          <CatGrid items={mineralsData} />
        </div>
      </div>
      <div className="teal-divider"></div>
      <div className="cat-section" style={{ background: 'var(--bg)' }}>
        <div className="cat-section-inner">
          <p style={{ color: 'var(--teal)', fontSize: '12px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px' }}>✦ Polished &amp; Refined</p>
          <h2 className="cat-heading">Polished <span>Stones</span></h2>
          <div className="teal-line left" style={{ marginBottom: 0 }}></div>
          <CatGrid items={polishedData} />
        </div>
      </div>
      <div className="teal-divider"></div>
    </>
  );
}
