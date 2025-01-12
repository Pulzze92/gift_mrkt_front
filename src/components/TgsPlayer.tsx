import React, { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import pako from 'pako';
import styles from './style.module.scss';

interface TgsPlayerProps {
  src: string;
  className?: string;
}

const TgsPlayer: React.FC<TgsPlayerProps> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTgs = async () => {
      if (!containerRef.current || !src) return;

      try {
        setIsLoading(true);
        const response = await fetch(src, {
          headers: {
            Accept: 'application/octet-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        let animationData;
        try {
          // Пробуем разархивировать как .tgs
          const decompressed = pako.inflate(uint8Array, { to: 'string' });
          animationData = JSON.parse(decompressed);
        } catch (inflateError) {
          console.warn('Failed to inflate, trying raw JSON:', inflateError);
          try {
            // Если не получилось, пробуем как обычный JSON
            const decoder = new TextDecoder('utf-8');
            const jsonString = decoder.decode(uint8Array);
            animationData = JSON.parse(jsonString);
          } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            throw jsonError;
          }
        }

        // Если уже есть анимация, уничтожаем её
        if (animationRef.current) {
          animationRef.current.destroy();
        }

        // Создаем новую анимацию
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            progressiveLoad: false,
            hideOnTransparent: true,
          },
        });

        animationRef.current.addEventListener('DOMLoaded', () => {
          setIsLoading(false);
        });

        animationRef.current.addEventListener('error', (error) => {
          console.error('Lottie animation error:', error);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Failed to load sticker:', error);
        setIsLoading(false);
      }
    };

    loadTgs();

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [src]);

  return (
    <div className={styles.tgsContainer}>
      <div 
        ref={containerRef} 
        className={`${styles.tgsPlayer} ${className || ''}`}
        style={{ width: '100%', height: '100%' }}
      />
      {isLoading && (
        <div className={styles.tgsPlaceholder}>
          <div className={styles.tgsPlaceholderText}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default TgsPlayer;
