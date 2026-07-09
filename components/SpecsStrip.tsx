import { Scale, Globe, Microscope, FlaskConical, Scissors, Ruler } from 'lucide-react';

export default function SpecsStrip() {
  return (
    <section style={{ padding: '44px 24px', background: '#fff' }}>
      <div className="specs-strip">
        <p className="specs-title">Every Stone Comes With Full Details: <span>Complete Certification &amp; Specifications</span></p>
        <div className="specs-grid">
          <div className="spec-item"><span style={{ color: '#c5a059' }}><Scale size={28} /></span><p>Carat Weight</p></div>
          <div className="spec-item"><span style={{ color: '#c5a059' }}><Globe size={28} /></span><p>Country of Origin</p></div>
          <div className="spec-item"><span style={{ color: '#c5a059' }}><Microscope size={28} /></span><p>Clarity Grade</p></div>
          <div className="spec-item"><span style={{ color: '#c5a059' }}><FlaskConical size={28} /></span><p>Treatment Status</p></div>
          <div className="spec-item"><span style={{ color: '#c5a059' }}><Scissors size={28} /></span><p>Cut Style</p></div>
          <div className="spec-item"><span style={{ color: '#c5a059' }}><Ruler size={28} /></span><p>Dimensions</p></div>
        </div>
      </div>
    </section>
  );
}
