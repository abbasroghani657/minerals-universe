const fs = require('fs');
let code = fs.readFileSync('components/HeroSlider.tsx', 'utf8');

// Replace the slide-content container with clean, box-free inline styles
const regex = /className="slide-content"[\s\S]*?transition:\s*'transform 0\.1s ease-out, opacity 0\.1s ease-out',[\s\S]*?\}\}/;

const newStyle = `className="slide-content"
                  style={{
                    opacity: Math.max(0, 1 - scrollProgress * 1.8),
                    transform: \`translateY(-\${scrollProgress * 50}px)\`,
                    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    boxShadow: 'none',
                    backdropFilter: 'none',
                    WebkitBackdropFilter: 'none',
                    padding: '0 20px',
                    maxWidth: '880px',
                    margin: '0 auto 30px',
                  }}`;

if (regex.test(code)) {
  code = code.replace(regex, newStyle);
  fs.writeFileSync('components/HeroSlider.tsx', code, 'utf8');
  console.log('Successfully added inline box-free styles to HeroSlider.tsx!');
} else {
  console.error('Regex did not match slide-content in HeroSlider.tsx');
}
