'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    // 1. Observe all major sections
    const sections = document.querySelectorAll(
      '.trust-section, section:not(.hero), .about-section, .products-section, .specs-strip, .cat-section, .bundle-section, .custom-section, .origin-section, .insta-section, .reviews-section, .faq-section, .contact-section'
    );

    sections.forEach((sec) => {
      sec.classList.add('reveal-section');
    });

    // 2. Observe all cards inside grids with staggered animation delays
    const cardGrids = document.querySelectorAll(
      '.trust-grid, .products-grid, .cat-grid, .bundle-grid, .origin-cards, .insta-grid, .review-cards, .specs-grid'
    );

    cardGrids.forEach((grid) => {
      const children = Array.from(grid.children);
      children.forEach((child, index) => {
        child.classList.add('reveal-card');
        (child as HTMLElement).style.setProperty('--card-delay', `${(index % 4) * 0.12}s`);
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.reveal-section, .reveal-card').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
