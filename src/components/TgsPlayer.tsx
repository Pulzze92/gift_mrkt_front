import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import pako from 'pako';
import styles from './style.module.scss';

interface TgsPlayerProps {
  src: string;
  className?: string;
}

const TgsPlayer: React.FC<TgsPlayerProps> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const loadTgs = async () => {
      try {
        const response = await fetch(src, {
          mode: 'no-cors',
          credentials: 'omit',
        });
        const buffer = await response.arrayBuffer();

        const uint8Array = new Uint8Array(buffer);
        const decompressed = pako.inflate(uint8Array);

        const decoder = new TextDecoder('utf-8');
        const jsonString = decoder.decode(decompressed);
        const animationData = JSON.parse(jsonString);

        if (containerRef.current) {
          if (animationRef.current) {
            animationRef.current.destroy();
          }

          animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData,
          });
        }
      } catch (error) {
        console.error('Error loading TGS:', error);
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
    <div ref={containerRef} className={className}>
      <div className={styles.tgsPlaceholder}>
        <div className={styles.tgsPlaceholderText}>Loading...</div>
      </div>
    </div>
  );
};

export default TgsPlayer;
