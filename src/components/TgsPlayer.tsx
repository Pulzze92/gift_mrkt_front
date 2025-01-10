import React, { useEffect, useRef, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTgs = async () => {
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
          const decompressed = pako.inflate(uint8Array, { to: 'string' });
          animationData = JSON.parse(decompressed);
        } catch (inflateError) {
          console.warn('Failed to inflate, trying raw JSON:', inflateError);
          try {
            const decoder = new TextDecoder('utf-8');
            const jsonString = decoder.decode(uint8Array);
            animationData = JSON.parse(jsonString);
          } catch (jsonError) {
            console.error('Failed to parse JSON:', jsonError);
            throw jsonError;
          }
        }

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
            rendererSettings: {
              progressiveLoad: false,
              hideOnTransparent: true,
            },
          });
          animationRef.current.addEventListener('DOMLoaded', () => {
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error('Error loading TGS:', error);
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
    <div ref={containerRef} className={className}>
      {isLoading && (
        <div className={styles.tgsPlaceholder}>
          <div className={styles.tgsPlaceholderText}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default TgsPlayer;
