import React, { useState, useEffect } from 'react';
import { ArrowUp, Database, Layers } from 'lucide-react';

export default function ScrollProgressWidget() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(progress);
        setIsVisible(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 90,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'rgba(10, 14, 23, 0.92)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '30px',
      padding: '4px 6px 4px 12px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      color: 'var(--text-secondary)'
    }}>
      <a
        href="#database-design"
        style={{
          color: 'var(--accent-cyan)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          paddingRight: '6px',
          borderRight: '1px solid var(--border-subtle)'
        }}
        title="Jump to Database Schemas"
      >
        <Database size={13} />
        <span>3 DBs</span>
      </a>

      <span style={{ padding: '0 4px', minWidth: '35px', textAlign: 'center' }}>
        {scrollProgress}%
      </span>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--accent-red)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 10px var(--accent-red-glow)'
        }}
      >
        <ArrowUp size={15} />
      </button>
    </div>
  );
}
