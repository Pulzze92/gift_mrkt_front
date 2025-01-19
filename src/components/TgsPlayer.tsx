import React, { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import pako from 'pako';
import styles from './style.module.scss';

const BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://giftmarket-backend.unitaz.xyz';

const animationsCache: Record<string, any> = {};

interface TgsPlayerProps {
  src: string;
  className?: string;
  preload?: boolean;
}

const TgsPlayer: React.FC<TgsPlayerProps> = ({ src, className, preload }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTgs = async () => {
      if (!containerRef.current || !src) return;

      try {
        setIsLoading(true);
        
        let fetchUrl = src;
        if (src.startsWith('stickers/')) {
          const cleanSrc = src.replace('stickers/', '');
          fetchUrl = `${BASE_URL}/stickers/${cleanSrc}`;
        }

        let animationData = animationsCache[fetchUrl];

        if (!animationData) {
          const response = await fetch(fetchUrl, {
            headers: {
              Accept: 'application/octet-stream',
              initdata: window.Telegram?.WebApp?.initData || '',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const buffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);

          try {
            const decompressed = pako.inflate(uint8Array, { to: 'string' });
            animationData = JSON.parse(decompressed);
            animationsCache[fetchUrl] = animationData;
          } catch (inflateError) {
            console.warn('Failed to inflate, trying raw JSON:', inflateError);
            try {
              const decoder = new TextDecoder('utf-8');
              const jsonString = decoder.decode(uint8Array);
              animationData = JSON.parse(jsonString);
              animationsCache[fetchUrl] = animationData;
            } catch (jsonError) {
              console.error('Failed to parse JSON:', jsonError);
              throw jsonError;
            }
          }
        }

        if (animationRef.current) {
          animationRef.current.destroy();
        }

        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            progressiveLoad: false,
            hideOnTransparent: true,
            className: className,
          },
        });

        if (className?.includes('backgroundSymbol')) {
          const svg = containerRef.current.querySelector('svg');
          if (svg) {
            const parent = containerRef.current.parentElement;
            const pattern = parent?.parentElement;
            if (pattern) {
              const containers = pattern.querySelectorAll(
                `.${styles.symbolWrapper}`
              );
              containers.forEach((container) => {
                if (!container.querySelector('svg')) {
                  const clone = svg.cloneNode(true);
                  container
                    .querySelector(`.${styles.tgsPlayer}`)
                    ?.appendChild(clone);
                }
              });
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load sticker:', error, 'URL:', src);
        setIsLoading(false);
      }
    };

    loadTgs();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [src, className]);

  return (
    <div className={styles.tgsContainer}>
      <div
        ref={containerRef}
        className={`${styles.tgsPlayer} ${className || ''}`}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default TgsPlayer;
