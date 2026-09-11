export interface CategoryDefinition {
  name: string;
  slug: string;
  description: string;
  image: string;
  varieties: string[];
}

export const CATEGORY_TREE: Record<string, CategoryDefinition> = {
  'Loose Gemstones': {
    name: 'Loose Gemstones',
    slug: 'loose-gemstones',
    description: '100% natural, precision-cut and faceted gemstones ready for fine jewelry crafting and investment portfolios.',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
    varieties: [
      'Aquamarine',
      'Emerald',
      'Tourmaline',
      'Sapphire',
      'Ruby',
      'Topaz',
      'Garnet',
      'Spinel',
      'Kunzite',
      'Peridot',
      'Zircon',
      'Morganite',
      'Opals',
      'Tanzanite',
      'Alexandrite',
      'Chrysoberyl',
      'Tsavorite',
      'Beryl',
    ],
  },
  'Minerals & Crystals': {
    name: 'Minerals & Crystals',
    slug: 'minerals-and-crystals',
    description: 'Museum-grade natural crystal specimens, mineral clusters, and geological marvels straight from origin mines.',
    image: 'https://images.unsplash.com/photo-1551868041-3bfcabc0a86c?w=800&q=80',
    varieties: [
      'Quartz',
      'Fluorite',
      'Pyrite',
      'Kyanite',
      'Selenite',
      'Amethyst',
      'Tourmaline Crystal',
      'Aquamarine Specimen',
      'Epidote',
      'Sphene',
      'Beryl Crystal',
      'Topaz on Matrix',
      'Mineral Specimen',
      'Rough Crystal',
    ],
  },
  'Polished Stones': {
    name: 'Polished Stones',
    slug: 'polished-stones',
    description: 'Hand-shaped cabochons, polished lapis lazuli, decorative spheres, and master artisan lapidary work.',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&q=80',
    varieties: [
      'Lapis Lazuli',
      'Rhodonite',
      'Tremolite',
      'Hackmanite',
      'Calcite',
      'Afghanite',
      'Jade',
      'Turquoise',
      'Agate',
      'Jasper',
      'Malachite',
      'Sodalite',
    ],
  },
};

export const MAIN_CATEGORY_NAMES = Object.keys(CATEGORY_TREE);

/**
 * Returns all predefined gemstone varieties for a given main category
 */
export function getVarietiesForMain(mainCat: string): string[] {
  const norm = normalizeCategory(mainCat);
  const found = Object.keys(CATEGORY_TREE).find(k => normalizeCategory(k) === norm);
  if (found && CATEGORY_TREE[found]) {
    return CATEGORY_TREE[found].varieties;
  }
  return [];
}

/**
 * Given a gemstone variety, infers which main category it belongs to
 */
export function inferMainCategory(variety: string): string {
  const normVar = (variety || '').toLowerCase().trim();
  for (const [mainCat, def] of Object.entries(CATEGORY_TREE)) {
    if (def.varieties.some(v => v.toLowerCase().trim() === normVar)) {
      return mainCat;
    }
  }

  // Heuristic fallbacks
  if (normVar.includes('crystal') || normVar.includes('cluster') || normVar.includes('specimen') || normVar.includes('matrix') || normVar.includes('geode')) {
    return 'Minerals & Crystals';
  }
  if (normVar.includes('polished') || normVar.includes('carved') || normVar.includes('sphere') || normVar.includes('cabochon') || normVar.includes('lapis')) {
    return 'Polished Stones';
  }
  return 'Loose Gemstones';
}

/**
 * Helper to normalize string for comparison
 */
export function normalizeCategory(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Checks if a string represents one of the 3 primary categories
 */
export function isPrimaryCategory(cat: string): boolean {
  const norm = normalizeCategory(cat);
  return MAIN_CATEGORY_NAMES.some(m => normalizeCategory(m) === norm);
}

export interface BadgeStyle {
  text: string;
  bg: string;
  color: string;
  icon: string;
}

export function getProductBadge(rawBadge?: string | null, isLatestFallback = false): BadgeStyle | null {
  const badgeText = rawBadge?.trim() || (isLatestFallback ? 'NEW ARRIVAL' : '');
  if (!badgeText) return null;

  const upper = badgeText.toUpperCase();
  let bg = '#1a5c4a'; // Emerald Teal
  let icon = '✦';

  if (upper.includes('RARE') || upper.includes('GRADE') || upper.includes('INVESTMENT')) {
    bg = '#c5a059'; // Gold
    icon = '★';
  } else if (upper.includes('POPULAR') || upper.includes('BEST')) {
    bg = '#d97706'; // Amber
    icon = '🔥';
  } else if (upper.includes('SALE') || upper.includes('HOT') || upper.includes('OFF')) {
    bg = '#c94438'; // Ruby Red
    icon = '%';
  } else if (upper.includes('NEW')) {
    bg = '#1a5c4a'; // Emerald Teal
    icon = '✦';
  }

  return {
    text: badgeText,
    bg,
    color: '#ffffff',
    icon,
  };
}
